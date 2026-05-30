const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { getPaginationOptions } = require('../utils/pagination');
const { audit } = require('../utils/audit');

const getComments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationOptions(req.query);
  const postId = req.params.postId;

  const filter = { post: postId, parentComment: null, isApproved: true };

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate('user', 'fullName username avatar')
      .populate({ path: 'replies', populate: { path: 'user', select: 'fullName username avatar' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments(filter),
  ]);

  sendPaginated(res, { data: comments, total, page, limit });
});

const createComment = asyncHandler(async (req, res) => {
  const { postId, content, guestName, guestEmail, parentComment } = req.body;

  const post = await Post.findById(postId);
  if (!post || post.status !== 'published') throw new AppError('Post not found.', 404);

  // Require guest info if not authenticated
  if (!req.user && (!guestName || !guestEmail)) {
    throw new AppError('Guest name and email are required for unauthenticated comments.', 400);
  }

  const isAutoApproved = !!req.user; // Logged-in users' comments are auto-approved

  const comment = await Comment.create({
    post: postId,
    user: req.user?._id || null,
    guestName: req.user ? undefined : guestName,
    guestEmail: req.user ? undefined : guestEmail,
    content,
    parentComment: parentComment || null,
    isApproved: isAutoApproved,
    ipAddress: req.ip,
  });

  sendSuccess(res, {
    statusCode: 201,
    message: isAutoApproved ? 'Comment posted.' : 'Comment submitted for review.',
    data: comment,
  });
});

const approveComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!comment) throw new AppError('Comment not found.', 404);

  await audit('APPROVE_COMMENT', { userId: req.user._id, resourceType: 'Comment', resourceId: comment._id, req });

  sendSuccess(res, { message: 'Comment approved.', data: comment });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError('Comment not found.', 404);

  const isOwner = req.user && comment.user?.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'editor'].includes(req.user?.role);
  if (!isOwner && !isAdmin) throw new AppError('Not authorised to delete this comment.', 403);

  comment.isDeleted = true;
  await comment.save({ validateBeforeSave: false });

  await audit('DELETE_COMMENT', { userId: req.user?._id, resourceType: 'Comment', resourceId: comment._id, req });

  sendSuccess(res, { message: 'Comment deleted.' });
});

const getPendingComments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationOptions(req.query);
  const [comments, total] = await Promise.all([
    Comment.find({ isApproved: false })
      .populate('user', 'fullName username')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments({ isApproved: false }),
  ]);
  sendPaginated(res, { data: comments, total, page, limit });
});

module.exports = { getComments, createComment, approveComment, deleteComment, getPendingComments };
