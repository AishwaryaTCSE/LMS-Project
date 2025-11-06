// authService.js
import axios from './axiosInstance.js';

export const login = async (credentials) => {
  try {
    console.log('Sending login request with credentials:', {
      email: credentials.email,
      // Don't log password for security
      hasPassword: !!credentials.password 
    });
    
    const response = await axios.post('/auth/login', credentials);
    
    console.log('Login response received:', {
      status: response.status,
      data: response.data ? { 
        hasUser: !!response.data.user,
        hasToken: !!response.data.token,
        userRole: response.data.user?.role
      } : 'No data'
    });
    
    return response;
  } catch (error) {
    console.error('Login API error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    
    // Re-throw with a more descriptive message if needed
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || 'Authentication failed';
      error.message = errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      error.message = 'No response from server. Please check your connection.';
    }
    
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await axios.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Alias for backward compatibility
export const getProfile = getUserProfile;

export const register = async (data) => {
  try {
    console.log('Sending registration request:', {
      ...data,
      password: data.password ? '***' : undefined,
      confirmPassword: data.confirmPassword ? '***' : undefined
    });
    
    const response = await axios.post('/auth/register', data);
    
    console.log('Registration response received:', {
      status: response.status,
      success: response.data?.success
    });
    
    return response.data;
  } catch (error) {
    console.error('Error during registration:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
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
