const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth.middleware');
const dashboardCtrl = require('../controllers/dashboard.controller');
const courseCtrl = require('../controllers/course.controller');
const userCtrl = require('../controllers/user.controller');
const quizCtrl = require('../controllers/quiz.controller');
const submissionCtrl = require('../controllers/submission.controller');
const discussionCtrl = require('../controllers/discussion.controller');
const messageCtrl = require('../controllers/message.controller');

// All student routes require authentication and student role
router.use(auth);
router.use(permit('student'));

// Dashboard
router.get('/dashboard', dashboardCtrl.getStudentDashboard);

// Profile
router.get('/profile', userCtrl.getProfile);
router.put('/profile', userCtrl.updateProfile);

// Courses
router.get('/courses', courseCtrl.getStudentCourses);
router.get('/courses/:id', courseCtrl.getCourseDetails);

// Quizzes
router.get('/quizzes', quizCtrl.getAvailableQuizzes);
router.get('/quizzes/:id', quizCtrl.getQuiz);
router.post('/quizzes/:id/attempt', quizCtrl.attemptQuiz);
router.get('/quizzes/attempts/:attemptId', quizCtrl.getQuizAttempt);

// Submissions
router.post('/submissions', submissionCtrl.submitAssignment);
router.get('/submissions', submissionCtrl.getMySubmissions);
router.get('/submissions/:id', submissionCtrl.getSubmission);

// Discussions
router.get('/discussions', discussionCtrl.getDiscussions);
router.get('/discussions/:id', discussionCtrl.getDiscussion);
router.post('/discussions', discussionCtrl.createThread);
router.post('/discussions/:id/replies', discussionCtrl.addReply);

// Messages
router.get('/messages', messageCtrl.getMyMessages);
router.get('/messages/:id', messageCtrl.getMessage);
router.post('/messages', messageCtrl.sendMessage);
router.put('/messages/:id/read', messageCtrl.markAsRead);

// Gradebook
router.get('/grades', userCtrl.getMyGrades);
router.get('/grades/:courseId', userCtrl.getCourseGrades);

// Calendar/Events
router.get('/events', userCtrl.getMyEvents);

module.exports = router;

