// src/api/instructorApi.js
import axios from './axiosInstance';

// Courses
export const getInstructorCourses = async () => {
  try {
    const response = await axios.get('/instructor/courses');
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    throw error;
  }
};

export const createInstructorCourse = async (courseData) => {
  try {
    const response = await axios.post('/instructor/courses', courseData);
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateInstructorCourse = async (courseId, courseData) => {
  try {
    const response = await axios.put(`/instructor/courses/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteInstructorCourse = async (courseId) => {
  try {
    const response = await axios.delete(`/instructor/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Analytics
export const getInstructorAnalytics = async () => {
  try {
    const response = await axios.get('/instructor/analytics');
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error('Error fetching instructor analytics:', error);
    throw error;
  }
};

// Settings
export const updateInstructorSettings = async (settings) => {
  try {
    const response = await axios.put('/instructor/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating instructor settings:', error);
    throw error;
  }
};

