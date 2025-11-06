const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String, // markdown or HTML
  resources: [String], // URLs
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: Number
}, { timestamps: true });

// Optional index for fast course-based sorting
LessonSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Lesson', LessonSchema);
