import axios from './axiosInstance';

// ========== USER CRUD ==========
export const getAllUsers = async (params = {}) => {
  const response = await axios.get('/users/all', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post('/users/students', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`/users/${id}`);
  return response.data;
};

export const bulkUpdateUsers = async (ids, action, data = {}) => {
  const response = await axios.post('/users/bulk', { ids, action, data });
  return response.data;
};

export const exportUsers = async (params = {}) => {
  const response = await axios.get('/users/export/all', { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

// ========== COURSE CRUD ==========
export const getCoursesWithFilters = async (params = {}) => {
  const response = await axios.get('/courses/filter/all', { params });
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await axios.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axios.post('/courses', courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await axios.put(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axios.delete(`/courses/${id}`);
  return response.data;
};

export const bulkUpdateCourses = async (ids, action, data = {}) => {
  const response = await axios.post('/courses/bulk', { ids, action, data });
  return response.data;
};

export const exportCourses = async (params = {}) => {
  const response = await axios.get('/courses/export/all', { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

// ========== ASSIGNMENT CRUD ==========
export const getAllAssignments = async (params = {}) => {
  const response = await axios.get('/assessments/assignment/all', { params });
  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await axios.get(`/assessments/assignment/${id}`);
  return response.data;
};

export const createAssignment = async (assignmentData) => {
  const response = await axios.post('/assessments/assignment', assignmentData);
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await axios.put(`/assessments/assignment/${id}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await axios.delete(`/assessments/assignment/${id}`);
  return response.data;
};

export const exportAssignments = async (params = {}) => {
  const response = await axios.get('/assessments/assignment/export/all', { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

// Helper function to download blob as file
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

