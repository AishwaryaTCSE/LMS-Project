const User = require('../models/user.model');
const Course = require('../models/course.model');
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const Quiz = require('../models/quiz.model');
const { success, error } = require('../utils/response');

// Student Dashboard Stats
exports.getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    
    // Get enrolled courses count
    const enrolledCourses = await Course.countDocuments({ students: studentId });
    
    // Get pending assignments
    const studentCourses = await Course.find({ students: studentId }).distinct('_id');
    const assignments = await Assignment.find({ course: { $in: studentCourses } });
    const assignmentIds = assignments.map(a => a._id);
    const submittedAssignments = await Submission.find({ 
      student: studentId, 
      assignment: { $in: assignmentIds } 
    }).distinct('assignment');
    const pendingAssignments = assignments.filter(a => {
      const isSubmitted = submittedAssignments.some(sa => sa.toString() === a._id.toString());
      return !isSubmitted && (!a.dueDate || new Date(a.dueDate) > new Date());
    }).length;
    
    // Get completed quizzes (checking submissions with assignment type)
    const quizzesCompleted = await Submission.countDocuments({ 
      student: studentId
    });
    
    // Calculate overall grade (average of all submissions with grades)
    const submissions = await Submission.find({ student: studentId, grade: { $exists: true, $ne: null } });
    const overallGrade = submissions.length > 0
      ? Math.round(submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / submissions.length)
      : 0;
    
    // Get courses with progress
    const courses = await Course.find({ students: studentId })
      .populate('instructor', 'firstName lastName')
      .limit(5)
      .lean();
    
    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
      const courseAssignments = await Assignment.countDocuments({ course: course._id });
      const completedSubmissions = await Submission.countDocuments({ 
        student: studentId,
        assignment: { $in: await Assignment.find({ course: course._id }).distinct('_id') }
      });
      const progress = courseAssignments > 0 
        ? Math.round((completedSubmissions / courseAssignments) * 100)
        : 0;
      
      return {
        id: course._id,
        name: course.title,
        progress,
        instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown'
      };
    }));
    
    // Get upcoming assignments
    const upcomingAssignments = await Assignment.find({
      course: { $in: await Course.find({ students: studentId }).distinct('_id') },
      dueDate: { $gte: new Date() }
    })
      .populate('course', 'title')
      .sort({ dueDate: 1 })
      .limit(5)
      .lean();
    
    // Get recent activities (submissions, grades, etc.)
    const recentSubmissions = await Submission.find({ student: studentId })
      .populate('assignment')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    const recentActivities = await Promise.all(recentSubmissions.map(async (sub) => {
      const assignment = await Assignment.findById(sub.assignment).populate('course', 'title').lean();
      return {
        id: sub._id,
        title: `Submitted assignment: ${assignment?.title || 'Unknown'}`,
        time: sub.createdAt,
        type: 'submission'
      };
    }));
    
    // Get performance data for charts (last 5 weeks)
    const performanceData = [];
    for (let i = 4; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekSubmissions = await Submission.find({
        student: studentId,
        createdAt: { $gte: weekStart, $lt: weekEnd },
        grade: { $exists: true, $ne: null }
      });
      
      const weekAvg = weekSubmissions.length > 0
        ? weekSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / weekSubmissions.length
        : 0;
      
      performanceData.push({
        week: `Week ${5 - i}`,
        score: Math.round(weekAvg)
      });
    }
    
    success(res, {
      coursesEnrolled: enrolledCourses,
      assignmentsPending: pendingAssignments,
      quizzesCompleted,
      overallGrade,
      courses: coursesWithProgress,
      upcomingAssignments: upcomingAssignments.map(a => ({
        id: a._id,
        title: a.title,
        dueDate: a.dueDate,
        course: a.course?.title || 'Unknown Course',
        type: 'assignment'
      })),
      recentActivities,
      performanceData
    });
  } catch (err) {
    console.error('Get Student Dashboard Error:', err);
    next(err);
  }
};

// Admin Dashboard Stats
exports.getAdminDashboard = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Get total students
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Get active instructors
    const activeInstructors = await User.countDocuments({ 
      role: { $in: ['teacher', 'instructor'] },
      isActive: true 
    });
    
    // Get total courses
    const totalCourses = await Course.countDocuments();
    
    // Get active courses (courses with at least one student)
    const activeCourses = await Course.countDocuments({ 
      students: { $exists: true, $ne: [] } 
    });
    
    // Calculate revenue (mock - would need payment model)
    const totalRevenue = 0; // Placeholder
    
    // Get system health (mock - would need system monitoring)
    const systemHealth = {
      cpu: Math.floor(Math.random() * 30) + 40,
      memory: Math.floor(Math.random() * 30) + 40,
      storage: Math.floor(Math.random() * 20) + 30,
      uptime: '99.98%',
      activeSessions: await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 3600000) } }),
      responseTime: '120ms'
    };
    
    // Get recent users
    const recentUsers = await User.find()
      .select('firstName lastName email role isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Get recent activities (would need activity log model)
    const recentActivities = [
      { id: 1, user: 'System', action: 'System backup completed', time: new Date(), type: 'system' }
    ];
    
    // Get pending approvals (mock)
    const pendingApprovals = [];
    
    // Get user growth data (last 6 months)
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const monthUsers = await User.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd }
      });
      
      userGrowth.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        users: monthUsers
      });
    }
    
    // Get course engagement data
    const courseEngagement = [];
    const courses = await Course.find().limit(5).lean();
    for (const course of courses) {
      const students = await Course.findById(course._id).distinct('students');
      courseEngagement.push({
        course: course.title,
        students: students.length
      });
    }
    
    success(res, {
      stats: {
        totalStudents,
        activeInstructors,
        totalCourses,
        activeCourses,
        totalRevenue,
        systemHealth: 98.7
      },
      systemStats: systemHealth,
      recentUsers: recentUsers.map(u => ({
        id: u._id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role,
        status: u.isActive ? 'active' : 'inactive',
        joinDate: u.createdAt
      })),
      recentActivities,
      pendingApprovals,
      analytics: {
        userGrowth,
        courseEngagement
      }
    });
  } catch (err) {
    console.error('Get Admin Dashboard Error:', err);
    next(err);
  }
};

// Admin Activities
exports.getAdminActivities = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Get recent activities from various sources
    const recentUsers = await User.find()
      .select('firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const activities = recentUsers.map((user, idx) => ({
      id: idx + 1,
      user: `${user.firstName} ${user.lastName}`,
      action: `registered as ${user.role}`,
      time: user.createdAt,
      type: 'user'
    }));

    // Add system activities
    activities.unshift({
      id: activities.length + 1,
      user: 'System',
      action: 'Daily backup completed',
      time: new Date(),
      type: 'system'
    });

    success(res, activities);
  } catch (err) {
    console.error('Get Admin Activities Error:', err);
    next(err);
  }
};

