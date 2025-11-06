const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { auth, permit } = require('../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

/**
 * GET /users/me
 * Get profile of logged-in user
 */
router.get('/me', auth, userCtrl.getProfile);

/**
 * GET /users
 * Get all users (admin only)
 */
router.get('/', auth, permit('admin'), userCtrl.getAllUsers);

/**
 * GET /users/students
 * List students with search/filter/pagination
 */
router.get('/students', auth, permit('admin', 'teacher', 'instructor'), userCtrl.listStudents);

/**
 * POST /users/students
 * Create a new student
 */
router.post(
  '/students',
  auth,
  permit('admin', 'teacher', 'instructor'),
  [
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 })
  ],
  validate,
  userCtrl.createStudent
);

/**
 * GET /users/students/export
 * Export students as CSV
 */
router.get('/students/export', auth, permit('admin', 'teacher', 'instructor'), userCtrl.exportStudents);

/**
 * PUT /users/me/settings
 * Update current user's settings
 */
router.put('/me/settings', auth, userCtrl.updateMySettings);

module.exports = router;
