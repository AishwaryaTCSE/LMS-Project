// src/context/AuthProvider.jsx
import React, { useState, useEffect, createContext, useCallback } from 'react';
import * as authApi from '../api/authApi';

// ✅ Named export
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AuthContext effect - Token:', !!token, 'User:', !!user);
    if (token) {
      // If we have a token but no user data, or if user data is invalid
      if (!user || Object.keys(user).length === 0) {
        console.log('Fetching profile with token...');
        fetchProfile();
      } else {
        console.log('User data already exists, skipping fetch');
        setLoading(false);
      }
    } else {
      console.log('No token available, setting loading to false');
      setLoading(false);
    }
  }, [token, user]);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      console.log('No token available, skipping profile fetch');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching user profile...');
      setLoading(true);
      setError(null);
      
      const response = await authApi.getProfile(token);
      console.log('Profile API response:', response);
      
      // Handle the response structure: { success: boolean, data: userData }
      const userData = response && response.data ? response.data : response;
      
      if (userData && userData._id) {
        console.log('User data received:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.warn('Invalid user data structure received:', response);
        // Clear invalid data and force re-authentication
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Invalid user data received from server');
        // Redirect to login after a short delay to allow state to update
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setUser(null);
      setToken('');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setError(err.message || 'Failed to load user profile');
      // Redirect to login after a short delay to allow state to update
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const login = async (credentials) => {
    console.log('AuthContext: Login initiated with credentials:', { email: credentials.email });
    try {
      console.log('AuthContext: Making API call to login...');
      const response = await authApi.login(credentials);
      console.log('AuthContext: Login API response:', response);
      
      // Check if response and response.data exist
      if (!response || !response.data) {
        console.error('AuthContext: Invalid response format');
        throw new Error('Invalid response from server');
      }
      
      console.log('AuthContext: Raw response data:', response.data);
      
      // Extract user data and token from response
      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid user data received from server');
      }
      
      // Store user data and token
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('AuthContext: User logged in successfully:', {
        userId: user._id,
        role: user.role,
        email: user.email
      });
      
      return { user, token };
      let newToken, userData;
      
      // Check if the response has data directly (Axios response)
      if (response.data) {
        // Check for the expected structure
        if (response.data.token && response.data.user) {
          newToken = response.data.token;
          userData = response.data.user;
        } 
        // Handle case where data is nested under 'data' property
        else if (response.data.data && response.data.data.token && response.data.data.user) {
          newToken = response.data.data.token;
          userData = response.data.data.user;
        }
      }
      
      // Check if we successfully extracted token and user data
      if (!newToken || !userData) {
        console.error('AuthContext: Could not extract token and user data from response:', {
          hasToken: !!newToken,
          hasUserData: !!userData,
          responseData: response.data
        });
        throw new Error('Invalid response format from server');
      }
      
      console.log('AuthContext: Updating auth state with new token and user data');
      
      // Update token in localStorage and state
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Ensure user data is properly set in state
      console.log('AuthContext: Setting user data in context:', userData);
      setUser(userData);
      
      // Set loading to false since we have user data
      setLoading(false);
      
      // Return the response data including the user
      const result = { 
        success: true,
        user: userData,
        token: newToken
      };
      
      console.log('AuthContext: Login successful, returning:', result);
      return result;
      
    } catch (error) {
      console.error('AuthContext: Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Clear any invalid tokens on error
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
      
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  // Compute isAuthenticated based on user and token
  const isAuthenticated = !!(user && token);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    fetchProfile, // expose fetchProfile to allow manual refreshes
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
