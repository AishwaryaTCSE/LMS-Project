import api from './axiosInstance';

// Assignment CRUD Operations
export const getAssignments = async (courseId) => {
  const response = await api.get(courseId ? `/assignments?courseId=${courseId}` : '/assignments');
  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
};

export const createAssignment = async (assignmentData) => {
  const response = await api.post('/assignments', assignmentData);
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await api.put(`/assignments/${id}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};

// Submission Operations
export const submitAssignment = async (assignmentId, submissionData) => {
  const formData = new FormData();
  
  // Append all fields from submissionData to formData
  Object.entries(submissionData).forEach(([key, value]) => {
    if (key === 'attachments' && value) {
      // Handle multiple file uploads
      Array.from(value).forEach(file => {
        formData.append('attachments', file);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await api.post(`/assignments/${assignmentId}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSubmissions = async (assignmentId) => {
  const response = await api.get(`/assignments/${assignmentId}/submissions`);
  return response.data;
};

export const getSubmission = async (submissionId) => {
  const response = await api.get(`/submissions/${submissionId}`);
  return response.data;
};

export const gradeSubmission = async (submissionId, gradeData) => {
  const response = await api.put(`/submissions/${submissionId}/grade`, gradeData);
  return response.data;
};

export const downloadSubmissionFile = async (fileId) => {
  const response = await api.get(`/submissions/files/${fileId}`, {
    responseType: 'blob',
  });
  return response.data;
};