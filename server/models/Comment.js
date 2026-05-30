const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // For guest comments
    guestName: {
      type: String,
      trim: true,
      maxlength: [100, 'Guest name cannot exceed 100 characters'],
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
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
    ipAddress: {
      type: String,
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
// VIRTUALS
// ========================
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  match: { isDeleted: { $ne: true }, isApproved: true },
});

// ========================
// INDEXES
// ========================
commentSchema.index({ post: 1, isApproved: 1 });
commentSchema.index({ post: 1, parentComment: 1 });
commentSchema.index({ user: 1 });

// ========================
// HOOKS
// ========================
commentSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// Update commentsCount on Post
commentSchema.post('save', async function () {
  if (this.isApproved) {
    await mongoose.model('Post').findByIdAndUpdate(this.post, {
      $inc: { commentsCount: 1 },
    });
  }
});

commentSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    const count = await mongoose.model('Comment').countDocuments({
      post: doc.post,
      isApproved: true,
      isDeleted: { $ne: true },
    });
    await mongoose.model('Post').findByIdAndUpdate(doc.post, { commentsCount: count });
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
