const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/notification.controller');

// All routes require auth
router.use(auth);

// GET /notifications - list current user's notifications
router.get('/', ctrl.listMyNotifications);

// PATCH /notifications/:id/read - mark single notification as read
router.patch('/:id/read', ctrl.markAsRead);

// PATCH /notifications/read-all - mark all as read
router.patch('/read-all', ctrl.markAllAsRead);

module.exports = router;


