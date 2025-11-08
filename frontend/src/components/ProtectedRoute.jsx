// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import Loader from './Loader';

// Role-based dashboard paths
const ROLE_PATHS = {
  admin: '/admin/dashboard',
  instructor: '/instructor/dashboard',
  student: '/student/dashboard'
};

/**
 * ProtectedRoute component that handles authentication and authorization
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} props.allowedRoles - Array of allowed roles
 * @param {string} [props.redirectPath] - Path to redirect to if not authorized
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 * @returns {React.ReactNode} Rendered component or redirect
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [],
  redirectPath: customRedirectPath,
  requireAuth = true 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Default redirect paths based on role
  const defaultRedirectPath = user?.role ? ROLE_PATHS[user.role] || '/' : '/';
  const redirectPath = customRedirectPath || defaultRedirectPath;

  // Redirect to dashboard if user is already authenticated and tries to access auth pages
  useEffect(() => {
    if (isAuthenticated && user?.role && location.pathname === '/login') {
      navigate(ROLE_PATHS[user.role] || '/', { replace: true });
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return <Loader fullScreen />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  // If user is logged in but doesn't have required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized or to default dashboard based on role
    if (user.role && ROLE_PATHS[user.role]) {
      return <Navigate to={ROLE_PATHS[user.role]} replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  // If we have a user and they have the required role (or no role required)
  return children || <Outlet />;
};

export default ProtectedRoute;
