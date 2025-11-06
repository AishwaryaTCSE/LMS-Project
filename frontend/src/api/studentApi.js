import axios from './axiosInstance';

export const listStudents = async ({ q = '', status = 'all', page = 1, limit = 20 } = {}) => {
  const response = await axios.get('/users/students', { params: { q, status, page, limit } });
  return response.data;
};

export const addStudent = async (payload) => {
  const response = await axios.post('/users/students', payload);
  return response.data;
};

export const exportStudents = async ({ q = '', status = 'all' } = {}) => {
  const response = await axios.get('/users/students/export', {
    params: { q, status },
    responseType: 'blob',
    headers: { Accept: 'text/csv' }
  });
  return response.data;
};


