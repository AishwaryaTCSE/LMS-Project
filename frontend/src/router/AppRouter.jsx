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
const CourseForm = lazy(() => import('../pages/Courses/CourseForm'));

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
const AdminLayout = lazy(() => import('../layout/AdminLayout'));
const UsersManagement = lazy(() => import('../pages/Admin/UsersManagement'));
const UserDetail = lazy(() => import('../pages/Admin/UserDetail'));
const CourseManagement = lazy(() => import('../pages/Admin/CourseManagement'));
const AdminStudents = lazy(() => import('../pages/Admin/Students'));
const AdminInstructors = lazy(() => import('../pages/Admin/Instructors'));
const AdminCourses = lazy(() => import('../pages/Admin/Courses'));
const AdminReports = lazy(() => import('../pages/Admin/Reports'));
const AdminAnalytics = lazy(() => import('../pages/Admin/Analytics'));
const AdminProfile = lazy(() => import('../pages/Admin/Profile'));
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard'));

// --- Instructor Components ---
const InstructorLayout = lazy(() => import('../layout/InstructorLayout'));
const InstructorDashboard = lazy(() => import('../pages/Instructor/Dashboard'));
const InstructorCourses = lazy(() => import('../pages/Instructor/Courses'));
const InstructorCourseForm = lazy(() => import('../pages/Courses/CourseForm'));
const InstructorStudents = lazy(() => import('../pages/Instructor/Students'));
const InstructorMessages = lazy(() => import('../pages/Instructor/Messages'));
const InstructorAnalytics = lazy(() => import('../pages/Instructor/Analytics'));
const InstructorSettings = lazy(() => import('../pages/Instructor/Settings'));
const InstructorActivities = lazy(() => import('../pages/Instructor/Activities'));
const InstructorGradebook = lazy(() => import('../pages/Instructor/Gradebook'));
const InstructorProfile = lazy(() => import('../pages/Instructor/Profile'));
const InstructorAssignments = lazy(() => import('../pages/Instructor/Assignments'));
const StudentDetail = lazy(() => import('../pages/Instructor/StudentDetail')); // Added missing component
const ConversationDetail = lazy(() => import('../pages/Instructor/ConversationDetail')); // Added missing component


