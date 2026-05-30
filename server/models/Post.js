const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    contentType: {
      type: String,
      enum: ['html', 'markdown'],
      default: 'html',
    },
    featuredImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      alt: { type: String, default: '' },
    },
    galleryImages: [
      {
        url: { type: String },
        publicId: { type: String },
        alt: { type: String },
        caption: { type: String },
      },
    ],
    videoUrl: {
      type: String,
      default: '',
    },
    videoPublicId: {
      type: String,
      default: '',
    },
    pdfAttachments: [
      {
        url: { type: String },
        publicId: { type: String },
        name: { type: String },
        size: { type: Number },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        index: true,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'scheduled'],
      default: 'draft',
      index: true,
    },
    scheduledAt: {
      type: Date,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    readTime: {
      type: Number, // minutes
      default: 1,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },
    // SEO
    seoTitle: {
      type: String,
      maxlength: [70, 'SEO title cannot exceed 70 characters'],
    },
    seoDescription: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
    },
    seoKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    canonicalUrl: {
      type: String,
    },
    ogImage: {
      url: { type: String },
      publicId: { type: String },
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ========================
// INDEXES
// ========================
postSchema.index({ slug: 1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1, status: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ views: -1 });
postSchema.index({ isFeatured: 1, status: 1 });
postSchema.index({ title: 'text', content: 'text', excerpt: 'text', seoKeywords: 'text' });

// ========================
// VIRTUAL FIELDS
// ========================
postSchema.virtual('isLiked').get(function () {
  return false; // Populated dynamically per request
});

postSchema.virtual('isBookmarked').get(function () {
  return false; // Populated dynamically per request
});

// ========================
// HOOKS
// ========================

// Auto-generate slug from title
postSchema.pre('validate', async function (next) {
  if (this.isModified('title') && !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure uniqueness
    while (await mongoose.model('Post').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

// Calculate read time before save
postSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // Auto-set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Auto-generate excerpt if not provided
  if (this.isModified('content') && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 300).trim() + (plainText.length > 300 ? '...' : '');
  }

  // Sync likesCount
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }

  next();
});

// Soft delete filter
postSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// ========================
// METHODS
// ========================
postSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

postSchema.methods.toggleLike = function (userId) {
  const userIdStr = userId.toString();
  const index = this.likes.findIndex((id) => id.toString() === userIdStr);

  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }

  this.likesCount = this.likes.length;
  return this.save({ validateBeforeSave: false });
};

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
