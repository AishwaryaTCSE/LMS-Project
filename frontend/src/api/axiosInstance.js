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

// Request interceptor to attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
