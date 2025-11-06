// src/api/adminApi.js
import axios from './axiosInstance';

// This wraps the shared axios instance with an /admin prefix for convenience
const adminApi = {
  get: (url, config) => axios.get(`/admin${url}`, config),
  post: (url, data, config) => axios.post(`/admin${url}`, data, config),
  put: (url, data, config) => axios.put(`/admin${url}`, data, config),
  patch: (url, data, config) => axios.patch(`/admin${url}`, data, config),
  delete: (url, config) => axios.delete(`/admin${url}`, config),
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await adminApi.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// User Management
export const getUsers = async (params = {}) => {
  try {
    const response = await adminApi.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await adminApi.patch(`/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const bulkUpdateUsers = async (ids, body) => {
  try {
    const response = await adminApi.post('/users/bulk', { ids, ...body });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating users:', error);
    throw error;
  }
};

// Course Management
export const getCourses = async (params = {}) => {
  try {
    const response = await adminApi.get('/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const updateCourseStatus = async (courseId, status) => {
  try {
    const response = await adminApi.patch(`/courses/${courseId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating course status:', error);
    throw error;
  }
};

export const bulkUpdateCourses = async (ids, body) => {
  try {
    const response = await adminApi.post('/courses/bulk', { ids, ...body });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating courses:', error);
    throw error;
  }
};

// System Settings
export const getSystemSettings = async () => {
  try {
    const response = await adminApi.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

export const updateSystemSettings = async (settings) => {
  try {
    const response = await adminApi.put('/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

// Analytics
export const getAnalytics = async (params = {}) => {
  try {
    const response = await adminApi.get('/analytics', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// System Health
export const getSystemHealth = async () => {
  try {
    const response = await adminApi.get('/system/health');
    return response.data;
  } catch (error) {
    console.error('Error fetching system health:', error);
    throw error;
  }
};

// Logs & Audits
export const getAuditLogs = async (params = {}) => {
  try {
    const response = await adminApi.get('/logs/audit', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

export const getSystemLogs = async (params = {}) => {
  try {
    const response = await adminApi.get('/logs/system', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching system logs:', error);
    throw error;
  }
};

// Data Export
export const exportData = async (type, params = {}) => {
  try {
    const response = await adminApi.get(`/export/${type}` , {
      params,
      responseType: 'blob',
      headers: { Accept: 'text/csv' }
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export default adminApi;