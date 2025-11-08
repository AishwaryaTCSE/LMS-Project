const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth.middleware');
const courseCtrl = require('../controllers/course.controller');
const userCtrl = require('../controllers/user.controller');
const analyticsCtrl = require('../controllers/analytics.controller');
const assignmentCtrl = require('../controllers/assignments.controller');
const quizCtrl = require('../controllers/quiz.controller');
const submissionCtrl = require('../controllers/submission.controller');
const discussionCtrl = require('../controllers/discussion.controller');
const upload = require('../middlewares/upload.middleware');

// Role-based access control for instructor routes
const requireInstructor = [auth, permit('instructor', 'teacher')];

// ======================
// Dashboard Routes
// ======================
router.get('/dashboard/overview', requireInstructor, analyticsCtrl.getInstructorAnalytics);
router.get('/dashboard/stats', requireInstructor, analyticsCtrl.getInstructorStats);
router.get('/dashboard/activities', requireInstructor, analyticsCtrl.list);

// ======================
// Course Management Routes
// ======================
router.route('/courses')
  .get(courseCtrl.getInstructorCourses)
  .post(upload.single('thumbnail'), courseCtrl.createCourse);

router.route('/courses/:id')
  .get(courseCtrl.getCourse)
  .put(upload.single('thumbnail'), courseCtrl.updateCourse)
  .delete(courseCtrl.deleteCourse);

// Course students
router.get('/courses/:courseId/students', courseCtrl.getCourseStudents);
router.post('/courses/:courseId/enroll', courseCtrl.enrollStudents);

// ======================
// Assessment Routes
// ======================
router.route('/assignments')
  .get(assignmentCtrl.getAssignments)
  .post(upload.array('attachments', 5), assignmentCtrl.createAssignment);

router.route('/assignments/:id')
  .get(assignmentCtrl.getAssignment)
  .put(upload.array('attachments', 5), assignmentCtrl.updateAssignment)
  .delete(assignmentCtrl.deleteAssignment);

// ======================
// Quiz Routes
// ======================
router.route('/quizzes')
  .get(requireInstructor, quizCtrl.getQuizzes)
  .post(requireInstructor, quizCtrl.createQuiz);

router.route('/quizzes/:id')
  .get(requireInstructor, quizCtrl.getQuiz)
  .put(requireInstructor, quizCtrl.updateQuiz)
  .delete(requireInstructor, quizCtrl.deleteQuiz);

// ======================
// Submission Routes
// ======================
router.get('/submissions', requireInstructor, submissionCtrl.getSubmissions);
router.get('/submissions/:id', requireInstructor, submissionCtrl.getSubmission);
router.post('/submissions', requireInstructor, upload.array('files', 5), submissionCtrl.createSubmission);
router.put('/submissions/:id/grade', requireInstructor, submissionCtrl.gradeSubmission);
router.post('/submissions/check-plagiarism', requireInstructor, submissionCtrl.checkPlagiarism);

// ======================
// Discussion Routes
// ======================
router.get('/discussions', discussionCtrl.getDiscussions);
router.post('/discussions', discussionCtrl.createThread);
router.get('/discussions/:id', discussionCtrl.getDiscussion);
router.post('/discussions/:id/reply', discussionCtrl.addReply);

// ======================
// Gradebook Routes
// ======================
router.get('/gradebook', (req, res) => analyticsCtrl.getGradebook(req, res));
router.get('/courses/:courseId/grades', (req, res) => analyticsCtrl.getCourseGrades(req, res));

// ======================
// User & Profile
// ======================
router.get('/profile', userCtrl.getProfile);
router.put('/profile', userCtrl.updateProfile);
router.put('/settings', userCtrl.updateSettings);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Instructor API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;