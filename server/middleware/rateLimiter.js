const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const makeRateLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      next(new AppError(options.message.message, 429));
    },
  });

module.exports = {
  /** General API: 100 requests per 15 min */
  general: makeRateLimiter(15 * 60 * 1000, 100, 'Too many requests. Please try again later.'),

  /** Auth endpoints: 10 attempts per 15 min */
  auth: makeRateLimiter(15 * 60 * 1000, 10, 'Too many authentication attempts. Please try again later.'),

  /** Upload: 20 uploads per hour */
  upload: makeRateLimiter(60 * 60 * 1000, 20, 'Too many upload requests. Please slow down.'),

  /** Newsletter subscribe: 5 per hour */
  newsletter: makeRateLimiter(60 * 60 * 1000, 5, 'Too many subscribe requests. Please try again later.'),
};
