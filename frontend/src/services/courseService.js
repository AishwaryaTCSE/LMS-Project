import axios from 'axios';
import { message } from 'antd';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses', courseData);
    message.success('Course created successfully');
    return response.data.id;
  } catch (error) {
    console.error('Error creating course:', error);
    message.error(error.response?.data?.message || 'Failed to create course');
    throw error;
  }
};

export const updateCourse = async (courseId, updates) => {
  try {
    const response = await api.put(`/courses/${courseId}`, updates);
    message.success('Course updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    message.error(error.response?.data?.message || 'Failed to update course');
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    // This will check enrollments on the backend
    await api.delete(`/courses/${courseId}`);
    message.success('Course deleted successfully');
  } catch (error) {
    console.error('Error deleting course:', error);
    if (error.response?.status === 409) {
      message.error('Cannot delete course with enrolled students');
    } else {
      message.error(error.response?.data?.message || 'Failed to delete course');
    }
    throw error;
  }
};

export const getCourses = async (filters = {}) => {
  try {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    message.error(error.response?.data?.message || 'Failed to fetch courses');
    throw error;
  }
};

export const getInstructorCourses = async (instructorId, filters = {}) => {
  try {
    const response = await api.get(`/courses/instructor/${instructorId}`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    message.error(error.response?.data?.message || 'Failed to fetch courses');
    throw error;
  }
};

export const getEnrolledCourses = async (studentId) => {
  try {
    const response = await api.get(`/courses/student/${studentId}/enrolled`);
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    message.error(error.response?.data?.message || 'Failed to fetch enrolled courses');
    throw error;
  }
};

// Polling function for enrolled courses
let enrolledCoursesPollingInterval = null;

export const startEnrolledCoursesPolling = (studentId, callback, interval = 30000) => {
  const fetchAndCallback = async () => {
    try {
      const courses = await getEnrolledCourses(studentId);
      callback(courses);
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Initial fetch
  fetchAndCallback();

  // Set up polling
  enrolledCoursesPollingInterval = setInterval(fetchAndCallback, interval);

  // Return cleanup function
  return () => {
    if (enrolledCoursesPollingInterval) {
      clearInterval(enrolledCoursesPollingInterval);
      enrolledCoursesPollingInterval = null;
    }
  };
};

// Polling function to simulate real-time updates
let coursesPollingInterval = null;

export const startCoursesPolling = (callback, interval = 30000) => {
  const fetchAndCallback = async () => {
    try {
      const courses = await getCourses();
      callback(courses);
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Initial fetch
  fetchAndCallback();

  // Set up polling
  coursesPollingInterval = setInterval(fetchAndCallback, interval);

  // Return cleanup function
  return () => {
    if (coursesPollingInterval) {
      clearInterval(coursesPollingInterval);
      coursesPollingInterval = null;
    }
  };
};

// Polling function for instructor courses
let instructorCoursesPollingInterval = null;

export const startInstructorCoursesPolling = (instructorId, callback, interval = 30000) => {
  const fetchAndCallback = async () => {
    try {
      const courses = await getInstructorCourses(instructorId);
      callback(courses);
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Initial fetch
  fetchAndCallback();

  // Set up polling
  instructorCoursesPollingInterval = setInterval(fetchAndCallback, interval);

  // Return cleanup function
  return () => {
    if (instructorCoursesPollingInterval) {
      clearInterval(instructorCoursesPollingInterval);
      instructorCoursesPollingInterval = null;
    }
  };
};

export const getCourseDetails = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    message.error(error.response?.data?.message || 'Failed to fetch course details');
    throw error;
  }
};

export const enrollInCourse = async (courseId, userId) => {
  try {
    const response = await api.post(`/courses/${courseId}/enroll`, { userId });
    message.success('Successfully enrolled in course');
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    message.error(error.response?.data?.message || 'Failed to enroll in course');
    throw error;
  }
};

export const unenrollFromCourse = async (courseId, userId) => {
  try {
    const response = await api.post(`/courses/${courseId}/unenroll`, { userId });
    message.success('Successfully unenrolled from course');
    return response.data;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    message.error(error.response?.data?.message || 'Failed to unenroll from course');
    throw error;
  }
};

export const getEnrolledStudents = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    message.error(error.response?.data?.message || 'Failed to fetch enrolled students');
    throw error;
  }
};

export const updateCourseContent = async (courseId, content) => {
  try {
    const response = await api.put(`/courses/${courseId}/content`, content);
    message.success('Course content updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating course content:', error);
    message.error(error.response?.data?.message || 'Failed to update course content');
    throw error;
  }
};