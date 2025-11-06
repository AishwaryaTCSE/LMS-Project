const User = require('../models/user.model');
const { success, error } = require('../utils/response');

exports.getProfile = async (req, res, next) => {
  try {
    const { _id, name, email, role } = req.user;
    success(res, { id: _id, name, email, role });
  } catch (err) {
    console.error('Get Profile Error:', err);
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    success(res, users);
  } catch (err) {
    console.error('Get All Users Error:', err);
    next(err);
  }
};
