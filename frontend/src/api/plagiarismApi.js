import axiosInstance from './axiosInstance';

// Plagiarism Check API

/**
 * Check for plagiarism in an assignment's submissions
 * @param {string} assignmentId - ID of the assignment
 */
export const checkPlagiarism = async (assignmentId) => {
  const response = await axiosInstance.post(
    `/assignments/${assignmentId}/check-plagiarism`
  );
  return response.data;
};

/**
 * Get similarity report for a submission
 * @param {string} submissionId - ID of the submission
 */
export const getSimilarityReport = async (submissionId) => {
  const response = await axiosInstance.get(
    `/submissions/${submissionId}/similarity-report`
  );
  return response.data;
};

/**
 * Download similarity report as PDF
 * @param {string} submissionId - ID of the submission
 */
export const downloadSimilarityReport = async (submissionId) => {
  const response = await axiosInstance.get(
    `/submissions/${submissionId}/similarity-report/download`,
    { responseType: 'blob' }
  );
  return response.data;
};

export default {
  checkPlagiarism,
  getSimilarityReport,
  downloadSimilarityReport,
};