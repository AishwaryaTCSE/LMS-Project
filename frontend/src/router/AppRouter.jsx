// src/router/AppRouter.jsx
import React, { useContext, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import StudentLayout from '../layout/StudentLayout';
import InstructorLayout from '../layout/InstructorLayout';
import AdminLayout from '../layout/AdminLayout';

// Pages - Auth
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const Unauthorized = lazy(() => import('../pages/Auth/Unauthorized'));

// Dashboards
const StudentDashboard = lazy(() => import('../pages/Dashboard/StudentDashboard'));
const InstructorDashboard = lazy(() => import('../pages/Dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('../pages/Dashboard/AdminDashboard'));

// Pages - Home
const HomePage = lazy(() => import('../pages/Home/HomePage'));

const AppRouter = () => {
  const { user, loading } = useContext(AuthContext);

  // Only show the homepage, no dashboard redirection
  const RootRedirect = () => {
    return <HomePage />;
  };

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'teacher' || role === 'instructor') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <Routes>
        {/* Public Routes - Homepage and Auth */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to={getDashboardPath(user.role)} replace /> : <Login />}
        />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboards */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute roles={["teacher", "instructor"]}>
              <InstructorLayout>
                <InstructorDashboard />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;