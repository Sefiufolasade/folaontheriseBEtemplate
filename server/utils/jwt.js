const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * Sign a JWT access token
 */
const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Sign a JWT refresh token
 */
const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

/**
 * Verify a JWT token
 */
const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }
    throw new AppError('Token verification failed.', 401);
  }
};

/**
 * Extract token from Authorization header
 */
const extractBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

/**
 * Generate both access and refresh tokens for a user
 */
const generateTokenPair = (user) => {
  const payload = { id: user._id, role: user.role, email: user.email };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ id: user._id }),
  };
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  extractBearerToken,
  generateTokenPair,
};
