const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const logger = require('./logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Validate configuration
const validateConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    logger.warn(`Missing Cloudinary config: ${missing.join(', ')}`);
  } else {
    logger.info('✅ Cloudinary configured');
  }
};
validateConfig();

// ========================
// STORAGE CONFIGURATIONS
// ========================

/** Image storage */
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'folaontherise/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 1920, crop: 'limit' },
    ],
    resource_type: 'image',
  },
});

/** Video storage */
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'folaontherise/videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
    resource_type: 'video',
  },
});

/** Document storage */
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'folaontherise/documents',
    allowed_formats: ['pdf', 'docx', 'pptx'],
    resource_type: 'raw',
  },
});

/** Avatar storage */
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'folaontherise/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto' },
    ],
    resource_type: 'image',
  },
});

// ========================
// FILE FILTERS
// ========================

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP, GIF) are allowed'), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, MOV, AVI, WEBM) are allowed'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOCX, PPTX) are allowed'), false);
  }
};

// ========================
// MULTER INSTANCES
// ========================

const MB = 1024 * 1024;

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * MB, files: 10 },
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * MB, files: 1 },
});

const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 25 * MB, files: 5 },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * MB, files: 1 },
});

// ========================
// CLOUDINARY UTILITIES
// ========================

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image', 'video', or 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', { publicId, error: error.message });
    throw error;
  }
};

/**
 * Generate a thumbnail URL for a video
 * @param {string} publicId - Video public ID
 */
const getVideoThumbnail = (publicId) => {
  return cloudinary.url(`${publicId}.jpg`, {
    resource_type: 'video',
    transformation: [
      { width: 640, crop: 'scale' },
      { quality: 'auto' },
    ],
  });
};

/**
 * Optimize image URL with transformations
 * @param {string} publicId - Image public ID
 * @param {Object} options - Transformation options
 */
const getOptimizedImageUrl = (publicId, options = {}) => {
  const { width = 800, height, quality = 'auto', format = 'auto' } = options;
  const transformations = [{ width, quality, fetch_format: format }];
  if (height) transformations[0].height = height;

  return cloudinary.url(publicId, { transformation: transformations });
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadVideo,
  uploadDocument,
  uploadAvatar,
  deleteFromCloudinary,
  getVideoThumbnail,
  getOptimizedImageUrl,
};
