import axiosInstance from './axiosInstance';

// Submission API

/**
 * Submit an assignment
 * @param {string} assignmentId - ID of the assignment
 * @param {FormData} formData - Form data containing file and comments
 */
export const submitAssignment = async (assignmentId, formData) => {
  const response = await axiosInstance.post(
    `/assignments/${assignmentId}/submit`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Get submissions for an assignment (instructor only)
 * @param {string} assignmentId - ID of the assignment
 */
export const getAssignmentSubmissions = async (assignmentId) => {
  const response = await axiosInstance.get(`/assignments/${assignmentId}/submissions`);
  return response.data;
};

/**
 * Get a single submission by ID
 * @param {string} submissionId - ID of the submission
 */
export const getSubmission = async (submissionId) => {
  const response = await axiosInstance.get(`/submissions/${submissionId}`);
  return response.data;
};

/**
 * Update a submission's grade
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
 * Download a submission file
 * @param {string} submissionId - ID of the submission
 */
export const downloadSubmission = async (submissionId) => {
  const response = await axiosInstance.get(`/submissions/${submissionId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

export default {
  submitAssignment,
  getAssignmentSubmissions,
  getSubmission,
  updateGrade,
  downloadSubmission,
};