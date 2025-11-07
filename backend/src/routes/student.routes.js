const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth.middleware');
const dashboardCtrl = require('../controllers/dashboard.controller');
const courseCtrl = require('../controllers/course.controller');
const userCtrl = require('../controllers/user.controller');

// All student routes require authentication and student role
router.use(auth);
router.use(permit('student'));

// Dashboard
router.get('/dashboard', dashboardCtrl.getStudentDashboard);

// Profile
router.get('/profile', userCtrl.getProfile);
router.put('/profile', userCtrl.updateMySettings);

// Courses
router.get('/courses', courseCtrl.getStudentCourses);

module.exports = router;

