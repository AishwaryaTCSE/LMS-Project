const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  threadId: {
    type: String,
    index: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'system'],
    default: 'text'
  },
  content: {
    type: String,
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
MessageSchema.index({ from: 1, to: 1, createdAt: -1 });
MessageSchema.index({ threadId: 1, createdAt: -1 });
MessageSchema.index({ read: 1, to: 1 });

module.exports = mongoose.model('Message', MessageSchema);