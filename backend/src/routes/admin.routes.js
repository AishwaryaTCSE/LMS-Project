const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth, permit } = require('../middlewares/auth.middleware');
const userCtrl = require('../controllers/user.controller');
const dashboardCtrl = require('../controllers/dashboard.controller');
const analyticsCtrl = require('../controllers/analytics.controller');

// All admin routes require authentication and admin role
router.use(auth);
router.use(permit('admin'));

// Dashboard & Analytics
router.get('/dashboard', dashboardCtrl.getAdminDashboard);
router.get('/analytics', analyticsCtrl.getAdminAnalytics);
router.get('/activities', dashboardCtrl.getAdminActivities);

// User Management
router.get(
  '/users',
  [
    check('page', 'Page must be a positive integer').optional().isInt({ min: 1 }).toInt(),
    check('limit', 'Limit must be a positive integer').optional().isInt({ min: 1 }).toInt(),
    check('role', 'Invalid role').optional().isIn(['student', 'instructor', 'admin']),
    check('status', 'Invalid status').optional().isIn(['active', 'inactive']),
    check('sortBy', 'Invalid sort field').optional().isIn(['firstName', 'lastName', 'email', 'role', 'createdAt', 'lastLogin']),
    check('sortOrder', 'Invalid sort order').optional().isIn(['asc', 'desc']),
    check('startDate', 'Invalid start date').optional().isISO8601(),
    check('endDate', 'Invalid end date').optional().isISO8601()
  ],
  userCtrl.getAllUsersWithFilters
);

// Single User Operations
router.get(
  '/users/:id',
  [check('id', 'Invalid user ID').isMongoId()],
  userCtrl.getUserById
);

router.put(
  '/users/:id',
  [
    check('id', 'Invalid user ID').isMongoId(),
    check('firstName', 'First name is required').optional().trim().notEmpty(),
    check('lastName', 'Last name is required').optional().trim().notEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('phone', 'Please provide a valid phone number').optional().isMobilePhone(),
    check('role', 'Invalid role').optional().isIn(['student', 'instructor', 'admin']),
    check('isActive', 'Invalid status').optional().isBoolean()
  ],
  userCtrl.updateUser
);

router.delete(
  '/users/:id',
  [check('id', 'Invalid user ID').isMongoId()],
  userCtrl.deleteUser
);

// Bulk Operations
router.post(
  '/users/bulk/update',
  [
    check('userIds', 'User IDs are required').isArray({ min: 1 }),
    check('userIds.*', 'Invalid user ID').isMongoId(),
    check('updateData.role', 'Invalid role').optional().isIn(['student', 'instructor', 'admin']),
    check('updateData.status', 'Invalid status').optional().isIn(['active', 'inactive'])
  ],
  userCtrl.bulkUpdateUsers
);

router.post(
  '/users/bulk/delete',
  [
    check('userIds', 'User IDs are required').isArray({ min: 1 }),
    check('userIds.*', 'Invalid user ID').isMongoId()
  ],
  userCtrl.bulkDeleteUsers
);

// Export & Reports
router.get(
  '/users/export',
  [
    check('format', 'Invalid export format').optional().isIn(['csv', 'excel']),
    check('role', 'Invalid role').optional().isIn(['student', 'instructor', 'admin']),
    check('status', 'Invalid status').optional().isIn(['active', 'inactive']),
    check('startDate', 'Invalid start date').optional().isISO8601(),
    check('endDate', 'Invalid end date').optional().isISO8601()
  ],
  userCtrl.exportUsers
);

// Statistics
router.get(
  '/stats/users',
  userCtrl.getUserStats
);

// Reports
router.get(
  '/reports',
  [
    check('type', 'Report type is required').isIn(['users', 'activities', 'enrollments']),
    check('startDate', 'Start date is required').isISO8601(),
    check('endDate', 'End date is required').isISO8601()
  ],
  analyticsCtrl.generateReport
);

module.exports = router;

