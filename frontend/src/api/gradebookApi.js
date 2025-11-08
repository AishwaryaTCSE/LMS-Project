import axiosInstance from './axiosInstance';

// Gradebook API

/**
 * Get all grades for a course (instructor only)
 * @param {string} courseId - ID of the course
 */
export const getCourseGrades = async (courseId) => {
  const response = await axiosInstance.get(`/courses/${courseId}/grades`);
  return response.data;
};

/**
 * Get grades for a specific student
 * @param {string} courseId - ID of the course
 */
export const getStudentGrades = async (courseId) => {
  const response = await axiosInstance.get(`/courses/${courseId}/my-grades`);
  return response.data;
};

/**
 * Get submissions for an assignment
 * @param {string} assignmentId - ID of the assignment
 */
export const getAssignmentSubmissions = async (assignmentId) => {
  const response = await axiosInstance.get(`/assignments/${assignmentId}/submissions`);
  return response.data;
};

/**
 * Update a grade
 * @param {string} submissionId - ID of the submission
 * @param {Object} gradeData - Grade data to update
 */
export const updateGrade = async (submissionId, gradeData) => {
  const response = await axiosInstance.put(
    `/submissions/${submissionId}/grade`,
    gradeData
  );
  return response.data;
};

/**
 * Export grades for a course
 * @param {string} courseId - ID of the course
 * @param {string} format - Export format (csv, excel, etc.)
 */
export const exportGrades = async (courseId, format = 'csv') => {
  const response = await axiosInstance.get(
    `/courses/${courseId}/export-grades`,
    { responseType: 'blob', params: { format } }
  );
  return response.data;
};

export default {
  getCourseGrades,
  getStudentGrades,
  getAssignmentSubmissions,
  updateGrade,
  exportGrades,
};