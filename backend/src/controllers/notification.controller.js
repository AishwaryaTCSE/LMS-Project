const Notification = require('../models/notification.model');
const { success } = require('../utils/response');

exports.listMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    const unreadCount = notifications.filter(n => !n.isRead).length;
    success(res, { items: notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    success(res, notif);
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    success(res, { message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};


