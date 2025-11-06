const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { body, validationResult } = require('express-validator');

// Custom validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    // First Name validation
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name contains invalid characters'),
    
    // Last Name validation
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters')
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name contains invalid characters'),
    
    // Email validation
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    // Phone validation (optional)
    body('phone')
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[0-9\-\+\(\)\s]{10,20}$/).withMessage('Please provide a valid phone number')
      .isMobilePhone().withMessage('Please provide a valid phone number'),
    
    // Date of Birth validation (optional)
    body('dateOfBirth')
      .optional({ checkFalsy: true })
      .isISO8601().withMessage('Please provide a valid date of birth')
      .toDate(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
    body('role')
      .optional()
      .isIn(['student', 'teacher', 'admin']).withMessage('Invalid role')
  ],
  validate,
  authCtrl.register
);

/**
 * POST /auth/login
 * Login a user
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authCtrl.login
);

module.exports = router;
