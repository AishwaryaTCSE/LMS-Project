import { apiCall } from './apiUtils';
import axios from './axiosInstance';

// Instructor Dashboard API
export const getInstructorDashboard = async () => {
  try {
    const [analytics, courses, activities, stats] = await Promise.all([
      // Using relative paths since baseURL already includes /api/v1
      apiCall('get', '/analytics'),
      apiCall('get', '/instructor/courses'),
      apiCall('get', '/instructor/activities'),
      apiCall('get', '/instructor/stats')
    ]);

    if (analytics.error) throw analytics.error;
    if (courses.error) throw courses.error;

    return {
      analytics: analytics.data?.data || {},
      courses: courses.data?.data || [],
      stats: stats.data?.data || {
        totalStudents: 0,
        totalCourses: courses.data?.data?.length || 0,
        unreadMessages: 0,
        pendingTasks: 0
      },
      activities: activities.data?.data || [],
      events: []
    };
  } catch (error) {
    console.error('Error in getInstructorDashboard:', error);
    throw error;
  }
};

// Instructor Dashboard Stats
export const getInstructorDashboardStats = async () => {
  try {
    const [stats, courses] = await Promise.all([
      // Using relative paths since baseURL already includes /api/v1
      apiCall('get', '/instructor/stats'),
      apiCall('get', '/instructor/courses')
    ]);

    if (stats.error) throw stats.error;
    if (courses.error) throw courses.error;

    return {
      totalStudents: stats.data?.data?.totalStudents || 0,
      totalCourses: courses.data?.data?.length || 0,
      unreadMessages: stats.data?.data?.unreadMessages || 0,
      pendingTasks: stats.data?.data?.pendingTasks || 0,
      ...(stats.data?.data || {})
    };
  } catch (error) {
    console.error('Error in getInstructorDashboardStats:', error);
    throw error;
  }
};

// Instructor Recent Activities
export const getInstructorRecentActivities = async () => {
  try {
    // Note: If you implement this, use '/api/v1/instructor/activities'
    return [];
  } catch (error) {
    console.error('Error fetching instructor recent activities:', error);
    throw error;
  }
};

// Instructor Upcoming Events
export const getInstructorUpcomingEvents = async () => {
  try {
    // Note: If you implement this, use '/api/v1/instructor/events'
    return [];
  } catch (error) {
    console.error('Error fetching instructor upcoming events:', error);
    throw error;
  }
};

// Student Dashboard API (Keeping original structure, but consider adding /api/v1 if it fails)
export const getStudentDashboard = async () => {
  try {
    const response = await axios.get('/student/dashboard');
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    throw error;
  }
};

// Admin Dashboard API (Keeping original structure, but consider adding /api/v1 if it fails)
export const getAdminDashboard = async () => {
  try {
    const response = await axios.get('/admin/dashboard');
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw error;
  }
};

// Admin Analytics API
export const getAdminAnalytics = async () => {
  try {
    const response = await axios.get('/admin/analytics');
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    throw error;
  }
};

// Admin Activities API
export const getAdminActivities = async () => {
  try {
    const response = await axios.get('/admin/activities');
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    throw error;
  }
};