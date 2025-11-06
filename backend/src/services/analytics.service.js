const Course = require('../models/course.model');
const User = require('../models/user.model');

/**
 * Generate a simple analytics report
 * Returns counts of courses, students, and instructors
 */
const generateReport = async () => {
  try {
    // Parallelize DB queries for efficiency
    const [totalCourses, totalStudents, totalInstructors] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' })
    ]);

    return {
      totalCourses,
      totalStudents,
      totalInstructors,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error('Failed to generate analytics report: ' + error.message);
  }
};

module.exports = { generateReport };
