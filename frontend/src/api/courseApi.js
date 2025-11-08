// frontend/src/api/courseApi.js
import axiosInstance from './axiosInstance';

// Get all courses
export const getCourses = async () => {
  const response = await axiosInstance.get('/api/courses');
  return response.data;
};

// Get single course by ID
export const getCourseById = async (id) => {
  const response = await axiosInstance.get(`/api/courses/${id}`);
  return response.data;
};

// Create new course
export const createCourse = async (courseData) => {
  const response = await axiosInstance.post('/api/courses', courseData);
  return response.data;
};

// Update course
export const updateCourse = async (id, courseData) => {
  const response = await axiosInstance.put(`/api/courses/${id}`, courseData);
  return response.data;
};

// Delete course
export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(`/api/courses/${id}`);
  return response.data;
};

// Enroll in a course
export const enrollInCourse = async (courseId) => {
  const response = await axiosInstance.post(`/api/courses/${courseId}/enroll`);
  return response.data;
};

// Get enrolled courses
export const getEnrolledCourses = async () => {
  const response = await axiosInstance.get('/api/courses/enrolled');
  return response.data;
};

// Get courses by instructor
export const getInstructorCourses = async (instructorId) => {
  const response = await axiosInstance.get(`/api/courses/instructor/${instructorId}`);
  return response.data;
};

// Upload course image
export const uploadCourseImage = async (courseId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axiosInstance.post(
    `/api/courses/${courseId}/upload-image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};