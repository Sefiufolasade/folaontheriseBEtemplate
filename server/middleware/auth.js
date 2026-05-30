const { verifyFirebaseToken } = require('../config/firebase');
const { verifyToken, extractBearerToken } = require('../utils/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

/**
 * Verify Firebase ID token from Authorization header
 * Attaches decoded Firebase payload to req.firebaseUser
 */
const verifyFirebaseTokenMiddleware = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) throw new AppError('No authentication token provided.', 401);

  req.firebaseUser = await verifyFirebaseToken(token);
  next();
});

/**
 * Authenticate via JWT (our own tokens) or Firebase token.
 * Attaches full User document to req.user.
 * Use this on all protected routes.
 */
const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) throw new AppError('Please log in to access this resource.', 401);

  let user = null;

  // Try JWT first
  try {
    const decoded = verifyToken(token);
    user = await User.findById(decoded.id).select('+isDeleted');
  } catch {
    // Fall back to Firebase token
    try {
      const decoded = await verifyFirebaseToken(token);
      user = await User.findOne({ firebaseUid: decoded.uid }).select('+isDeleted');
    } catch (fbErr) {
      throw new AppError('Invalid or expired authentication token.', 401);
    }
  }

  if (!user) throw new AppError('User not found. Please log in again.', 401);
  if (!user.isActive) throw new AppError('Your account has been deactivated.', 403);
  if (user.isDeleted) throw new AppError('This account no longer exists.', 401);

  req.user = user;
  next();
});

/**
 * Optional authentication — attaches user if token present, continues if not.
 * Useful for public routes that behave differently when logged in.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) req.user = user;
  } catch {
    // Silently ignore invalid tokens for optional auth
  }
  next();
});

/**
 * Role-based authorization middleware factory.
 * @param {...string} roles - Allowed roles
 * @returns Middleware
 */
const authorizeRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) throw new AppError('Authentication required.', 401);

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized role access attempt', {
        userId: req.user._id,
        role: req.user.role,
        requiredRoles: roles,
        path: req.path,
      });
      throw new AppError(`Access denied. Required role(s): ${roles.join(', ')}.`, 403);
    }
    next();
  });

/**
 * Ensure authenticated user owns the resource or is admin/editor.
 * Attaches to routes where :userId or resource.author exists.
 */
const ownerOrAdmin = (getOwnerId) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) throw new AppError('Authentication required.', 401);

    const ownerId = typeof getOwnerId === 'function'
      ? await getOwnerId(req)
      : req.params.userId;

    const isOwner = req.user._id.toString() === ownerId?.toString();
    const isPrivileged = ['admin', 'editor'].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      throw new AppError('You do not have permission to perform this action.', 403);
    }
    next();
  });

module.exports = {
  verifyFirebaseToken: verifyFirebaseTokenMiddleware,
  authenticateUser,
  optionalAuth,
  authorizeRoles,
  ownerOrAdmin,
};
