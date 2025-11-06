const Notification = require('../models/notification.model');

/**
 * Send a notification to a specific user
 * @param {string} userId - ID of the user
 * @param {string} message - Notification message
 * @returns {Promise<Object>} - Saved notification document
 */
const sendNotification = async (userId, message) => {
  try {
    const notification = new Notification({ userId, message });
    return await notification.save();
  } catch (error) {
    console.error('Failed to send notification:', error.message);
    throw new Error('Notification sending failed');
  }
};

/**
 * Get all notifications for a specific user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} - List of notifications sorted by newest first
 */
const getUserNotifications = async (userId) => {
  try {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Failed to fetch notifications:', error.message);
    throw new Error('Failed to retrieve notifications');
  }
};

module.exports = { sendNotification, getUserNotifications };
