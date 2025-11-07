const mongoose = require('mongoose');

const GradeItemSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['assignment', 'quiz', 'exam'],
    required: true
  },
  marksObtained: {
    type: Number,
    min: 0
  },
  maxMarks: {
    type: Number,
    min: 0,
    required: true
  },
  feedback: {
    type: String,
    trim: true
  },
  gradedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const GradebookSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true,
    index: true
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  grades: [GradeItemSchema],
  gpa: {
    type: Number,
    min: 0,
    max: 4.0
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    default: null
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound unique index
GradebookSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

// Calculate percentage and GPA before saving
GradebookSchema.pre('save', function(next) {
  if (this.grades && this.grades.length > 0) {
    const totalObtained = this.grades.reduce((sum, g) => sum + (g.marksObtained || 0), 0);
    const totalMax = this.grades.reduce((sum, g) => sum + g.maxMarks, 0);
    
    if (totalMax > 0) {
      this.percentage = (totalObtained / totalMax) * 100;
      this.gpa = (this.percentage / 100) * 4.0;
      
      // Calculate letter grade
      if (this.percentage >= 90) this.letterGrade = 'A+';
      else if (this.percentage >= 85) this.letterGrade = 'A';
      else if (this.percentage >= 80) this.letterGrade = 'A-';
      else if (this.percentage >= 75) this.letterGrade = 'B+';
      else if (this.percentage >= 70) this.letterGrade = 'B';
      else if (this.percentage >= 65) this.letterGrade = 'B-';
      else if (this.percentage >= 60) this.letterGrade = 'C+';
      else if (this.percentage >= 55) this.letterGrade = 'C';
      else if (this.percentage >= 50) this.letterGrade = 'C-';
      else if (this.percentage >= 40) this.letterGrade = 'D';
      else this.letterGrade = 'F';
    }
  }
  next();
});

module.exports = mongoose.model('Gradebook', GradebookSchema);