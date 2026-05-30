const crypto = require('crypto');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendWelcomeEmail } = require('../config/email');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { getPaginationOptions } = require('../utils/pagination');
const { audit } = require('../utils/audit');
const logger = require('../config/logger');

const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await NewsletterSubscriber.findOne({ email });

  if (existing) {
    if (existing.isActive) {
      return sendSuccess(res, { message: 'You are already subscribed!' });
    }
    // Re-subscribe
    existing.isActive = true;
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    await existing.save();

    return sendSuccess(res, { message: 'Welcome back! You have been re-subscribed.' });
  }

  const unsubscribeToken = crypto.randomBytes(32).toString('hex');

  await NewsletterSubscriber.create({
    email,
    isActive: true,
    source: 'website',
    unsubscribeToken,
    ipAddress: req.ip,
  });

  // Send welcome email (non-blocking)
  sendWelcomeEmail(email).catch((err) =>
    logger.error('Welcome email failed:', { email, error: err.message })
  );

  await audit('SUBSCRIBE', { details: { email }, req });

  sendSuccess(res, { statusCode: 201, message: 'Successfully subscribed to the newsletter!' });
});

const unsubscribe = asyncHandler(async (req, res) => {
  const { email, token } = req.body;

  const subscriber = await NewsletterSubscriber.findOne({ email }).select('+unsubscribeToken');
  if (!subscriber) throw new AppError('Email not found in our subscriber list.', 404);

  // Validate token if provided (for one-click unsubscribe links)
  if (token && subscriber.unsubscribeToken !== token) {
    throw new AppError('Invalid unsubscribe token.', 400);
  }

  subscriber.isActive = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  await audit('UNSUBSCRIBE', { details: { email }, req });

  sendSuccess(res, { message: 'You have been unsubscribed successfully.' });
});

const getSubscribers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationOptions(req.query);
  const filter = {};
  if (req.query.active === 'true') filter.isActive = true;
  if (req.query.active === 'false') filter.isActive = false;

  const [subscribers, total] = await Promise.all([
    NewsletterSubscriber.find(filter).sort({ subscribedAt: -1 }).skip(skip).limit(limit).lean(),
    NewsletterSubscriber.countDocuments(filter),
  ]);

  sendPaginated(res, { data: subscribers, total, page, limit });
});

const exportSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ isActive: true })
    .select('email subscribedAt source')
    .lean();

  const csv = ['email,subscribedAt,source', ...subscribers.map((s) => `${s.email},${s.subscribedAt},${s.source}`)].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
});

module.exports = { subscribe, unsubscribe, getSubscribers, exportSubscribers };
