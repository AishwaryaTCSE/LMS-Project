const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '' },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['system', 'course', 'message', 'assignment', 'enrollment', 'grade', 'announcement', 'info', 'warning', 'error', 'other'],
      default: 'system'
    },
    isRead: { type: Boolean, default: false, index: true },
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    metadata: { type: Object, default: {} },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

// Index for efficient queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });

// Auto-delete expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', NotificationSchema);


