const AuditLog = require('../models/AuditLog');
const logger = require('../config/logger');

/**
 * Create an audit log entry (fire-and-forget, never throws)
 */
const audit = async (action, { userId, resourceType, resourceId, details, req, status = 'success' } = {}) => {
  try {
    await AuditLog.create({
      user: userId || null,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
      userAgent: req?.headers?.['user-agent'],
      status,
    });
  } catch (err) {
    // Audit failures should never crash the app
    logger.error('Audit log write failed:', { action, error: err.message });
  }
};

module.exports = { audit };
