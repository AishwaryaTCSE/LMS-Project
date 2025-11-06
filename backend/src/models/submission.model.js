const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  files: [String],
  grade: { type: Number, min: 0 },
  feedback: String
}, { timestamps: true });

// Optional index for fast queries
SubmissionSchema.index({ assignment: 1, student: 1 });

module.exports = mongoose.model('Submission', SubmissionSchema);
