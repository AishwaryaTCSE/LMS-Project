import axiosInstance from './axiosInstance';

// Quiz Operations

/**
 * Get all quizzes for a course
 * @param {string} courseId - ID of the course
 */
export const getQuizzes = async (courseId) => {
  const response = await axiosInstance.get(`/quizzes/course/${courseId}`);
  return response.data;
};

/**
 * Get single quiz details
 * @param {string} quizId - ID of the quiz
 */
export const getQuiz = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}`);
  return response.data;
};

/**
 * Get quiz by ID (alias for getQuiz)
 * @param {string} quizId - ID of the quiz
 */
export const getQuizById = async (quizId) => {
  return getQuiz(quizId);
};

/**
 * Get quiz results for a specific attempt
 * @param {string} attemptId - ID of the quiz attempt
 */
export const getQuizResults = async (attemptId) => {
  const response = await axiosInstance.get(`/quizzes/attempts/${attemptId}/results`);
  return response.data;
};

// Quiz Management (Teacher Only)

/**
 * Create new quiz (teacher only)
 * @param {Object} quizData - Quiz data to create
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

// Quiz Attempt Management

/**
 * Start a new quiz attempt
 * @param {string} quizId - ID of the quiz to attempt
 */
export const startQuizAttempt = async (quizId) => {
  const response = await axiosInstance.post(`/quizzes/${quizId}/attempts/start`);
  return response.data;
};

/**
 * Save quiz progress during an attempt
 * @param {string} attemptId - ID of the quiz attempt
 * @param {Object} answers - Object containing question IDs and answers
 */
export const saveQuizProgress = async (attemptId, answers) => {
  const response = await axiosInstance.put(
    `/quizzes/attempts/${attemptId}/progress`,
    { answers }
  );
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

// Quiz Analytics

/**
 * Get quiz statistics (teacher only)
 * @param {string} quizId - ID of the quiz
 */
export const getQuizStatistics = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}/statistics`);
  return response.data;
};

// Question Management (Teacher Only)

/**
 * Add question to quiz (teacher only)
 * @param {string} quizId - ID of the quiz
 * @param {Object} questionData - Question data to add
 */
export const addQuizQuestion = async (quizId, questionData) => {
  const response = await axiosInstance.post(
    `/quizzes/${quizId}/questions`,
    questionData
  );
  return response.data;
};

/**
 * Update quiz question (teacher only)
 * @param {string} quizId - ID of the quiz
 * @param {string} questionId - ID of the question
 * @param {Object} questionData - Updated question data
 */
export const updateQuizQuestion = async (quizId, questionId, questionData) => {
  const response = await axiosInstance.put(
    `/quizzes/${quizId}/questions/${questionId}`,
    questionData
  );
  return response.data;
};

/**
 * Delete quiz question (teacher only)
 * @param {string} quizId - ID of the quiz
 * @param {string} questionId - ID of the question to delete
 */
export const deleteQuizQuestion = async (quizId, questionId) => {
  const response = await axiosInstance.delete(
    `/quizzes/${quizId}/questions/${questionId}`
  );
  return response.data;
};

export default {
  // Quiz Operations
  getQuizzes,
  getQuiz,
  getQuizById,
  getQuizResults,
  
  // Quiz Management
  createQuiz,
  updateQuiz,
  deleteQuiz,
  
  // Quiz Attempts
  startQuizAttempt,
  submitQuizAttempt,
  saveQuizProgress,
  getQuizAttempts,
  getMyQuizAttempts,
  
  // Quiz Analytics
  getQuizStatistics,
  
  // Question Management
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
};