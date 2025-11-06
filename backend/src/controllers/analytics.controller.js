const Analytics = require('../models/analytics.model');
const { success } = require('../utils/response');

exports.track = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'Key and value are required' });
    }

    const doc = await Analytics.create({ key, value });
    success(res, doc, 201);
  } catch (err) {
    console.error('Analytics track error:', err);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const data = await Analytics.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    success(res, data);
  } catch (err) {
    console.error('Analytics list error:', err);
    next(err);
  }
};
