// courseService.js
import axios from './axiosInstance.js';

export const getCourses = async () => {
  try {
    const response = await axios.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error);
    throw error;
  }
};

export const createCourse = async (data) => {
  try {
    const response = await axios.post('/courses', data);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id, data) => {
  try {
    const response = await axios.put(`/courses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating course with id ${id}:`, error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting course with id ${id}:`, error);
    throw error;
  }
};

export const getQuizzes = async (courseId) => {
  try {
    const response = await axios.get(`/courses/${courseId}/quizzes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quizzes for course ${courseId}:`, error);
    throw error;
  }
};

export const getSubmissions = async (courseId, quizId) => {
  try {
    const response = await axios.get(`/courses/${courseId}/quizzes/${quizId}/submissions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching submissions for quiz ${quizId} in course ${courseId}:`, error);
    throw error;
  }
};

export const gradeSubmission = async (courseId, quizId, submissionId, gradeData) => {
  try {
    const response = await axios.put(
      `/courses/${courseId}/quizzes/${quizId}/submissions/${submissionId}/grade`,
      gradeData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error grading submission ${submissionId} for quiz ${quizId} in course ${courseId}:`,
      error
    );
    throw error;
  }
};
