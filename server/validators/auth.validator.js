const { body } = require('express-validator');

const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
  body('username')
    .trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username may only contain letters, numbers, _ and -'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const googleAuthValidator = [
  body('idToken').notEmpty().withMessage('Firebase ID token is required'),
];

module.exports = { registerValidator, loginValidator, googleAuthValidator };
