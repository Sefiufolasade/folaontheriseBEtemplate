const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Media = require('../models/Media');
const AuditLog = require('../models/AuditLog');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/admin/dashboard
 * High-level stats overview
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalUsers,
    totalComments,
    pendingComments,
    totalSubscribers,
    activeSubscribers,
    totalMedia,
  ] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: 'published' }),
    Post.countDocuments({ status: 'draft' }),
    User.countDocuments({ isActive: true }),
    Comment.countDocuments(),
    Comment.countDocuments({ isApproved: false }),
    NewsletterSubscriber.countDocuments(),
    NewsletterSubscriber.countDocuments({ isActive: true }),
    Media.countDocuments(),
  ]);

  // Most viewed posts (top 5)
  const mostViewedPosts = await Post.find({ status: 'published' })
    .select('title slug views publishedAt featuredImage')
    .sort({ views: -1 })
    .limit(5)
    .lean();

  // Recent posts (last 5)
  const recentPosts = await Post.find()
    .select('title slug status createdAt author')
    .populate('author', 'fullName username')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Recent users (last 5)
  const recentUsers = await User.find()
    .select('fullName username email role createdAt avatar')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Recent audit logs
  const recentActivity = await AuditLog.find()
    .populate('user', 'fullName username')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  sendSuccess(res, {
    data: {
      stats: {
        posts: { total: totalPosts, published: publishedPosts, draft: draftPosts },
        users: { total: totalUsers },
        comments: { total: totalComments, pending: pendingComments },
        subscribers: { total: totalSubscribers, active: activeSubscribers },
        media: { total: totalMedia },
      },
      mostViewedPosts,
      recentPosts,
      recentUsers,
      recentActivity,
    },
  });
});

/**
 * GET /api/admin/analytics
 * Time-series analytics data
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Posts published per day
  const postsOverTime = await Post.aggregate([
    { $match: { status: 'published', publishedAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
        count: { $sum: 1 },
        views: { $sum: '$views' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // New subscribers over time
  const subscribersOverTime = await NewsletterSubscriber.aggregate([
    { $match: { subscribedAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$subscribedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // New users over time
  const usersOverTime = await User.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top categories by post count
  const topCategories = await Post.aggregate([
    { $match: { status: 'published', category: { $exists: true } } },
    { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { name: '$category.name', slug: '$category.slug', count: 1, totalViews: 1 } },
  ]);

  // Top tags
  const topTags = await Post.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
    { $lookup: { from: 'tags', localField: '_id', foreignField: '_id', as: 'tag' } },
    { $unwind: '$tag' },
    { $project: { name: '$tag.name', slug: '$tag.slug', count: 1 } },
  ]);

  // User roles breakdown
  const usersByRole = await User.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);

  sendSuccess(res, {
    data: {
      period: { days, since },
      postsOverTime,
      subscribersOverTime,
      usersOverTime,
      topCategories,
      topTags,
      usersByRole,
    },
  });
});

/**
 * GET /api/admin/users  — list all users
 */
const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { fullName: { $regex: req.query.search, $options: 'i' } },
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

/**
 * PATCH /api/admin/users/:id/role
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const allowed = ['admin', 'editor', 'author', 'subscriber'];
  if (!allowed.includes(role)) throw new Error('Invalid role.');

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  sendSuccess(res, { message: 'User role updated.', data: user.toPublicJSON() });
});

/**
 * GET /api/admin/audit-logs
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.action) filter.action = req.query.action;
  if (req.query.userId) filter.user = req.query.userId;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('user', 'fullName username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: logs,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

module.exports = { getDashboard, getAnalytics, getUsers, updateUserRole, getAuditLogs };
