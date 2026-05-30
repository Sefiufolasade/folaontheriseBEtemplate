const Post = require('../models/Post');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { getPaginationOptions, getSortOptions } = require('../utils/pagination');
const { audit } = require('../utils/audit');

/**
 * GET /api/posts
 * Public: list published posts with filtering, search, pagination
 */
const getPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationOptions(req.query);
  const sort = getSortOptions(req.query, ['createdAt', 'publishedAt', 'views', 'title', 'likesCount']);

  const filter = { status: 'published' };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.author) filter.author = req.query.author;
  if (req.query.featured === 'true') filter.isFeatured = true;

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  if (req.query.dateFrom || req.query.dateTo) {
    filter.publishedAt = {};
    if (req.query.dateFrom) filter.publishedAt.$gte = new Date(req.query.dateFrom);
    if (req.query.dateTo) filter.publishedAt.$lte = new Date(req.query.dateTo);
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'fullName username avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  // Mark liked/bookmarked if user is authenticated
  if (req.user) {
    const userId = req.user._id.toString();
    const bookmarks = req.user.bookmarks?.map((b) => b.toString()) || [];
    posts.forEach((p) => {
      p.isLiked = p.likes?.some((id) => id.toString() === userId) || false;
      p.isBookmarked = bookmarks.includes(p._id.toString());
    });
  }

  sendPaginated(res, { data: posts, total, page, limit });
});

/**
 * GET /api/posts/:slug
 */
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
    .populate('author', 'fullName username avatar bio socialLinks')
    .populate('category', 'name slug color')
    .populate('tags', 'name slug');

  if (!post) throw new AppError('Post not found.', 404);

  // Increment views (async, non-blocking)
  post.incrementViews().catch(() => {});

  // Related posts
  const related = await Post.find({
    _id: { $ne: post._id },
    status: 'published',
    $or: [{ category: post.category }, { tags: { $in: post.tags } }],
  })
    .select('title slug featuredImage readTime publishedAt')
    .populate('author', 'fullName username')
    .limit(4)
    .lean();

  const data = post.toObject();
  data.relatedPosts = related;

  if (req.user) {
    const userId = req.user._id.toString();
    data.isLiked = post.likes.some((id) => id.toString() === userId);
    data.isBookmarked = req.user.bookmarks?.some((id) => id.toString() === post._id.toString()) || false;
  }

  sendSuccess(res, { data });
});

/**
 * POST /api/posts  (author, editor, admin)
 */
const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id });

  await audit('CREATE_POST', { userId: req.user._id, resourceType: 'Post', resourceId: post._id, req });

  sendSuccess(res, { statusCode: 201, message: 'Post created.', data: post });
});

/**
 * PUT /api/posts/:id
 */
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found.', 404);

  // Authors can only edit their own posts
  if (req.user.role === 'author' && post.author.toString() !== req.user._id.toString()) {
    throw new AppError('You can only edit your own posts.', 403);
  }

  // Only admin/editor can publish
  if (req.body.status === 'published' && req.user.role === 'author') {
    throw new AppError('Authors cannot publish posts directly. Submit for review.', 403);
  }

  Object.assign(post, req.body);
  await post.save();

  await audit('UPDATE_POST', { userId: req.user._id, resourceType: 'Post', resourceId: post._id, req });

  sendSuccess(res, { message: 'Post updated.', data: post });
});

/**
 * DELETE /api/posts/:id  (soft delete)
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found.', 404);

  if (req.user.role === 'author' && post.author.toString() !== req.user._id.toString()) {
    throw new AppError('You can only delete your own posts.', 403);
  }

  post.isDeleted = true;
  post.deletedAt = new Date();
  post.status = 'archived';
  await post.save({ validateBeforeSave: false });

  await audit('DELETE_POST', { userId: req.user._id, resourceType: 'Post', resourceId: post._id, req });

  sendSuccess(res, { message: 'Post deleted.' });
});

/**
 * POST /api/posts/:id/like
 */
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found.', 404);

  await post.toggleLike(req.user._id);

  const isLiked = post.likes.some((id) => id.toString() === req.user._id.toString());
  sendSuccess(res, { message: isLiked ? 'Post liked.' : 'Post unliked.', data: { isLiked, likesCount: post.likesCount } });
});

/**
 * POST /api/posts/:id/bookmark
 */
const toggleBookmark = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found.', 404);

  const user = req.user;
  const bookmarks = user.bookmarks || [];
  const idx = bookmarks.findIndex((id) => id.toString() === post._id.toString());

  if (idx === -1) {
    bookmarks.push(post._id);
    post.bookmarksCount = (post.bookmarksCount || 0) + 1;
  } else {
    bookmarks.splice(idx, 1);
    post.bookmarksCount = Math.max(0, (post.bookmarksCount || 1) - 1);
  }

  user.bookmarks = bookmarks;
  await Promise.all([
    user.save({ validateBeforeSave: false }),
    post.save({ validateBeforeSave: false }),
  ]);

  const isBookmarked = idx === -1;
  sendSuccess(res, { message: isBookmarked ? 'Bookmarked.' : 'Bookmark removed.', data: { isBookmarked } });
});

/**
 * GET /api/posts/trending
 */
const getTrendingPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: 'published' })
    .sort({ views: -1, likesCount: -1 })
    .limit(10)
    .populate('author', 'fullName username avatar')
    .populate('category', 'name slug')
    .lean();

  sendSuccess(res, { data: posts });
});

/**
 * GET /api/posts/featured
 */
const getFeaturedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: 'published', isFeatured: true })
    .sort({ publishedAt: -1 })
    .limit(6)
    .populate('author', 'fullName username avatar')
    .populate('category', 'name slug')
    .lean();

  sendSuccess(res, { data: posts });
});

/**
 * GET /api/posts/admin  (all posts for author/admin management)
 */
const getPostsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationOptions(req.query);
  const filter = {};

  // Authors see only their posts
  if (req.user.role === 'author') filter.author = req.user._id;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.author) filter.author = req.query.author;

  const [posts, total] = await Promise.all([
    Post.find(filter, null, { includeDeleted: req.query.includeDeleted === 'true' })
      .populate('author', 'fullName username')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  sendPaginated(res, { data: posts, total, page, limit });
});

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  getTrendingPosts,
  getFeaturedPosts,
  getPostsAdmin,
};
