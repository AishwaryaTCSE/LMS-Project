const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dueDate: Date,
  points: { type: Number, default: 100 }
}, { timestamps: true });

// Optional: index for faster queries by course
AssignmentSchema.index({ course: 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
