const User = require('../models/User');
const Post = require('../models/Post');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { deleteFromCloudinary } = require('../config/cloudinary');

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .populate('postsCount')
    .lean();
  if (!user) throw new AppError('User not found.', 404);

  // Strip sensitive fields
  delete user.bookmarks;
  sendSuccess(res, { data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['fullName', 'bio', 'socialLinks'];
  const updates = {};
  allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  sendSuccess(res, { message: 'Profile updated.', data: user.toPublicJSON() });
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No image uploaded.', 400);

  const user = await User.findById(req.user._id);

  // Delete old avatar from Cloudinary
  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId).catch(() => {});
  }

  user.avatar = { url: req.file.path, publicId: req.file.filename };
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, { message: 'Avatar updated.', data: { avatar: user.avatar } });
});

const getUserPosts = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) throw new AppError('User not found.', 404);

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ author: user._id, status: 'published' })
      .select('title slug excerpt featuredImage publishedAt readTime views likesCount')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ author: user._id, status: 'published' }),
  ]);

  sendSuccess(res, {
    data: posts,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'bookmarks',
    match: { status: 'published' },
    select: 'title slug excerpt featuredImage publishedAt readTime',
    populate: { path: 'author', select: 'fullName username avatar' },
    options: { sort: { publishedAt: -1 } },
  });

  sendSuccess(res, { data: user.bookmarks });
});

module.exports = { getProfile, updateProfile, updateAvatar, getUserPosts, getBookmarks };
