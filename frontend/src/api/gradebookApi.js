import axiosInstance from './axiosInstance';

/**
 * Get student gradebook for a course
 */
export const getStudentGradebook = async (courseId, studentId) => {
  const response = await axiosInstance.get(`/gradebook/course/${courseId}/student/${studentId}`);
  return response.data;
};

/**
 * Get all gradebooks for a course (teacher)
 */
export const getCourseGradebooks = async (courseId) => {
  const response = await axiosInstance.get(`/gradebook/course/${courseId}`);
  return response.data;
};

/**
 * Export gradebook as CSV
 */
export const exportGradebook = async (courseId) => {
  const response = await axiosInstance.get(`/gradebook/course/${courseId}/export`);
  return response.data;
};

/**
 * Get student performance summary
 */
export const getStudentPerformance = async (studentId) => {
  const response = await axiosInstance.get(`/gradebook/student/${studentId}/performance`);
  return response.data;
};

export default {
  getStudentGradebook,
  getCourseGradebooks,
  exportGradebook,
  getStudentPerformance
};