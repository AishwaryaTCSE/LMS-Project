const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  starter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  posts: [PostSchema]
}, { timestamps: true });

// Optional index for fast course lookup
ThreadSchema.index({ course: 1 });

module.exports = mongoose.model('Discussion', ThreadSchema);
