import api from './api';
import { message } from 'antd';

// User management functions using backend API
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    message.success('User created successfully');
    return response.data.id;
  } catch (error) {
    console.error('Error creating user:', error);
    message.error(error.response?.data?.message || 'Failed to create user');
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const response = await api.put(`/users/${userId}`, updates);
    message.success('User updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    message.error(error.response?.data?.message || 'Failed to update user');
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    message.success('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    message.error(error.response?.data?.message || 'Failed to delete user');
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    message.error(error.response?.data?.message || 'Failed to fetch user');
    throw error;
  }
};

export const getUsers = async (filters = {}) => {
  try {
    const response = await api.get('/users', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    message.error(error.response?.data?.message || 'Failed to fetch users');
    throw error;
  }
};

export const searchUsers = async (searchTerm, role = null) => {
  try {
    const params = { search: searchTerm };
    if (role) {
      params.role = role;
    }
    const response = await api.get('/users/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    message.error(error.response?.data?.message || 'Failed to search users');
    throw error;
  }
};

export const exportUsersToCSV = async (role = null) => {
  try {
    const params = {};
    if (role) {
      params.role = role;
    }
    const response = await api.get('/users/export', { params });
    
    // Create and download CSV file
    const csvContent = response.data;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    message.success('Users exported successfully');
  } catch (error) {
    console.error('Error exporting users:', error);
    message.error(error.response?.data?.message || 'Failed to export users');
    throw error;
  }
};

// Polling function to simulate real-time updates
let usersPollingInterval = null;

export const startUsersPolling = (callback, filters = {}, interval = 30000) => {
  const fetchAndCallback = async () => {
    try {
      const users = await getUsers(filters);
      callback(users);
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Initial fetch
  fetchAndCallback();

  // Set up polling
  usersPollingInterval = setInterval(fetchAndCallback, interval);

  // Return cleanup function
  return () => {
    if (usersPollingInterval) {
      clearInterval(usersPollingInterval);
      usersPollingInterval = null;
    }
  };
};

// Legacy Firebase compatibility functions
export const subscribeToUsers = (callback, role = null) => {
  return startUsersPolling(callback, { role });
};