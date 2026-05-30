const User = require('../models/User');
const { verifyFirebaseToken, getFirebaseUser } = require('../config/firebase');
const { generateTokenPair, verifyToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { audit } = require('../utils/audit');
const logger = require('../config/logger');

/**
 * POST /api/auth/register
 * Register via email/password (non-Firebase flow)
 */
const register = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'username';
    throw new AppError(`An account with that ${field} already exists.`, 409);
  }

  const user = await User.create({ fullName, username, email, password });
  const tokens = generateTokenPair(user);

  await audit('CREATE_USER', { userId: user._id, resourceType: 'User', resourceId: user._id, req });

  logger.info('New user registered', { userId: user._id, email });

  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully.',
    data: { user: user.toPublicJSON(), ...tokens },
  });
});

/**
 * POST /api/auth/login
 * Email/password login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    await audit('FAILED_LOGIN', { details: { email }, req, status: 'failure' });
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) throw new AppError('Your account has been deactivated.', 403);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const tokens = generateTokenPair(user);
  await audit('LOGIN', { userId: user._id, req });

  sendSuccess(res, {
    message: 'Logged in successfully.',
    data: { user: user.toPublicJSON(), ...tokens },
  });
});

/**
 * POST /api/auth/google
 * Firebase Google / social sign-in
 */
const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const decoded = await verifyFirebaseToken(idToken);

  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    // Also check by email in case they registered manually before
    user = await User.findOne({ email: decoded.email });

    if (user) {
      user.firebaseUid = decoded.uid;
      if (!user.avatar?.url && decoded.picture) {
        user.avatar = { url: decoded.picture, publicId: '' };
      }
      await user.save({ validateBeforeSave: false });
    } else {
      // New user — auto-register
      const baseUsername = decoded.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_');
      let username = baseUsername;
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter++}`;
      }

      user = await User.create({
        firebaseUid: decoded.uid,
        fullName: decoded.name || 'New User',
        username,
        email: decoded.email,
        avatar: { url: decoded.picture || '', publicId: '' },
        isVerified: decoded.email_verified || false,
        role: 'subscriber',
      });

      await audit('CREATE_USER', { userId: user._id, resourceType: 'User', resourceId: user._id, req });
    }
  }

  if (!user.isActive) throw new AppError('Your account has been deactivated.', 403);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const tokens = generateTokenPair(user);
  await audit('LOGIN', { userId: user._id, details: { method: 'google' }, req });

  sendSuccess(res, {
    message: 'Authenticated successfully.',
    data: { user: user.toPublicJSON(), ...tokens },
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new AppError('Refresh token required.', 400);

  const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new AppError('Invalid refresh token.', 401);

  const tokens = generateTokenPair(user);

  sendSuccess(res, {
    message: 'Token refreshed.',
    data: tokens,
  });
});

/**
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await audit('LOGOUT', { userId: req.user._id, req });
  }
  sendSuccess(res, { message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('postsCount');
  sendSuccess(res, { data: { user: user.toPublicJSON() } });
});

module.exports = { register, login, googleAuth, refreshToken, logout, getMe };
