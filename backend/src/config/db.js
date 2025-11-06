// config/db.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async (mongoUri) => {
  if (!mongoUri) throw new Error('Missing MONGO_URI');
  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');

    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
  } catch (err) {
    logger.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
