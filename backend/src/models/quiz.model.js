const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [QuestionSchema],
  timeLimitMinutes: { type: Number, default: 0 }
}, { timestamps: true });

// Optional index for faster course lookup
QuizSchema.index({ course: 1 });

module.exports = mongoose.model('Quiz', QuizSchema);
