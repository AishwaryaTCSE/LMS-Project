// analyticsService.js
import axios from './axiosInstance.js';

export const getAnalyticsReport = async () => {
  try {
    const response = await axios.get('/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics report:', error);
    throw error;
  }
};

export const getStudentPerformance = async (studentId) => {
  try {
    const response = await axios.get(`/analytics/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching performance for student ${studentId}:`, error);
    throw error;
  }
};

export const getCourseProgress = async (courseId) => {
  try {
    const response = await axios.get(`/analytics/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching progress for course ${courseId}:`, error);
    throw error;
  }
};
