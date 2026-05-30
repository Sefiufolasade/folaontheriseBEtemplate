const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter;

const createTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  // Verify connection
  transporter.verify((error) => {
    if (error) {
      logger.warn('Email transporter verification failed:', { error: error.message });
    } else {
      logger.info('✅ Email transporter ready');
    }
  });

  return transporter;
};

/**
 * Send an email
 * @param {Object} options - Email options
 */
const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    const transport = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'FolaOnTheRise <noreply@folaontherise.com>',
      to,
      subject,
      html,
      text: text || html?.replace(/<[^>]*>/g, ''),
      attachments,
    };

    const info = await transport.sendMail(mailOptions);
    logger.info('Email sent:', { messageId: info.messageId, to });
    return info;
  } catch (error) {
    logger.error('Email send failed:', { error: error.message, to, subject });
    throw error;
  }
};

/**
 * Send welcome email to new subscribers
 */
const sendWelcomeEmail = async (email) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to FolaOnTheRise! 🎉</h1>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>You'll receive the latest posts, insights, and updates directly in your inbox.</p>
      <p>If you ever wish to unsubscribe, you can do so by clicking the unsubscribe link in any of our emails.</p>
      <br/>
      <p>Stay inspired,</p>
      <p><strong>The FolaOnTheRise Team</strong></p>
    </div>
  `;

  return sendEmail({ to: email, subject: 'Welcome to FolaOnTheRise!', html });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Reset Password
      </a>
      <p style="margin-top: 20px;">This link expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: email, subject: 'Password Reset - FolaOnTheRise', html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  createTransporter,
};
