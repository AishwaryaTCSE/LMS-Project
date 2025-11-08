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
// Guard route handlers so server doesn't crash if a controller export is missing
const safe = (fn, name) => {
	if (typeof fn === 'function') return fn;
	console.warn(`Missing handler for ${name} — registering fallback to avoid crash.`);
	return (req, res) => res.status(501).json({ success: false, message: `${name} handler not implemented on server` });
};

router.get('/dashboard', safe(dashboardCtrl.getStudentDashboard, 'dashboard.getStudentDashboard'));

// Profile
router.get('/profile', safe(userCtrl.getProfile, 'profile.getProfile'));
router.put('/profile', safe(userCtrl.updateProfile, 'profile.updateProfile'));

// Courses
router.get('/courses', safe(courseCtrl.getStudentCourses, 'courses.getStudentCourses'));
router.get('/courses/:id', safe(courseCtrl.getCourseDetails, 'courses.getCourseDetails'));

// Quizzes
router.get('/quizzes', safe(quizCtrl.getAvailableQuizzes, 'quizzes.getAvailableQuizzes'));
router.get('/quizzes/:id', safe(quizCtrl.getQuiz, 'quizzes.getQuiz'));
router.post('/quizzes/:id/attempt', safe(quizCtrl.attemptQuiz, 'quizzes.attemptQuiz'));
router.get('/quizzes/attempts/:attemptId', safe(quizCtrl.getQuizAttempt, 'quizzes.getQuizAttempt'));

// Submissions
router.post('/submissions', safe(submissionCtrl.submitAssignment, 'submissions.submitAssignment'));
router.get('/submissions', safe(submissionCtrl.getMySubmissions, 'submissions.getMySubmissions'));
router.get('/submissions/:id', safe(submissionCtrl.getSubmission, 'submissions.getSubmission'));

// Discussions
router.get('/discussions', safe(discussionCtrl.getDiscussions, 'discussions.getDiscussions'));
router.get('/discussions/:id', safe(discussionCtrl.getDiscussion, 'discussions.getDiscussion'));
router.post('/discussions', safe(discussionCtrl.createThread, 'discussions.createThread'));
router.post('/discussions/:id/replies', safe(discussionCtrl.addReply, 'discussions.addReply'));

// Messages
router.get('/messages', safe(messageCtrl.getMyMessages, 'messages.getMyMessages'));
router.get('/messages/:id', safe(messageCtrl.getMessage, 'messages.getMessage'));
router.post('/messages', safe(messageCtrl.sendMessage, 'messages.sendMessage'));
router.put('/messages/:id/read', safe(messageCtrl.markAsRead, 'messages.markAsRead'));

// Gradebook
router.get('/grades', safe(userCtrl.getMyGrades, 'grades.getMyGrades'));
router.get('/grades/:courseId', safe(userCtrl.getCourseGrades, 'grades.getCourseGrades'));

// Calendar/Events
router.get('/events', safe(userCtrl.getMyEvents, 'events.getMyEvents'));

module.exports = router;

