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

// GET /assessment/assignment/all - get all assignments with filters
router.get('/assignment/all', auth, assessment.getAllAssignments);

// GET /assessment/assignment/:id - get assignment by ID
router.get('/assignment/:id', auth, assessment.getAssignmentById);

// PUT /assessment/assignment/:id - update assignment
router.put('/assignment/:id', auth, permit('instructor', 'admin'), assessment.updateAssignment);

// DELETE /assessment/assignment/:id - delete assignment
router.delete('/assignment/:id', auth, permit('instructor', 'admin'), assessment.deleteAssignment);

// GET /assessment/assignment/export/all - export assignments
router.get('/assignment/export/all', auth, permit('instructor', 'admin'), assessment.exportAssignments);

module.exports = router;
