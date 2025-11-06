const express = require('express');
const router = express.Router();
const discussion = require('../controllers/discussion.controller');
const { auth } = require('../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /discussion/thread - create a new discussion thread
router.post(
  '/thread',
  auth,
  [
    body('title').notEmpty().withMessage('Thread title is required'),
    body('course').notEmpty().withMessage('Course ID is required'),
    body('message').notEmpty().withMessage('Initial message is required')
  ],
  validate,
  discussion.createThread
);

// POST /discussion/thread/:threadId/post - add a post to an existing thread
router.post(
  '/thread/:threadId/post',
  auth,
  [
    body('message').notEmpty().withMessage('Message is required')
  ],
  validate,
  discussion.addPost
);

module.exports = router;
