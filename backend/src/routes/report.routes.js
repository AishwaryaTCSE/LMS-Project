const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const { generateReport } = require('../services/analytics.service');

const router = express.Router();

// GET /analytics - generate analytics report (Admin only)
router.get(
  '/analytics',
  auth, // ensure user is authenticated
  authorizeRoles('admin'), // only admin can access
  async (req, res, next) => {
    try {
      const data = await generateReport();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error); // pass to global error handler
    }
  }
);

module.exports = router;
