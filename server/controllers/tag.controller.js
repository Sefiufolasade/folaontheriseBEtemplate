const Tag = require('../models/Tag');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { audit } = require('../utils/audit');

const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().populate('postsCount').sort({ name: 1 }).lean();
  sendSuccess(res, { data: tags });
});

const createTag = asyncHandler(async (req, res) => {
  const tag = await Tag.create({ ...req.body, createdBy: req.user._id });
  await audit('CREATE_TAG', { userId: req.user._id, resourceType: 'Tag', resourceId: tag._id, req });
  sendSuccess(res, { statusCode: 201, message: 'Tag created.', data: tag });
});

const updateTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!tag) throw new AppError('Tag not found.', 404);
  await audit('UPDATE_TAG', { userId: req.user._id, resourceType: 'Tag', resourceId: tag._id, req });
  sendSuccess(res, { message: 'Tag updated.', data: tag });
});

const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);
  if (!tag) throw new AppError('Tag not found.', 404);
  await audit('DELETE_TAG', { userId: req.user._id, resourceType: 'Tag', resourceId: tag._id, req });
  sendSuccess(res, { message: 'Tag deleted.' });
});

module.exports = { getTags, createTag, updateTag, deleteTag };
