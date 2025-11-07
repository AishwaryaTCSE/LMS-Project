const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Student is required'],
    index: true
  },
  studentName: {
    type: String,
    trim: true
  },
  assignment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment'
  },
  quiz: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz'
  },
  submissionType: {
    type: String,
    enum: ['assignment', 'quiz'],
    required: true
  },
  // For assignment submissions
  files: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  textAnswer: {
    type: String,
    trim: true,
    maxlength: [10000, 'Answer cannot exceed 10000 characters']
  },
  voiceNotes: [{
    url: String,
    duration: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  // For quiz submissions
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedIndex: Number,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  score: {
    type: Number,
    min: 0
  },
  totalScore: {
    type: Number,
    min: 0
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  // Grading
  grade: { 
    type: Number, 
    min: 0 
  },
  marksAwarded: {
    type: Number,
    min: 0
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [5000, 'Feedback cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned', 'late'],
    default: 'submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  gradedAt: {
    type: Date
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attemptNumber: {
    type: Number,
    default: 1,
    min: 1
  },
  isLate: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for fast queries
SubmissionSchema.index({ assignment: 1, student: 1 });
SubmissionSchema.index({ quiz: 1, student: 1 });
SubmissionSchema.index({ student: 1, submittedAt: -1 });
SubmissionSchema.index({ status: 1 });

// Compound unique index to prevent duplicate submissions
SubmissionSchema.index(
  { assignment: 1, student: 1, attemptNumber: 1 },
  { unique: true, sparse: true }
);

// Virtual for pass/fail status
SubmissionSchema.virtual('isPassed').get(function() {
  if (this.percentage !== undefined) {
    return this.percentage >= 70; // Default passing score
  }
  return null;
});

// Pre-save middleware to set student name
SubmissionSchema.pre('save', async function(next) {
  if (this.isModified('student') && this.student && !this.studentName) {
    const User = mongoose.model('User');
    const user = await User.findById(this.student);
    if (user) {
      this.studentName = user.fullName || `${user.firstName} ${user.lastName}`;
    }
  }
  
  // Calculate percentage for quiz submissions
  if (this.submissionType === 'quiz' && this.score !== undefined && this.totalScore) {
    this.percentage = (this.score / this.totalScore) * 100;
  }
  
  next();
});

module.exports = mongoose.model('Submission', SubmissionSchema);
