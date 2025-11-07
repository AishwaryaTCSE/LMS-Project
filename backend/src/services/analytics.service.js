const { google } = require('googleapis');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const Enrollment = require('../models/enrollment.model');
const Message = process.env.NODE_ENV !== 'test' ? require('../models/message.model') : null;
const cache = require('../utils/cache');
const logger = require('../utils/logger');

// Initialize Google Analytics Data API
const initializeAnalytics = () => {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('Google Analytics credentials not configured');
    return null;
  }
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });
    return google.analyticsdata({ version: 'v1beta', auth });
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
    return null;
  }
};

const analyticsData = initializeAnalytics();

/**
 * Generate a simple analytics report
 */
const CACHE_TTL = 3600; // 1 hour

const generateReport = async () => {
  const cacheKey = 'analytics:report';
  try {
    // Try to get from cache first
    const cachedReport = await cache.get(cacheKey);
    if (cachedReport) {
      logger.info('Serving analytics report from cache');
      return cachedReport;
    }

    // Generate fresh report
    const [
      totalCourses, 
      activeCourses,
      totalStudents, 
      totalInstructors,
      totalEnrollments,
      completedEnrollments
    ] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'completed' })
    ]);

    const report = { 
      totalCourses, 
      activeCourses,
      totalStudents, 
      totalInstructors,
      totalEnrollments,
      completedEnrollments,
      completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments * 100).toFixed(2) : 0,
      generatedAt: new Date() 
    };

    // Cache the report
    await cache.set(cacheKey, report, CACHE_TTL);
    return report;
  } catch (error) {
    logger.error('Failed to generate analytics report:', error);
    throw new Error('Failed to generate analytics report: ' + error.message);
  }
};

/**
 * Get course enrollment metrics
 */
const getCourseEnrollmentMetrics = async (courseId = null) => {
  try {
    const query = courseId ? { _id: courseId } : {};
    const courses = await Course.find(query).select('title students enrollmentCount createdAt');
    return courses.map(course => ({
      courseId: course._id,
      courseName: course.title,
      enrollments: course.students?.length || course.enrollmentCount || 0,
      createdAt: course.createdAt
    }));
  } catch (error) {
    console.error('Error fetching enrollment metrics:', error);
    throw error;
  }
};

/**
 * Get completion rates for a course
 */
const getCompletionRates = async (courseId) => {
  try {
    const course = await Course.findById(courseId).populate('students');
    if (!course) throw new Error('Course not found');
    
    const totalStudents = course.students.length;
    if (totalStudents === 0) return { completionRate: 0, totalStudents: 0, completed: 0 };
    
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);
    
    const completedCount = await Submission.aggregate([
      { $match: { assignment: { $in: assignmentIds }, status: 'graded' } },
      { $group: { _id: '$student', completedAssignments: { $sum: 1 } } },
      { $match: { completedAssignments: { $gte: assignments.length * 0.8 } } },
      { $count: 'completed' }
    ]);
    
    const completed = completedCount[0]?.completed || 0;
    const completionRate = (completed / totalStudents) * 100;
    
    return {
      completionRate: Math.round(completionRate * 100) / 100,
      totalStudents,
      completed
    };
  } catch (error) {
    console.error('Error calculating completion rates:', error);
    throw error;
  }
};

/**
 * Get average grades for a course
 */
const getAverageGrades = async (courseId) => {
  try {
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);
    
    const gradeStats = await Submission.aggregate([
      { $match: { assignment: { $in: assignmentIds }, status: 'graded', marksAwarded: { $exists: true } } },
      { $group: { _id: null, averageGrade: { $avg: '$percentage' }, totalSubmissions: { $sum: 1 } } }
    ]);
    
    return gradeStats[0] || { averageGrade: 0, totalSubmissions: 0 };
  } catch (error) {
    console.error('Error calculating average grades:', error);
    throw error;
  }
};

/**
 * Get engagement metrics
 */
const getEngagementMetrics = async (startDate, endDate) => {
  try {
    const dateFilter = {
      createdAt: {
        $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lte: endDate || new Date()
      }
    };
    
    const [messageCount, submissionCount, activeUsers] = await Promise.all([
      Message.countDocuments(dateFilter),
      Submission.countDocuments(dateFilter),
      User.countDocuments({ lastLogin: dateFilter.createdAt })
    ]);
    
    return {
      messages: messageCount,
      submissions: submissionCount,
      activeUsers,
      period: { start: dateFilter.createdAt.$gte, end: dateFilter.createdAt.$lte }
    };
  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    throw error;
  }
};

/**
 * Get activity heatmap data
 */
const getActivityHeatmap = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const submissions = await Submission.aggregate([
      { $match: { student: userId, createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    return submissions.map(s => ({ date: s._id, activity: s.count }));
  } catch (error) {
    console.error('Error generating activity heatmap:', error);
    throw error;
  }
};

/**
 * Get top performing students
 */
const getTopPerformingStudents = async (courseId, limit = 10) => {
  try {
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);
    
    const topStudents = await Submission.aggregate([
      { $match: { assignment: { $in: assignmentIds }, status: 'graded' } },
      { $group: { _id: '$student', averageGrade: { $avg: '$percentage' }, totalSubmissions: { $sum: 1 } } },
      { $sort: { averageGrade: -1 } },
      { $limit: limit },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'student' } },
      { $unwind: '$student' },
      { $project: { studentId: '$_id', studentName: { $concat: ['$student.firstName', ' ', '$student.lastName'] }, averageGrade: { $round: ['$averageGrade', 2] }, totalSubmissions: 1 } }
    ]);
    
    return topStudents;
  } catch (error) {
    console.error('Error fetching top students:', error);
    throw error;
  }
};

