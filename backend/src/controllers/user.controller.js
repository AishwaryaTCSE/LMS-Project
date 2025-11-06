const User = require('../models/user.model');
const { success, error } = require('../utils/response');
const { Parser } = require('json2csv');

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

exports.listStudents = async (req, res, next) => {
  try {
    const { q = '', status = 'all', page = 1, limit = 20 } = req.query;
    const filter = { role: 'student' };
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    if (status !== 'all') {
      filter.isActive = status === 'active';
    }
    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    success(res, { items: students, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    console.error('List Students Error:', err);
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already exists' });
    const student = await User.create({ firstName, lastName, email, password, role: 'student' });
    success(res, student, 201);
  } catch (err) {
    console.error('Create Student Error:', err);
    next(err);
  }
};

exports.exportStudents = async (req, res, next) => {
  try {
    const { q = '', status = 'all' } = req.query;
    const filter = { role: 'student' };
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    if (status !== 'all') filter.isActive = status === 'active';
    const students = await User.find(filter).lean();
    const fields = ['firstName', 'lastName', 'email', 'isActive', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(students);
    res.header('Content-Type', 'text/csv');
    res.attachment(`students_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error('Export Students Error:', err);
    next(err);
  }
};

exports.updateMySettings = async (req, res, next) => {
  try {
    const { settings = {} } = req.body;
    const update = {};
    if (settings.timezone) update['settings.timezone'] = settings.timezone;
    if (settings.language) update['settings.language'] = settings.language;
    if (settings.notificationPrefs) {
      Object.keys(settings.notificationPrefs).forEach((k) => {
        update[`settings.notificationPrefs.${k}`] = settings.notificationPrefs[k];
      });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true }).select('-password');
    success(res, user);
  } catch (err) {
    console.error('Update My Settings Error:', err);
    next(err);
  }
};
