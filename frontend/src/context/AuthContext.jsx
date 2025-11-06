// src/context/AuthProvider.jsx
import React, { useState, useEffect, createContext } from 'react';
import * as authApi from '../api/authApi';

// ✅ Named export
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      // Only fetch profile if we have a token but no user data
      fetchProfile();
    } else if (!token) {
      setLoading(false);
    }
  }, [token, user]);

  const fetchProfile = async () => {
    try {
      // Use a profile endpoint ideally
      const response = await authApi.getProfile(token); 
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

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
      
      // Handle different response structures
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
