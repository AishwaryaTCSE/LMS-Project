// axiosInstance.js
import axios from 'axios';

// Create Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false // Disable credentials by default
});

// Log the base URL for debugging
console.log('API Base URL:', instance.defaults.baseURL);

// List of endpoints that don't require authentication
const publicEndpoints = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password'
];

// Request interceptor to attach token
instance.interceptors.request.use(
  (config) => {
    // Skip token check for public endpoints
    if (publicEndpoints.some(endpoint => config.url.endsWith(endpoint))) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      // Don't redirect for API calls, let the component handle it
      return Promise.reject(new Error('No authentication token found'));
    }
    
    // Ensure the token is properly formatted
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers['Authorization'] = authToken;
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (unauthorized) globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
