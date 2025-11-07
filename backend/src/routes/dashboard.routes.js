const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboard.controller');
const { auth } = require('../middlewares/auth.middleware');

/**
 * GET /dashboard/student
 * Get student dashboard data
 */
router.get('/student', auth, dashboardCtrl.getStudentDashboard);

/**
 * GET /dashboard/admin
 * Get admin dashboard data
 */
router.get('/admin', auth, dashboardCtrl.getAdminDashboard);

module.exports = router;

