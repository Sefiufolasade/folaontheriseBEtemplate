const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw'],
      required: true,
    },
    format: { type: String },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: 'folaontherise' },
    originalName: { type: String },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    tags: [{ type: String }],
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ resourceType: 1 });
mediaSchema.index({ publicId: 1 });

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;
