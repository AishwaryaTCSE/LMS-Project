import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const createAssignment = async (formData) => {
  const response = await axios.post(`${API_BASE}/assignments`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getAssignments = async (courseId) => {
  const response = await axios.get(`${API_BASE}/assignments/course/${courseId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAssignment = async (id) => {
  const response = await axios.get(`${API_BASE}/assignments/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const submitAssignment = async (assignmentId, formData) => {
  const response = await axios.post(`${API_BASE}/assignments/${assignmentId}/submit`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const gradeSubmission = async (submissionId, gradeData) => {
  const response = await axios.post(`${API_BASE}/assignments/submissions/${submissionId}/grade`, gradeData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getSubmissions = async (assignmentId) => {
  const response = await axios.get(`${API_BASE}/assignments/${assignmentId}/submissions`, {
    headers: getAuthHeader()
  });
  return response.data;
};