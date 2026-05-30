const { body, param, query } = require('express-validator');

const createPostValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('status').optional().isIn(['draft', 'published', 'archived', 'scheduled']).withMessage('Invalid status'),
  body('category').optional().isMongoId().withMessage('Invalid category ID'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().isMongoId().withMessage('Each tag must be a valid ID'),
  body('seoTitle').optional().isLength({ max: 70 }).withMessage('SEO title too long'),
  body('seoDescription').optional().isLength({ max: 160 }).withMessage('SEO description too long'),
];

const updatePostValidator = [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('status').optional().isIn(['draft', 'published', 'archived', 'scheduled']),
  body('category').optional().isMongoId().withMessage('Invalid category ID'),
  body('tags').optional().isArray(),
  body('tags.*').optional().isMongoId(),
];

const postQueryValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['draft', 'published', 'archived', 'scheduled']),
  query('category').optional().isMongoId(),
];

module.exports = { createPostValidator, updatePostValidator, postQueryValidator };