// --- Route Components ---
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'));
const AdminRoute = lazy(() => import('../router/AdminRoute')); 

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

        {/* =========================================================================
        COMMON PROTECTED ROUTES 
        ========================================================================== */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          
          {/* Role-based dashboard redirection (for /dashboard path) */}
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
          
          {/* General Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Course, Assignment, Quiz, Gradebook, Submission, Plagiarism Routes 
             (Used as generic routes or accessible by all roles, controlled by logic) */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/add" element={<CourseForm />} />
          <Route path="/courses/edit/:courseId" element={<CourseForm />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />

          <Route path="/courses/:courseId/assignments" element={<AssignmentList />} />
          <Route path="/courses/:courseId/assignments/new" element={<AssignmentForm />} />
          <Route path="/assignments/:assignmentId/edit" element={<AssignmentForm />} />
          <Route path="/assignments/:assignmentId" element={<AssignmentDetail />} />

          <Route path="/courses/:courseId/quizzes" element={<QuizList />} />
          <Route path="/quizzes/new" element={<QuizForm />} />
          <Route path="/quizzes/:quizId/edit" element={<QuizForm />} />
          <Route path="/quizzes/:quizId/take" element={<QuizTaking />} />
          <Route path="/quizzes/:quizId/results/:attemptId" element={<QuizResult />} />

          <Route path="/courses/:courseId/gradebook" element={<GradebookView />} />
          <Route path="/courses/:courseId/grades" element={<StudentGradeView />} />

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

          <Route
            path="/assignments/:assignmentId/plagiarism"
            element={isInstructor ? <PlagiarismCheck /> : <Navigate to="/" replace />}
          />
          <Route
            path="/assignments/:assignmentId/plagiarism/:submissionId"
            element={isInstructor ? <SimilarityReport /> : <Navigate to="/" replace />}
          />

          {/* Student-Specific Routes */}
          <Route path="/student/dashboard" element={<Dashboard studentView />} /> {/* Assuming Dashboard handles student view */}
          <Route path="/student/quizzes">
            <Route index element={<QuizList studentView />} />
            <Route path=":quizId/take" element={<QuizTaking />} />
            <Route path="results/:attemptId" element={<QuizResult />} />
          </Route>
          <Route path="/student/grades" element={<StudentGradeView />} />


          {/* =========================================================================
          INSTRUCTOR ROUTES (Nested under /instructor and ProtectedRoute)
          ========================================================================== */}
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            
            {/* Courses */}
            <Route path="courses">
              <Route index element={<InstructorCourses />} />
              <Route path="create" element={<InstructorCourseForm />} />
              {/* Alias for older links that used 'new' */}
              <Route path="new" element={<InstructorCourseForm />} />
              <Route path=":courseId/edit" element={<InstructorCourseForm />} />
              <Route path=":courseId" element={<CourseDetail />} />
            </Route>
            
            {/* Assignments */}
            <Route path="assignments">
              <Route index element={<InstructorAssignments />} />
              <Route path="create" element={<AssignmentForm />} />
              <Route path=":assignmentId" element={<AssignmentDetail />} />
              <Route path=":assignmentId/edit" element={<AssignmentForm />} />
              <Route path=":assignmentId/submissions" element={<SubmissionList />} />
              <Route path="submissions/:submissionId/grade" element={<GradingInterface />} />
              <Route path=":assignmentId/plagiarism" element={<PlagiarismCheck />} />
            </Route>

            {/* Quizzes */}
            <Route path="quizzes">
              <Route index element={<QuizList />} />
              <Route path="create" element={<QuizForm />} />
              <Route path="edit/:quizId" element={<QuizForm />} />
              <Route path="results/:quizId" element={<QuizResult showAll />} />
              <Route path=":quizId/plagiarism" element={<PlagiarismCheck />} /> 
            </Route>
            
            {/* Students */}
            <Route path="students">
              <Route index element={<InstructorStudents />} />
              <Route path=":studentId" element={<StudentDetail />} />
            </Route>
            
            {/* Activities */}
            <Route path="activities" element={<InstructorActivities />} />
            
            {/* Messages */}
            <Route path="messages">
              <Route index element={<InstructorMessages />} />
              <Route path=":conversationId" element={<ConversationDetail />} />
            </Route>
            
            {/* Analytics */}
            <Route path="analytics" element={<InstructorAnalytics />} />
            
            {/* Gradebook */}
            <Route path="gradebook">
              <Route index element={<InstructorGradebook />} />
              <Route path="course/:courseId" element={<GradebookView />} />
              <Route path="student/:studentId" element={<StudentGradeView />} />
            </Route>
            
            {/* Settings & Profile */}
            <Route path="settings" element={<InstructorSettings />} />
            <Route path="profile" element={<InstructorProfile />} />
            
            {/* Plagiarism Check (Generic) */}
            <Route path="plagiarism">
              <Route index element={<PlagiarismCheck />} />
              <Route path="report/:reportId" element={<SimilarityReport />} />
            </Route>

          </Route> {/* End of Instructor Routes */}
        </Route> {/* End of Common Protected Routes */}


        {/* =========================================================================
        ADMIN ROUTES 
        ========================================================================== */}
        <Route element={
          <ProtectedRoute 
            isAuthenticated={isAuthenticated}
            allowedRoles={['admin']}
            redirectPath="/unauthorized"
          />
        }>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="instructors" element={<AdminInstructors />} />
            <Route path="courses">
              <Route index element={<CourseManagement />} />
              <Route path=":courseId" element={<CourseDetail />} />
            </Route>
            <Route path="reports" element={<AdminReports />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="users">
              <Route index element={<UsersManagement />} />
              <Route path=":userId" element={<UserDetail />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;