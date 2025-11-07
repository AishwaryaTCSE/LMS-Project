// src/api/apiUtils.js
import axios from './axiosInstance';

/**
 * Handles API errors consistently
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @returns {Object} Formatted error response
 */
export const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);

  const errorResponse = {
    success: false,
    message: error.response?.data?.message || error.message || 'An unexpected error occurred',
    status: error.response?.status,
    code: error.code,
    data: error.response?.data?.data || null
  };

  // Handle specific HTTP status codes
  if (error.response?.status === 401) {
    errorResponse.message = 'Session expired. Please log in again.';
    // Optionally trigger logout
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    errorResponse.message = 'You do not have permission to perform this action.';
  } else if (error.response?.status === 404) {
    errorResponse.message = 'The requested resource was not found.';
  } else if (error.response?.status >= 500) {
    errorResponse.message = 'A server error occurred. Please try again later.';
  }

  return { error: errorResponse };
};

/**
 * Wrapper for API calls with consistent error handling
 * @param {string} method - HTTP method (get, post, put, delete, etc.)
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request payload
 * @param {Object} config - Additional axios config
 * @returns {Promise<Object>} Response data or error
 */
export const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(config.headers || {})
      }
    });

    return { data: response.data };
  } catch (error) {
    return handleApiError(error, `${method.toUpperCase()} ${endpoint}`);
  }
};

/**
 * Handles file uploads with progress tracking
 * @param {File} file - The file to upload
 * @param {string} endpoint - Upload endpoint
 * @param {string} fieldName - Form field name (default: 'file')
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload response
 */
export const uploadFile = async (file, endpoint, fieldName = 'file', onProgress) => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const { data, error } = await apiCall(
    'post',
    endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress
    }
  );

  if (error) throw error;
  return data;
};

// Export all utils
export default {
  apiCall,
  handleApiError,
  uploadFile
};