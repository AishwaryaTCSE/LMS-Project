const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth.middleware');
const courseCtrl = require('../controllers/course.controller');
const userCtrl = require('../controllers/user.controller');
const analyticsCtrl = require('../controllers/analytics.controller');

// All instructor routes require authentication and instructor/teacher role
router.use(auth);
router.use(permit('instructor', 'teacher'));

// Courses
router.get('/courses', courseCtrl.getInstructorCourses);
router.post('/courses', courseCtrl.createCourse);
router.put('/courses/:id', courseCtrl.updateCourse);
router.delete('/courses/:id', courseCtrl.deleteCourse);

// Students
router.get('/students', userCtrl.listStudents);
router.post('/students', userCtrl.createStudent);

// Analytics
router.get('/analytics', analyticsCtrl.getInstructorAnalytics);

// Settings
router.put('/settings', userCtrl.updateMySettings);

module.exports = router;

