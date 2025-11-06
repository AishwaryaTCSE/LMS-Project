const express = require('express');
const router = express.Router();
const analytics = require('../controllers/analytics.controller');
const { auth, permit } = require('../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /analytics/track - track analytics
router.post(
  '/track', 
  auth,
  [
    body('key').notEmpty().withMessage('Key is required'),
    body('value').notEmpty().withMessage('Value is required')
  ],
  validate,
  analytics.track
);

// GET /analytics/ - list last 100 analytics (admin or instructor)
router.get('/', auth, permit('admin', 'instructor'), analytics.list);

module.exports = router;
