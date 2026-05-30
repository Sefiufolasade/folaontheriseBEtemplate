const { body, param } = require('express-validator');

// ---- Category ----
const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  body('color').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Invalid hex color'),
];

const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  ...createCategoryValidator.map((v) => v.optional ? v : v),
];

// ---- Tag ----
const createTagValidator = [
  body('name').trim().notEmpty().withMessage('Tag name is required').isLength({ max: 50 }),
  body('description').optional().isLength({ max: 200 }),
];

// ---- Comment ----
const createCommentValidator = [
  body('postId').isMongoId().withMessage('Valid post ID is required'),
  body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 2000 }),
  body('guestName').optional().trim().isLength({ max: 100 }),
  body('guestEmail').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID'),
];

// ---- Newsletter ----
const subscribeValidator = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  createTagValidator,
  createCommentValidator,
  subscribeValidator,
};
