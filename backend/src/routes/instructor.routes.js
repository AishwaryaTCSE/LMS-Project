const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth.middleware');
const courseCtrl = require('../controllers/course.controller');
const userCtrl = require('../controllers/user.controller');
const analyticsCtrl = require('../controllers/analytics.controller');

// All instructor routes require authentication
router.use(auth);

// Verify user has instructor/teacher role for all routes
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required',
      error: 'UNAUTHORIZED'
    });
  }
  
  if (!['instructor', 'teacher'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Instructor or teacher role required.',
      error: 'FORBIDDEN'
    });
  }
  
  next();
});

// Courses
router.get('/courses', courseCtrl.getInstructorCourses);
router.post('/courses', courseCtrl.createCourse);
router.put('/courses/:id', courseCtrl.updateCourse);
router.delete('/courses/:id', courseCtrl.deleteCourse);

// Students
router.get('/students', userCtrl.listStudents);
router.post('/students', userCtrl.createStudent);

// Analytics & Stats
router.get('/analytics', analyticsCtrl.getInstructorAnalytics);
router.get('/stats', analyticsCtrl.getInstructorStats);

// Settings
router.put('/settings', userCtrl.updateMySettings);

// Health check endpoint
router.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Instructor API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

