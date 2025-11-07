const Notification = require('../models/notification.model');

/**
 * Send a notification to a specific user with Socket.io real-time update
 */
const sendNotification = async (userId, message, type = 'info', data = {}, io = null) => {
  try {
    const notification = await Notification.create({
      userId,
      message,
      type,
      data,
      read: false
    });
    
    // Send real-time notification via Socket.io
    if (io) {
      io.to(`user_${userId}`).emit('notification', {
        id: notification._id,
        message: notification.message,
        type: notification.type,
        data: notification.data,
        createdAt: notification.createdAt
      });
    }
    
    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error.message);
    throw new Error('Notification sending failed');
  }
};

/**
 * Send notification to multiple users
 */
const sendBulkNotifications = async (userIds, message, type = 'info', data = {}, io = null) => {
  try {
    const notifications = await Notification.insertMany(
      userIds.map(userId => ({ userId, message, type, data, read: false }))
    );
    
    // Send real-time notifications
    if (io) {
      userIds.forEach(userId => {
        io.to(`user_${userId}`).emit('notification', {
          message,
          type,
          data,
          createdAt: new Date()
        });
      });
    }
    
    return notifications;
  } catch (error) {
    console.error('Failed to send bulk notifications:', error.message);
    throw error;
  }
};

/**
 * Get all notifications for a specific user
 */
const getUserNotifications = async (userId, limit = 50) => {
  try {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Failed to fetch notifications:', error.message);
    throw new Error('Failed to retrieve notifications');
  }
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (userId) => {
  try {
    return await Notification.countDocuments({ userId, read: false });
  } catch (error) {
    console.error('Failed to get unread count:', error.message);
    return 0;
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { read: true, readAt: new Date() },
      { new: true }
    );
  } catch (error) {
    console.error('Failed to mark notification as read:', error.message);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
  try {
    return await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );
  } catch (error) {
    console.error('Failed to mark all as read:', error.message);
    throw error;
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (notificationId) => {
  try {
    return await Notification.findByIdAndDelete(notificationId);
  } catch (error) {
    console.error('Failed to delete notification:', error.message);
    throw error;
  }
};

/**
 * Notification type helpers
 */
const notifyAssignmentPosted = async (studentIds, assignmentTitle, courseTitle, io) => {
  return sendBulkNotifications(
    studentIds,
    `New assignment "${assignmentTitle}" posted in ${courseTitle}`,
    'assignment',
    { assignmentTitle, courseTitle },
    io
  );
};

const notifyGradePublished = async (studentId, assignmentTitle, grade, io) => {
  return sendNotification(
    studentId,
    `Your assignment "${assignmentTitle}" has been graded: ${grade}`,
    'grade',
    { assignmentTitle, grade },
    io
  );
};

const notifyMessageReceived = async (recipientId, senderName, io) => {
  return sendNotification(
    recipientId,
    `New message from ${senderName}`,
    'message',
    { senderName },
    io
  );
};

const notifyAdminAnnouncement = async (userIds, announcement, io) => {
  return sendBulkNotifications(
    userIds,
    announcement,
    'announcement',
    {},
    io
  );
};

module.exports = {
  sendNotification,
  sendBulkNotifications,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notifyAssignmentPosted,
  notifyGradePublished,
  notifyMessageReceived,
  notifyAdminAnnouncement
};
