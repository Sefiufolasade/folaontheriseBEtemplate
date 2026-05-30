const cron = require('node-cron');
const Post = require('../models/Post');
const logger = require('../config/logger');

/**
 * Publish scheduled posts
 * Runs every minute
 */
const publishScheduledPosts = cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const result = await Post.updateMany(
      { status: 'scheduled', scheduledAt: { $lte: now } },
      { $set: { status: 'published', publishedAt: now } }
    );
    if (result.modifiedCount > 0) {
      logger.info(`Published ${result.modifiedCount} scheduled post(s)`);
    }
  } catch (err) {
    logger.error('Scheduled post publish job failed:', err.message);
  }
}, { scheduled: false });

/**
 * Mark posts as trending based on recent views
 * Runs every hour
 */
const updateTrendingPosts = cron.schedule('0 * * * *', async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Reset all trending
    await Post.updateMany({ isTrending: true }, { $set: { isTrending: false } });

    // Top 10 by views in last 7 days
    const trending = await Post.find({
      status: 'published',
      publishedAt: { $gte: sevenDaysAgo },
    })
      .sort({ views: -1 })
      .limit(10)
      .select('_id');

    if (trending.length > 0) {
      await Post.updateMany(
        { _id: { $in: trending.map((p) => p._id) } },
        { $set: { isTrending: true } }
      );
      logger.info(`Updated ${trending.length} trending posts`);
    }
  } catch (err) {
    logger.error('Trending posts job failed:', err.message);
  }
}, { scheduled: false });

/**
 * Clean up soft-deleted records older than 30 days
 * Runs daily at 2am
 */
const cleanupDeleted = cron.schedule('0 2 * * *', async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await Post.deleteMany(
      { isDeleted: true, deletedAt: { $lte: thirtyDaysAgo } },
      { includeDeleted: true }
    );
    if (result.deletedCount > 0) {
      logger.info(`Cleaned up ${result.deletedCount} permanently deleted posts`);
    }
  } catch (err) {
    logger.error('Cleanup job failed:', err.message);
  }
}, { scheduled: false });

const startCronJobs = () => {
  publishScheduledPosts.start();
  updateTrendingPosts.start();
  cleanupDeleted.start();
  logger.info('✅ Cron jobs started');
};

const stopCronJobs = () => {
  publishScheduledPosts.stop();
  updateTrendingPosts.stop();
  cleanupDeleted.stop();
};

module.exports = { startCronJobs, stopCronJobs };
