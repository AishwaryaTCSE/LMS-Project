import axios from './axiosInstance';

// Student Dashboard API
export const getStudentDashboard = async () => {
  try {
    const response = await axios.get('/student/dashboard');
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    throw error;
  }
};

// Admin Dashboard API
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

