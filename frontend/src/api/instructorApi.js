// src/api/instructorApi.js
import axios from './axiosInstance';

/**
 * Handles API errors consistently and handles specific status codes.
 */
const handleApiError = (error, context) => {
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
    // Trigger logout/redirect for 401
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    errorResponse.message = 'You do not have permission to perform this action.';
  } else if (error.response?.status === 404) {
    errorResponse.message = 'The requested resource was not found.';
  }

  return { error: errorResponse };
};

/**
 * Wrapper for API calls with consistent error handling and configuration support.
 * This is the merged, robust definition of apiCall.
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} endpoint - API endpoint URL
 * @param {any} [data=null] - Request body data
 * @param {Object} [config={}] - Axios request configuration (headers, params, timeout, etc.)
 * @returns {Promise<{data: Object} | {error: Object}>}
 */
const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Merge provided headers with defaults, allowing override
        ...(config.headers || {})
      }
    });

    return { data: response.data };
  } catch (error) {
    return handleApiError(error, `${method.toUpperCase()} ${endpoint}`);
  }
};

// --- Dashboard specific functions ---

export const getCourses = async (params = {}) => {
  const { data, error } = await apiCall('get', '/instructor/courses', null, { params });
  if (error) throw error;
  return data?.data || data || [];
};

export const getAssignments = async (params = {}) => {
  const { data, error } = await apiCall('get', '/instructor/assignments', null, { params });
  if (error) throw error;
  return data?.data || data || [];
};

export const getQuizzes = async (params = {}) => {
  // Using the more generic path /instructor/quizzes as seen in the first block
  const { data, error } = await apiCall('get', '/instructor/quizzes', null, { params });
  if (error) throw error;
  return data?.data || data || [];
};

export const getSubmissions = async (params = {}) => {
  // Using the more generic path /instructor/submissions as seen in the first block
  const { data, error } = await apiCall('get', '/instructor/submissions', null, { params });
  if (error) throw error;
  return data?.data || data || [];
};

// --- Course Management ---

/**
 * Get courses for the currently logged-in instructor (Uses V1 endpoint from the later definition)
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of instructor's courses
 */
export const getInstructorCourses = async (params = {}) => {
  const { data, error } = await apiCall('get', '/instructor/courses', null, { params });
  if (error) throw error;
  return data?.data || data || [];
};

/**
 * Create a new course (Uses V1 endpoint and robust error handling from the later definition)
 * @param {Object} courseData - The course data to create
 * @returns {Promise<Object>} The created course
 * @throws {Error} If the creation fails
 */
export const createInstructorCourse = async (courseData) => {
  const { data, error: apiError } = await apiCall('post', '/instructor/courses', courseData);

  if (apiError) {
    const error = new Error(apiError.message || 'Failed to create course');
    error.code = apiError.code || 'COURSE_CREATE_FAILED';
    error.status = apiError.status;
    throw error;
  }
  return data && data.data ? data.data : data;
};

/**
 * Update an existing course (Uses V1 endpoint and robust error handling/validation from the later definition)
 * @param {string} courseId - The ID of the course to update
 * @param {Object} courseData - The updated course data
 * @returns {Promise<Object>} The updated course
 * @throws {Error} If the update fails
 */
export const updateInstructorCourse = async (courseId, courseData) => {
  if (!courseId) {
    throw new Error('Course ID is required');
  }

  const { data, error: apiError } = await apiCall('put', `/instructor/courses/${courseId}`, courseData);

  if (apiError) {
    const error = new Error(apiError.message || 'Failed to update course');
    error.code = apiError.code || 'COURSE_UPDATE_FAILED';
    error.status = apiError.status;
    throw error;
  }
  return data && data.data ? data.data : data;
};

/**
 * Delete a course (Uses V1 endpoint and robust error handling/validation from the later definition)
 * @param {string} courseId - The ID of the course to delete
 * @returns {Promise<Object>} The deletion result
 * @throws {Error} If the deletion fails
 */
export const deleteInstructorCourse = async (courseId) => {
  if (!courseId) {
    throw new Error('Course ID is required');
  }

  const { data, error: apiError } = await apiCall('delete', `/instructor/courses/${courseId}`);

  if (apiError) {
    const error = new Error(apiError.message || 'Failed to delete course');
    error.code = apiError.code || 'COURSE_DELETE_FAILED';
    error.status = apiError.status;
    throw error;
  }
  return data || { success: true };
};

// --- Analytics ---

/**
 * Fetch analytics data for the instructor dashboard (Uses V1 endpoint and robust error handling/timeout)
 * @param {Object} [params] - Query parameters
 * @returns {Promise<Object>} Analytics data
 * @throws {Error} If analytics data cannot be fetched
 */
export const getInstructorAnalytics = async (params = {}) => {
  const { data, error } = await apiCall(
    'get',
    '/analytics', // Endpoint path without the duplicate /api/v1 prefix
    null,
    {
      params,
      timeout: 15000
    }
  );

  if (error) {
    const analyticsError = new Error(error.message || 'Failed to fetch analytics');
    analyticsError.code = error.code || 'ANALYTICS_FETCH_FAILED';
    analyticsError.status = error.status;
    throw analyticsError;
  }

  return {
    metrics: data?.metrics || {},
    charts: data?.charts || {},
    lastUpdated: data?.lastUpdated || new Date().toISOString(),
    ...(data || {})
  };
};

// --- Settings ---

/**
 * Update instructor settings (Uses V1 endpoint and robust validation/error handling)
 * @param {Object} settings - The settings object to update
 * @returns {Promise<Object>} Updated settings object
 * @throws {Error} If settings update fails or response is invalid
 */
export const updateInstructorSettings = async (settings) => {
  // Input validation from the robust definition
  if (!settings || typeof settings !== 'object' || Object.keys(settings).length === 0) {
    const error = new Error('Settings must be a non-empty object');
    error.code = 'INVALID_INPUT';
    throw error;
  }

  const { data, error } = await apiCall(
    'put',
    '/instructor/settings', // Using V1 endpoint
    settings,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000,
      validateStatus: (status) => status < 500
    }
  );

  if (error) {
    const apiError = new Error(error.message || 'Failed to update settings');
    apiError.code = error.code || 'SETTINGS_UPDATE_FAILED';
    apiError.status = error.status;
    apiError.details = error.data?.details;
    throw apiError;
  }

  // Response validation from the robust definition
  if (!data || typeof data !== 'object') {
    const error = new Error('Invalid response format from server');
    error.code = 'INVALID_RESPONSE';
    throw error;
  }

  return data.data || data;
};

// --- Utility function to handle file uploads ---

export const uploadFile = async (file, endpoint, fieldName = 'file', onUploadProgress) => {
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
      onUploadProgress,
    }
  );

  if (error) throw error;
  return data?.data || data;
};