const Media = require('../models/Media');
const { deleteFromCloudinary } = require('../config/cloudinary');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { getPaginationOptions } = require('../utils/pagination');
const { audit } = require('../utils/audit');

/**
 * POST /api/upload
 * Handles image, video, or document uploads (Cloudinary handles actual storage via multer)
 */
const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file && !req.files?.length) {
    throw new AppError('No file uploaded.', 400);
  }

  const files = req.files || [req.file];
  const savedMedia = [];

  for (const file of files) {
    const media = await Media.create({
      publicId: file.filename || file.public_id,
      url: file.path,
      secureUrl: file.path,
      resourceType: file.resource_type || (file.mimetype?.startsWith('video') ? 'video' : file.mimetype === 'application/pdf' ? 'raw' : 'image'),
      format: file.format || file.mimetype?.split('/')[1],
      size: file.size,
      width: file.width,
      height: file.height,
      originalName: file.originalname,
      uploadedBy: req.user._id,
      folder: 'folaontherise',
    });

    savedMedia.push(media);
  }

  await audit('UPLOAD_MEDIA', {
    userId: req.user._id,
    resourceType: 'Media',
    details: { count: savedMedia.length },
    req,
  });

  sendSuccess(res, {
    statusCode: 201,
    message: `${savedMedia.length} file(s) uploaded successfully.`,
    data: savedMedia.length === 1 ? savedMedia[0] : savedMedia,
  });
});

/**
 * GET /api/upload
 * Get media library (admin/editor/author)
 */
const getMediaLibrary = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationOptions(req.query);
  const filter = {};

  // Authors see only their uploads
  if (req.user.role === 'author') filter.uploadedBy = req.user._id;
  if (req.query.type) filter.resourceType = req.query.type;

  const [media, total] = await Promise.all([
    Media.find(filter)
      .populate('uploadedBy', 'fullName username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Media.countDocuments(filter),
  ]);

  sendPaginated(res, { data: media, total, page, limit });
});

/**
 * DELETE /api/upload/:id
 */
const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw new AppError('Media not found.', 404);

  const isOwner = media.uploadedBy.toString() === req.user._id.toString();
  if (!isOwner && !['admin', 'editor'].includes(req.user.role)) {
    throw new AppError('Not authorised to delete this media.', 403);
  }

  // Delete from Cloudinary
  try {
    await deleteFromCloudinary(media.publicId, media.resourceType);
  } catch (err) {
    // Log but continue — still remove from DB
    console.error('Cloudinary delete failed:', err.message);
  }

  await Media.findByIdAndDelete(media._id);

  await audit('DELETE_MEDIA', { userId: req.user._id, resourceType: 'Media', resourceId: media._id, req });

  sendSuccess(res, { message: 'Media deleted.' });
});

module.exports = { uploadMedia, getMediaLibrary, deleteMedia };
