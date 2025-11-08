// frontend/src/api/courseApi.js
import axiosInstance from './axiosInstance';

// Get all courses
export const getCourses = async () => {
  try {
    const response = await axiosInstance.get('/courses');
    return response.data.data || []; // Ensure we return an array
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Get single course by ID
export const getCourseById = async (id) => {
  if (!id) {
    throw new Error('Course ID is required');
  }
  try {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data.data || {};
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
};

// Create new course
export const createCourse = async (courseData) => {
  try {
    // Debug: Log current authentication state
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('=== Course Creation Debug ===');
    console.log('Token exists:', !!token);
    console.log('User role:', user.role || 'No role found');
    console.log('Course data being sent:', courseData);
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    // Add request interceptor to log the actual request
    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        console.log('Request headers:', config.headers);
        return config;
      },
      error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
    
    // Make the request
    const response = await axiosInstance.post('/courses', courseData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Force include the token
      },
      validateStatus: function (status) {
        return status < 500; // Reject only if status is 500 or above
      }
    });
    
    // Remove the interceptor
    axiosInstance.interceptors.request.eject(requestInterceptor);
    
    console.log('Course created successfully:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('=== Course Creation Error ===');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      if (error.response.status === 403) {
        console.error('Access Denied. Possible reasons:');
        console.error('- Your session may have expired');
        console.error('- Your account may not have permission to create courses');
        console.error('- The token may be invalid or malformed');
        
        // If token exists but still getting 403, it might be invalid/expired
        if (localStorage.getItem('token')) {
          console.warn('Token exists but request was forbidden. The token might be invalid or expired.');
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    // Handle 403 specifically
    if (error.response && error.response.status === 403) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login?session=expired';
      throw new Error('Your session has expired. Please log in again.');
    }
    
    // Re-throw with more context
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to create course';
    throw new Error(errorMessage);
  }
};

// Update course
export const updateCourse = async (id, courseData) => {
  const response = await axiosInstance.put(`/courses/${id}`, courseData);
  return response.data;
};

// Delete course
export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(`/courses/${id}`);
  return response.data;
};

// Enroll in a course
export const enrollInCourse = async (courseId) => {
  const response = await axiosInstance.post(`/courses/${courseId}/enroll`);
  return response.data;
};

// Get enrolled courses
export const getEnrolledCourses = async () => {
  const response = await axiosInstance.get('/courses/enrolled');
  return response.data;
};

// Get courses by instructor
export const getInstructorCourses = async (instructorId) => {
  const response = await axiosInstance.get(`/courses/instructor/${instructorId}`);
  return response.data;
};

// Upload course image
export const uploadCourseImage = async (courseId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axiosInstance.post(
    `/courses/${courseId}/upload-image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};