// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const discussionRoutes = require('./routes/discussion.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');

// Middlewares
const errorMiddleware = require('./middlewares/error.middleware');
const { auth } = require('./middlewares/auth.middleware');

dotenv.config();
const app = express();

// ---------- Connect to MongoDB ----------
connectDB(process.env.MONGO_URI).catch(err => {
  logger.error('MongoDB connection failed:', err);
  process.exit(1);
});

// ---------- Security & Global Middlewares ----------
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: process.env.FRONTEND_URL || '*' })); // Restrict in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Dev logging

// ---------- Rate Limiting ----------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests per window per IP
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// ---------- API Routes ----------

// Public routes
app.use('/api/v1/auth', authRoutes);

// Protected routes (require auth)
app.use('/api/v1/users', auth, userRoutes);
app.use('/api/v1/courses', auth, courseRoutes);
app.use('/api/v1/assessments', auth, assessmentRoutes);
app.use('/api/v1/discussions', auth, discussionRoutes);
app.use('/api/v1/analytics', auth, analyticsRoutes);
app.use('/api/v1/notifications', auth, notificationRoutes);
app.use('/api/v1/reports', auth, reportRoutes);

// ---------- Health Check ----------
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: '📘 LMS Backend Running Successfully 🚀',
  });
});

// ---------- Error Handler ----------
app.use(errorMiddleware);

module.exports = app;
