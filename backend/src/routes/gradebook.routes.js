const express = require('express');
const router = express.Router();
const gradebookCtrl = require('../controllers/gradebook.controller');
const { auth, permit } = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole');

// All routes require authentication
router.use(auth);

// Get student gradebook (student can view own, teachers/admins can view any)
router.get('/course/:courseId/student/:studentId', gradebookCtrl.getStudentGradebook);

// Get all gradebooks for a course (teacher/admin only)
router.get('/course/:courseId', checkRole('teacher', 'instructor', 'admin'), gradebookCtrl.getCourseGradebooks);

// Export gradebook as CSV (teacher/admin only)
router.get('/course/:courseId/export', checkRole('teacher', 'instructor', 'admin'), gradebookCtrl.exportGradebook);

// Get student performance summary across all courses
router.get('/student/:studentId/performance', gradebookCtrl.getStudentPerformance);

module.exports = router;