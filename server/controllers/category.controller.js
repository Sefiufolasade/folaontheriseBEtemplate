const Category = require('../models/Category');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { audit } = require('../utils/audit');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('postsCount')
    .sort({ order: 1, name: 1 })
    .lean();
  sendSuccess(res, { data: categories });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate('postsCount');
  if (!category) throw new AppError('Category not found.', 404);
  sendSuccess(res, { data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, createdBy: req.user._id });
  await audit('CREATE_CATEGORY', { userId: req.user._id, resourceType: 'Category', resourceId: category._id, req });
  sendSuccess(res, { statusCode: 201, message: 'Category created.', data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw new AppError('Category not found.', 404);
  await audit('UPDATE_CATEGORY', { userId: req.user._id, resourceType: 'Category', resourceId: category._id, req });
  sendSuccess(res, { message: 'Category updated.', data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found.', 404);
  await audit('DELETE_CATEGORY', { userId: req.user._id, resourceType: 'Category', resourceId: category._id, req });
  sendSuccess(res, { message: 'Category deleted.' });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
