const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: [true, 'Question text is required'],
    trim: true
  },
  options: { 
    type: [String], 
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v && v.length >= 2;
      },
      message: 'At least 2 options are required'
    }
  },
  correctIndex: { 
    type: Number, 
    required: [true, 'Correct answer index is required'],
    min: 0
  },
  points: {
    type: Number,
    default: 1,
    min: 0
  },
  explanation: {
    type: String,
    trim: true
  }
}, { _id: true });

const QuizSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: [true, 'Course is required'],
    index: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Creator is required']
  },
  questions: {
    type: [QuestionSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one question is required'
    }
  },
  timeLimit: { 
    type: Number, 
    default: 0,
    min: [0, 'Time limit cannot be negative'],
    comment: 'Time limit in minutes, 0 means no limit'
  },
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  maxAttempts: {
    type: Number,
    default: 1,
    min: 1
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  showCorrectAnswers: {
    type: Boolean,
    default: true
  },
  attemptCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
QuizSchema.index({ course: 1, createdBy: 1 });
QuizSchema.index({ isPublished: 1 });

// Virtual for total points
QuizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
});

module.exports = mongoose.model('Quiz', QuizSchema);
