const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: '' },
    message: { type: String, required: true },
    type: { type: String, enum: ['system', 'course', 'message', 'assignment', 'enrollment', 'other'], default: 'system' },
    isRead: { type: Boolean, default: false },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);


