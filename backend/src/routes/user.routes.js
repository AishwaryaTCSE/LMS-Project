const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { auth, permit } = require('../middlewares/auth.middleware');

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

module.exports = router;
