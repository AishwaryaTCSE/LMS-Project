const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
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
  dueDate: { 
    type: Date,
    required: [true, 'Due date is required']
  },
  maxMarks: { 
    type: Number, 
    default: 100,
    min: [0, 'Max marks cannot be negative']
  },
  points: { 
    type: Number, 
    default: 100,
    min: [0, 'Points cannot be negative']
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  instructions: {
    type: String,
    trim: true
  },
  allowLateSubmissions: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  submissionCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
AssignmentSchema.index({ course: 1, createdBy: 1 });
AssignmentSchema.index({ dueDate: 1 });
AssignmentSchema.index({ isPublished: 1 });

// Virtual to check if assignment is overdue
AssignmentSchema.virtual('isOverdue').get(function() {
  return this.dueDate && new Date() > this.dueDate;
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
