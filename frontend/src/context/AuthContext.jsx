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
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

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
    try {
      const response = await authApi.login(credentials);
      const { token: newToken, user: userData } = response.data;
      
      // Update token in localStorage and state
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Set user data
      setUser(userData);
      
      // Return the response with user data
      return { ...response, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to be caught by the Login component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
