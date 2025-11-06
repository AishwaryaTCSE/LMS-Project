const express = require('express');
const router = express.Router();
const assessment = require('../controllers/assessment.controller');
const { auth, permit } = require('../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /assessment/assignment - create assignment (instructor/admin only)
router.post(
  '/assignment',
  auth,
  permit('instructor', 'admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('course').notEmpty().withMessage('Course ID is required')
  ],
  validate,
  assessment.createAssignment
);

// GET /assessment/assignment/course/:courseId - list assignments by course
router.get(
  '/assignment/course/:courseId',
  auth,
  assessment.getAssignmentsByCourse
);

// POST /assessment/quiz - create quiz (instructor/admin only)
router.post(
  '/quiz',
  auth,
  permit('instructor', 'admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('course').notEmpty().withMessage('Course ID is required'),
    body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
  ],
  validate,
  assessment.createQuiz
);

module.exports = router;
