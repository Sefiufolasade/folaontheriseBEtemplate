const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE_POST', 'UPDATE_POST', 'DELETE_POST', 'PUBLISH_POST',
        'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'UPDATE_ROLE',
        'APPROVE_COMMENT', 'DELETE_COMMENT',
        'UPLOAD_MEDIA', 'DELETE_MEDIA',
        'LOGIN', 'LOGOUT', 'FAILED_LOGIN',
        'SUBSCRIBE', 'UNSUBSCRIBE',
        'CREATE_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY',
        'CREATE_TAG', 'UPDATE_TAG', 'DELETE_TAG',
        'SYSTEM',
      ],
    },
    resourceType: { type: String },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
  },
  { timestamps: true }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
