import axiosInstance from './axiosInstance';

/**
 * Get all quizzes for a course
 */
export const getQuizzes = async (courseId) => {
  const response = await axiosInstance.get(`/quizzes/course/${courseId}`);
  return response.data;
};

/**
 * Get single quiz details
 */
export const getQuiz = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}`);
  return response.data;
};

/**
 * Create new quiz (teacher only)
 */
export const createQuiz = async (quizData) => {
  const response = await axiosInstance.post('/quizzes', quizData);
  return response.data;
};

/**
 * Update quiz (teacher only)
 */
export const updateQuiz = async (quizId, quizData) => {
  const response = await axiosInstance.put(`/quizzes/${quizId}`, quizData);
  return response.data;
};

/**
 * Delete quiz (teacher only)
 */
export const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(`/quizzes/${quizId}`);
  return response.data;
};

/**
 * Submit quiz attempt (student)
 */
export const submitQuizAttempt = async (quizId, answers) => {
  const response = await axiosInstance.post(`/quizzes/${quizId}/attempt`, { answers });
  return response.data;
};

/**
 * Get quiz attempts
 */
export const getQuizAttempts = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}/attempts`);
  return response.data;
};

/**
 * Get student's quiz attempts
 */
export const getMyQuizAttempts = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}/my-attempts`);
  return response.data;
};

export default {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizAttempts,
  getMyQuizAttempts
};