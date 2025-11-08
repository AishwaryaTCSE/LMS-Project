// src/router/AppRouter.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

// --- Auth Pages ---
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));

// --- Main Pages ---
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));

// --- Course Pages ---
const Courses = lazy(() => import('../pages/Courses/CourseList'));
const CourseDetail = lazy(() => import('../pages/Courses/CourseDetail'));

// --- Assignment Pages ---
const AssignmentList = lazy(() => import('../pages/Assignments/AssignmentList'));
const AssignmentForm = lazy(() => import('../pages/Assignments/AssignmentForm'));
const AssignmentDetail = lazy(() => import('../pages/Assignments/AssignmentDetail'));

// --- Quiz Pages ---
const QuizList = lazy(() => import('../pages/Quizzes/QuizList'));
const QuizForm = lazy(() => import('../pages/Quizzes/QuizForm'));
const QuizTaking = lazy(() => import('../pages/Quizzes/QuizTaking'));
const QuizResult = lazy(() => import('../pages/Quizzes/QuizResult'));

// --- Gradebook Pages ---
const GradebookView = lazy(() => import('../pages/Gradebook/GradebookView'));
const GradeEntry = lazy(() => import('../pages/Gradebook/GradeEntry'));
const StudentGradeView = lazy(() => import('../pages/Gradebook/StudentGradeView'));

// --- Submission Pages ---
const SubmissionForm = lazy(() => import('../pages/Submissions/SubmissionForm'));
const SubmissionList = lazy(() => import('../pages/Submissions/SubmissionList'));
const GradingInterface = lazy(() => import('../pages/Submissions/GradingInterface'));

// --- Plagiarism Check Pages ---
const PlagiarismCheck = lazy(() => import('../pages/Plagiarism/PlagiarismCheck'));
const SimilarityReport = lazy(() => import('../pages/Plagiarism/SimilarityReport'));

// --- Admin Pages ---
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

// Admin Components
const AdminLayout = lazy(() => import('../layout/AdminLayout'));
const UsersManagement = lazy(() => import('../pages/Admin/UsersManagement'));
const AdminStudents = lazy(() => import('../pages/Admin/Students'));
const AdminInstructors = lazy(() => import('../pages/Admin/Instructors'));
const AdminCourses = lazy(() => import('../pages/Admin/Courses'));
const AdminReports = lazy(() => import('../pages/Admin/Reports'));
const AdminAnalytics = lazy(() => import('../pages/Admin/Analytics'));
const AdminProfile = lazy(() => import('../pages/Admin/Profile'));
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard'));

// NEW: Instructor Route Components
const InstructorDashboard = lazy(() => import('../pages/Instructor/Dashboard'));
const InstructorCourses = lazy(() => import('../pages/Instructor/Courses'));
const InstructorStudents = lazy(() => import('../pages/Instructor/Students'));
const InstructorMessages = lazy(() => import('../pages/Instructor/Messages'));
const InstructorAnalytics = lazy(() => import('../pages/Instructor/Analytics'));
const InstructorSettings = lazy(() => import('../pages/Instructor/Settings'));


// --- Route Components ---
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'));
const AdminRoute = lazy(() => import('../router/AdminRoute')); // Note: Not used in this file's final structure, but kept.

