/**
 * Custom error class for operational (expected) API errors.
 * Distinguishes between programmer bugs and user-facing errors.
 */
class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors; // For validation error arrays

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
