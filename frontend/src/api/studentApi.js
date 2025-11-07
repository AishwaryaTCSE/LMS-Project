import axios from './axiosInstance';

export const listStudents = async ({ q = '', status = 'all', page = 1, limit = 20 } = {}) => {
  const response = await axios.get('/instructor/students', { params: { q, status, page, limit } });
  return response.data?.data || response.data || response;
};

export const addStudent = async (payload) => {
  const response = await axios.post('/instructor/students', payload);
  return response.data?.data || response.data || response;
};

export const exportStudents = async ({ q = '', status = 'all' } = {}) => {
  const response = await axios.get('/users/students/export', {
    params: { q, status },
    responseType: 'blob',
    headers: { Accept: 'text/csv' }
  });
  return response.data;
};


