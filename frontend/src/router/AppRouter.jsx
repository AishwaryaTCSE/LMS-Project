// src/router/AppRouter.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/Dashboard/AdminDashboard'));
const AdminStudents = lazy(() => import('../pages/Admin/Students'));
const AdminInstructors = lazy(() => import('../pages/Admin/Instructors'));
const AdminCourses = lazy(() => import('../pages/Admin/Courses'));
const AdminReports = lazy(() => import('../pages/Admin/Reports'));
const AdminAnalytics = lazy(() => import('../pages/Admin/Analytics'));
const AdminProfile = lazy(() => import('../pages/Admin/Profile'));
const UsersManagement = lazy(() => import('../pages/Admin/UsersManagement'));

const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Root redirect component
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoading />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
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

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            {/* Add more student routes */}
          </Route>
        </Route>

        {/* Instructor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['instructor', 'teacher']} />}>
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="students" element={<InstructorStudents />} />
            <Route path="messages" element={<InstructorMessages />} />
            <Route path="analytics" element={<InstructorAnalytics />} />
            <Route path="settings" element={<InstructorSettings />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} redirectPath="/unauthorized" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="instructors" element={<AdminInstructors />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="users" element={<UsersManagement />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;