/**
 * Fetch Google Analytics data
 */
const getGoogleAnalyticsData = async (propertyId, startDate, endDate) => {
  if (!analyticsData) return { error: 'Google Analytics not configured' };
  
  try {
    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId || process.env.GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: startDate || '30daysAgo', endDate: endDate || 'today' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'averageSessionDuration' }],
        dimensions: [{ name: 'date' }]
      }
    });
    return response.data;
  } catch (error) {
    console.error('Google Analytics API Error:', error);
    return { error: error.message };
  }
};

/**
 * Generate AI-powered insights using Google AI/Vertex AI
 */
const generateAIInsights = async (analyticsData) => {
  try {
    // Check if Google AI credentials are available
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_AI_CREDENTIALS) {
      return {
        success: false,
        message: 'Google AI credentials not configured',
        insights: null,
        fallback: generateFallbackInsights(analyticsData)
      };
    }
    
    // For now, return computed insights with a note about AI availability
    const insights = generateFallbackInsights(analyticsData);
    
    return {
      success: true,
      message: 'Analytics computed successfully',
      insights,
      aiEnhanced: false
    };
  } catch (error) {
    console.error('AI insights generation error:', error);
    return {
      success: false,
      message: error.message,
      insights: generateFallbackInsights(analyticsData)
    };
  }
};

/**
 * Generate fallback insights without AI
 */
const generateFallbackInsights = (data) => {
  const insights = [];
  
  // Enrollment insights
  if (data.enrollments) {
    const totalEnrollments = data.enrollments.reduce((sum, e) => sum + e.enrollments, 0);
    insights.push({
      category: 'enrollment',
      title: 'Enrollment Trends',
      description: `Total enrollments: ${totalEnrollments} across ${data.enrollments.length} courses`,
      recommendation: totalEnrollments < 100 ? 'Consider marketing campaigns to boost enrollment' : 'Maintain current enrollment strategies'
    });
  }
  
  // Completion rate insights
  if (data.completionRate !== undefined) {
    insights.push({
      category: 'completion',
      title: 'Course Completion',
      description: `Current completion rate: ${data.completionRate.toFixed(2)}%`,
      recommendation: data.completionRate < 50 
        ? 'Low completion rate detected. Consider: 1) Breaking content into smaller modules, 2) Adding more engaging activities, 3) Providing better support'
        : data.completionRate < 75
        ? 'Moderate completion rate. Consider adding progress tracking and motivational elements'
        : 'Excellent completion rate! Share best practices with other courses'
    });
  }
  
  // Average grades insights
  if (data.averageGrade !== undefined) {
    insights.push({
      category: 'performance',
      title: 'Student Performance',
      description: `Average grade: ${data.averageGrade.toFixed(2)}%`,
      recommendation: data.averageGrade < 60
        ? 'Performance concerns detected. Consider: 1) Reviewing assignment difficulty, 2) Adding supplementary materials, 3) Offering tutoring'
        : data.averageGrade > 90
        ? 'Very high performance. Consider increasing challenge level or adding advanced content'
        : 'Performance is within acceptable range'
    });
  }
  
  // Engagement insights
  if (data.engagement) {
    insights.push({
      category: 'engagement',
      title: 'Student Engagement',
      description: `Active users: ${data.engagement.activeUsers}, Messages: ${data.engagement.messages}, Submissions: ${data.engagement.submissions}`,
      recommendation: data.engagement.activeUsers < data.totalStudents * 0.5
        ? 'Low engagement detected. Consider: 1) Sending reminders, 2) Adding interactive elements, 3) Creating discussion forums'
        : 'Good engagement levels. Continue current strategies'
    });
  }
  
  return insights;
};

/**
 * Get comprehensive analytics overview with AI insights
 */
const getAnalyticsOverview = async () => {
  try {
    const [report, enrollments, engagement] = await Promise.all([
      generateReport(),
      getCourseEnrollmentMetrics(),
      getEngagementMetrics()
    ]);
    
    const analyticsData = {
      ...report,
      enrollments,
      engagement,
      totalStudents: report.totalStudents
    };
    
    const aiInsights = await generateAIInsights(analyticsData);
    
    return {
      ...analyticsData,
      insights: aiInsights.insights,
      aiEnhanced: aiInsights.aiEnhanced || false,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating analytics overview:', error);
    throw error;
  }
};

/**
 * Get course-specific analytics with AI insights
 */
const getCourseAnalyticsWithInsights = async (courseId) => {
  try {
    const [enrollments, completionRate, averageGrades] = await Promise.all([
      getCourseEnrollmentMetrics(courseId),
      getCompletionRates(courseId),
      getAverageGrades(courseId)
    ]);
    
    const analyticsData = {
      courseId,
      enrollments: enrollments[0]?.enrollments || 0,
      completionRate: completionRate.completionRate,
      totalStudents: completionRate.totalStudents,
      averageGrade: averageGrades.averageGrade
    };
    
    const aiInsights = await generateAIInsights(analyticsData);
    
    return {
      ...analyticsData,
      insights: aiInsights.insights,
      aiEnhanced: aiInsights.aiEnhanced || false
    };
  } catch (error) {
    console.error('Error generating course analytics:', error);
    throw error;
  }
};

module.exports = {
  generateReport,
  getCourseEnrollmentMetrics,
  getCompletionRates,
  getAverageGrades,
  getEngagementMetrics,
  getActivityHeatmap,
  getTopPerformingStudents,
  getGoogleAnalyticsData,
  generateAIInsights,
  getAnalyticsOverview,
  getCourseAnalyticsWithInsights
};