const AppRouter = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';
  
  // Show loading state while checking auth status
  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : isInstructor ? (
                <Navigate to="/instructor/dashboard" replace />
              ) : isStudent ? (
                <Navigate to="/student/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {/* Role-based dashboard redirection */}
          <Route 
            path="/dashboard" 
            element={
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : isInstructor ? (
                <Navigate to="/instructor/dashboard" replace />
              ) : isStudent ? (
                <Navigate to="/student/dashboard" replace />
              ) : (
                <Dashboard />
              )
            } 
          />
          
          {/* Common protected routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Course Routes */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />

          {/* Assignment Routes */}
          <Route path="/courses/:courseId/assignments" element={<AssignmentList />} />
          <Route path="/courses/:courseId/assignments/new" element={<AssignmentForm />} />
          <Route path="/assignments/:assignmentId/edit" element={<AssignmentForm />} />
          <Route path="/assignments/:assignmentId" element={<AssignmentDetail />} />

          {/* Quiz Routes */}
          <Route path="/courses/:courseId/quizzes" element={<QuizList />} />
          <Route path="/quizzes/new" element={<QuizForm />} />
          <Route path="/quizzes/:quizId/edit" element={<QuizForm />} />
          <Route path="/quizzes/:quizId/take" element={<QuizTaking />} />
          <Route path="/quizzes/:quizId/results/:attemptId" element={<QuizResult />} />

          {/* Gradebook Routes */}
          <Route path="/courses/:courseId/gradebook" element={<GradebookView />} />
          <Route path="/courses/:courseId/grades" element={<StudentGradeView />} />

          {/* Submission Routes */}
          <Route
            path="/assignments/:assignmentId/submit"
            element={isStudent ? <SubmissionForm /> : <Navigate to="/" replace />}
          />
          <Route
            path="/assignments/:assignmentId/submissions"
            element={isInstructor ? <SubmissionList /> : <Navigate to="/" replace />}
          />
          <Route
            path="/submissions/:submissionId/grade"
            element={isInstructor ? <GradingInterface /> : <Navigate to="/" replace />}
          />

          {/* Plagiarism Check Routes */}
          <Route
            path="/assignments/:assignmentId/plagiarism"
            element={isInstructor ? <PlagiarismCheck /> : <Navigate to="/" replace />}
          />
          <Route
            path="/assignments/:assignmentId/plagiarism/:submissionId"
            element={isInstructor ? <SimilarityReport /> : <Navigate to="/" replace />}
          />

          {/* Student Quizzes */}
          <Route path="/student/quizzes">
            <Route index element={<QuizList studentView />} />
            <Route path=":quizId/take" element={<QuizTaking />} />
            <Route path="results/:attemptId" element={<QuizResult />} />
          </Route>

          {/* Student Grades */}
          <Route path="/student/grades" element={<StudentGradeView />} />


          {/* Instructor Routes (Protected by the parent ProtectedRoute) */}
          <Route path="/instructor">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="students" element={<InstructorStudents />} />
            <Route path="messages" element={<InstructorMessages />} />
            <Route path="analytics" element={<InstructorAnalytics />} />
            <Route path="settings" element={<InstructorSettings />} />

            {/* Instructor Assignments */}
            <Route path="assignments">
              <Route index element={<AssignmentList />} />
              <Route path="create" element={<AssignmentForm />} />
              <Route path=":assignmentId" element={<AssignmentDetail />} />
              <Route path="edit/:assignmentId" element={<AssignmentForm />} />
              <Route path=":assignmentId/submissions" element={<SubmissionList />} />
              <Route path="submissions/:submissionId/grade" element={<GradingInterface />} />
            </Route>

            {/* Instructor Quizzes */}
            <Route path="quizzes">
              <Route index element={<QuizList />} />
              <Route path="create" element={<QuizForm />} />
              <Route path="edit/:quizId" element={<QuizForm />} />
              <Route path="results/:quizId" element={<QuizResult showAll />} />
            </Route>

            {/* Gradebook */}
            <Route path="gradebook" element={<GradebookView />} />
            <Route path="gradebook/entry/:studentId/:courseId" element={<GradeEntry />} />

            {/* Plagiarism Check */}
            <Route path="plagiarism" element={<PlagiarismCheck />} />
            <Route path="plagiarism/report/:reportId" element={<SimilarityReport />} />
          </Route>
        </Route> {/* End of Protected Routes */}

        {/* Admin Routes */}
        {/* Note: Using ProtectedRoute with 'admin' role check, but it should be defined */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin']} redirectPath="/unauthorized" />}>
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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;