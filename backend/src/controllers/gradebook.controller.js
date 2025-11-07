const Gradebook = require('../models/gradebook.model');
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const Course = require('../models/course.model');

/**
 * Get gradebook for a student in a course
 */
exports.getStudentGradebook = async (req, res, next) => {
  try {
    const { courseId, studentId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    // Students can only view their own gradebook
    if (userRole === 'student' && studentId !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    let gradebook = await Gradebook.findOne({ courseId, studentId })
      .populate('studentId', 'firstName lastName email')
      .populate('courseId', 'title');
    
    if (!gradebook) {
      // Create empty gradebook if doesn't exist
      gradebook = await Gradebook.create({ courseId, studentId, grades: [] });
      await gradebook.populate('studentId courseId');
    }
    
    res.json({ success: true, data: gradebook });
  } catch (error) {
    console.error('Get gradebook error:', error);
    next(error);
  }
};

/**
 * Get all gradebooks for a course (Teacher only)
 */
exports.getCourseGradebooks = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    // Verify teacher owns the course
    const course = await Course.findById(courseId);
    if (!course || course.instructor.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const gradebooks = await Gradebook.find({ courseId })
      .populate('studentId', 'firstName lastName email avatar')
      .sort({ percentage: -1 });
    
    res.json({ success: true, data: gradebooks });
  } catch (error) {
    console.error('Get course gradebooks error:', error);
    next(error);
  }
};

/**
 * Update gradebook entry (automatically called when grading)
 */
exports.updateGradebookEntry = async (courseId, studentId, itemId, itemType, marksObtained, maxMarks, feedback) => {
  try {
    let gradebook = await Gradebook.findOne({ courseId, studentId });
    
    if (!gradebook) {
      gradebook = new Gradebook({ courseId, studentId, grades: [] });
    }
    
    // Check if grade item already exists
    const existingGradeIndex = gradebook.grades.findIndex(
      g => g.itemId.toString() === itemId.toString() && g.itemType === itemType
    );
    
    const gradeItem = {
      itemId,
      itemType,
      marksObtained,
      maxMarks,
      feedback,
      gradedAt: new Date()
    };
    
    if (existingGradeIndex >= 0) {
      // Update existing grade
      gradebook.grades[existingGradeIndex] = gradeItem;
    } else {
      // Add new grade
      gradebook.grades.push(gradeItem);
    }
    
    await gradebook.save();
    return gradebook;
  } catch (error) {
    console.error('Update gradebook error:', error);
    throw error;
  }
};

/**
 * Export gradebook as CSV
 */
exports.exportGradebook = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    const course = await Course.findById(courseId);
    if (!course || course.instructor.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const gradebooks = await Gradebook.find({ courseId })
      .populate('studentId', 'firstName lastName email');
    
    const csvData = gradebooks.map(gb => ({
      'Student Name': `${gb.studentId.firstName} ${gb.studentId.lastName}`,
      'Email': gb.studentId.email,
      'GPA': gb.gpa || 0,
      'Percentage': gb.percentage || 0,
      'Letter Grade': gb.letterGrade || 'N/A',
      'Total Items Graded': gb.grades.length
    }));
    
    res.json({ success: true, data: csvData });
  } catch (error) {
    console.error('Export gradebook error:', error);
    next(error);
  }
};

/**
 * Get student performance summary
 */
exports.getStudentPerformance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    if (userRole === 'student' && studentId !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const gradebooks = await Gradebook.find({ studentId })
      .populate('courseId', 'title');
    
    const overallStats = {
      totalCourses: gradebooks.length,
      averageGPA: gradebooks.reduce((sum, gb) => sum + (gb.gpa || 0), 0) / gradebooks.length || 0,
      averagePercentage: gradebooks.reduce((sum, gb) => sum + (gb.percentage || 0), 0) / gradebooks.length || 0,
      courses: gradebooks.map(gb => ({
        courseId: gb.courseId._id,
        courseName: gb.courseId.title,
        gpa: gb.gpa,
        percentage: gb.percentage,
        letterGrade: gb.letterGrade,
        totalGraded: gb.grades.length
      }))
    };
    
    res.json({ success: true, data: overallStats });
  } catch (error) {
    console.error('Get student performance error:', error);
    next(error);
  }
};