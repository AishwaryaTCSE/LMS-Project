// src/router/AppRouter.jsx
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load components
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const Unauthorized = lazy(() => import("../pages/Auth/Unauthorized"));

// Layouts
const StudentLayout = lazy(() => import('../layout/StudentLayout'));
const InstructorLayout = lazy(() => import('../layout/InstructorLayout'));
const AdminLayout = lazy(() => import('../layout/AdminLayout'));

// Pages
const StudentDashboard = lazy(() => import('../pages/Dashboard/StudentDashboard'));
const InstructorDashboard = lazy(() => import('../pages/Dashboard/InstructorDashboard'));
const InstructorCourses = lazy(() => import('../pages/Instructor/Courses'));
const InstructorStudents = lazy(() => import('../pages/Instructor/Students'));
const InstructorMessages = lazy(() => import('../pages/Instructor/Messages'));
const InstructorAnalytics = lazy(() => import('../pages/Instructor/Analytics'));
const InstructorSettings = lazy(() => import('../pages/Instructor/Settings'));
const AdminDashboard = lazy(() => import('../pages/Dashboard/AdminDashboard'));

// Import all components first to ensure they're loaded before use
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Better error boundary component with error details
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left text-sm">
                  <summary className="text-blue-600 cursor-pointer">Error details</summary>
                  <div className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                    <p className="font-semibold">{this.state.error.toString()}</p>
                    <pre className="mt-2 text-xs text-gray-600">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppRouter = () => {
  const { user, loading, error: authError } = useAuth();

  // Root redirect based on user role
  const RootRedirect = () => {
    if (loading) return <PageLoading />;
    
    if (!user) {
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    // Redirect based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'instructor' || user.role === 'teacher') {
      return <Navigate to="/instructor/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            {/* Add more student routes here */}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['instructor', 'teacher']} />}>
          <Route 
            path="/instructor" 
            element={
              <InstructorLayout>
                <Outlet />
              </InstructorLayout>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="students" element={<InstructorStudents />} />
            <Route path="messages" element={<InstructorMessages />} />
            <Route path="analytics" element={<InstructorAnalytics />} />
            <Route path="settings" element={<InstructorSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* Add more admin routes here */}
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRouter;