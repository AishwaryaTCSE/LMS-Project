// src/components/ProtectedRoute.jsx
import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import Loader from './Loader';

/**
 * ProtectedRoute component that handles authentication and authorization
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} [props.roles=[]] - Array of allowed roles
 * @param {string} [props.role] - Single allowed role (alternative to roles array)
 * @param {string} [props.redirectPath='/login'] - Path to redirect to if not authorized
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 * @returns {React.ReactNode} Rendered component or redirect
 */
const ProtectedRoute = ({ 
  children, 
  roles = [], 
  role = null, 
  allowedRoles = [],
  redirectPath = '/login',
  requireAuth = true 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  // Show loading state while checking auth
  if (loading) {
    return <Loader fullScreen />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Store the attempted URL for redirecting after login
    const redirectTo = encodeURIComponent(currentPath);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  // If user is logged in but doesn't have required role
  const effectiveAllowedRoles = roles.length ? roles : (role ? [role] : allowedRoles);
  if (effectiveAllowedRoles.length > 0 && !effectiveAllowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If we have a user and they have the required role (or no role required)
  return children || <Outlet />;
};

export default ProtectedRoute;
