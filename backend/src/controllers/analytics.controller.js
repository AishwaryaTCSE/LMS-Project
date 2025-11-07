const Analytics = require('../models/analytics.model');
const { success } = require('../utils/response');

exports.track = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'Key and value are required' });
    }

    const doc = await Analytics.create({ key, value });
    success(res, doc, 201);
  } catch (err) {
    console.error('Analytics track error:', err);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const data = await Analytics.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    success(res, data);
  } catch (err) {
    console.error('Analytics list error:', err);
    next(err);
  }
};

// Admin Analytics
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const User = require('../models/user.model');
    const Course = require('../models/course.model');

    // User growth data (last 6 months)
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd }
      });

      userGrowth.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        users: count
      });
    }

    // Course engagement
    const courseEngagement = await Course.aggregate([
      {
        $project: {
          title: 1,
          studentCount: { $size: { $ifNull: ['$students', []] } }
        }
      },
      { $sort: { studentCount: -1 } },
      { $limit: 5 }
    ]);

    success(res, {
      userGrowth,
      courseEngagement,
      totalUsers: await User.countDocuments(),
      totalCourses: await Course.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true })
    });
  } catch (err) {
    console.error('Get Admin Analytics Error:', err);
    next(err);
  }
};

// Instructor Analytics
exports.getInstructorAnalytics = async (req, res, next) => {
  try {
    const Course = require('../models/course.model');
    const User = require('../models/user.model');

    // Get instructor's courses
    const courses = await Course.find({ instructor: req.user._id })
      .populate('students', 'firstName lastName email')
      .lean();

    const analytics = {
      totalCourses: courses.length,
      totalStudents: courses.reduce((sum, course) => sum + (course.students?.length || 0), 0),
      averageStudentsPerCourse: courses.length > 0 
        ? courses.reduce((sum, course) => sum + (course.students?.length || 0), 0) / courses.length 
        : 0,
      courses: courses.map(course => ({
        id: course._id,
        title: course.title,
        studentCount: course.students?.length || 0
      }))
    };

    success(res, analytics);
  } catch (err) {
    console.error('Get Instructor Analytics Error:', err);
    next(err);
  }
};

// Generate Report
exports.generateReport = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const User = require('../models/user.model');
    const Course = require('../models/course.model');

    const report = {
      generatedAt: new Date(),
      summary: {
        totalUsers: await User.countDocuments(),
        totalStudents: await User.countDocuments({ role: 'student' }),
        totalInstructors: await User.countDocuments({ role: { $in: ['instructor', 'teacher'] } }),
        totalCourses: await Course.countDocuments(),
        activeCourses: await Course.countDocuments({ students: { $exists: true, $ne: [] } })
      }
    };

    success(res, report);
  } catch (err) {
    console.error('Generate Report Error:', err);
    next(err);
  }
};

// Instructor Stats
exports.getInstructorStats = async (req, res, next) => {
  try {
    const Course = require('../models/course.model');
    const User = require('../models/user.model');
    const Enrollment = require('../models/enrollment.model');

    // Get instructor's courses
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(course => course._id);

    // Get total students across all courses
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds },
      status: 'enrolled'
    });

    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEnrollments = await Enrollment.countDocuments({
      course: { $in: courseIds },
      status: 'enrolled',
      enrolledAt: { $gte: thirtyDaysAgo }
    });

    // Calculate completion rate
    const completedCourses = await Enrollment.countDocuments({
      course: { $in: courseIds },
      status: 'completed'
    });

    const completionRate = totalStudents > 0 
      ? Math.round((completedCourses / totalStudents) * 100) 
      : 0;

    // Get average rating (if you have a rating system)
    const coursesWithRatings = await Course.aggregate([
      { $match: { _id: { $in: courseIds } } },
      { $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: "$ratingCount" }
      }}
    ]);

    const stats = {
      totalCourses: courses.length,
      totalStudents,
      recentEnrollments,
      completionRate,
      averageRating: coursesWithRatings[0]?.avgRating?.toFixed(1) || 0,
      totalRatings: coursesWithRatings[0]?.totalRatings || 0,
      lastUpdated: new Date()
    };

    success(res, stats);
  } catch (err) {
    console.error('Get instructor stats error:', err);
    next(err);
  }
};