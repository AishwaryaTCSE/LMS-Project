// authService.js
import axios from './axiosInstance.js';

export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const register = async (data) => {
  try {
    const response = await axios.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error during forgot password:', error);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    console.error('Error during reset password:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put('/users/me', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
