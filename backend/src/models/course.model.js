const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    // index defined below via CourseSchema.index({ instructor: 1 })
  },
  instructorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  instructorName: { 
    type: String,
    trim: true
  },
  videoUrl: { 
    type: String,
    trim: true
  },
  videoFile: { 
    type: String,
    trim: true
  },
  thumbnail: { 
    type: String,
    trim: true
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  price: { 
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  visibility: { 
    type: String,
    enum: ['public', 'private', 'draft'],
    default: 'public'
  },
  publishedAt: { 
    type: Date
  },
  lessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson' 
  }],
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  enrollmentCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ visibility: 1, isActive: 1 });
CourseSchema.index({ tags: 1 });
CourseSchema.index({ createdAt: -1 });

// Virtual for student count
CourseSchema.virtual('studentCount').get(function() {
  return this.students ? this.students.length : 0;
});

// Pre-save middleware to set instructorId and instructorName
CourseSchema.pre('save', async function(next) {
  if (this.isModified('instructor') && this.instructor) {
    this.instructorId = this.instructor;
    // Populate instructor name if not set
    if (!this.instructorName) {
      const User = mongoose.model('User');
      const user = await User.findById(this.instructor);
      if (user) {
        this.instructorName = user.fullName || `${user.firstName} ${user.lastName}`;
      }
    }
  }
  
  // Set publishedAt when visibility changes to public
  if (this.isModified('visibility') && this.visibility === 'public' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
