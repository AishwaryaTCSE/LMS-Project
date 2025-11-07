// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');
const { rateLimiter, authLimiter } = require('./middlewares/rateLimiter');
const analyticsJob = require('./jobs/analytics.job');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const discussionRoutes = require('./routes/discussion.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Role-specific routes
const adminRoutes = require('./routes/admin.routes');
const instructorRoutes = require('./routes/instructor.routes');
const studentRoutes = require('./routes/student.routes');

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

// ---------- Initialize Services ----------
const startServices = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    
    // Start analytics job in non-test environment
    if (process.env.NODE_ENV !== 'test') {
      analyticsJob.start();
    }
    
    logger.info('Services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

// Start all services
startServices();

// ---------- Rate Limiting ----------
// Apply rate limiting
app.use('/api/', rateLimiter);
app.use('/api/auth/', authLimiter);

// ---------- API Routes ----------

// Public routes
app.use('/api/v1/auth', authRoutes);

// Legacy routes (for backward compatibility) - mount these first
app.use('/api/v1/users', auth, userRoutes);
app.use('/api/v1/assessments', auth, assessmentRoutes);
app.use('/api/v1/discussions', auth, discussionRoutes);
app.use('/api/v1/analytics', auth, analyticsRoutes);
app.use('/api/v1/notifications', auth, notificationRoutes);
app.use('/api/v1/reports', auth, reportRoutes);
app.use('/api/v1/dashboard', auth, dashboardRoutes);

// Role-specific routes (NEW STRUCTURE) - mount these after legacy routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/instructor', instructorRoutes);
app.use('/api/v1/student', studentRoutes);

// Mount the courses route last to prevent conflicts
app.use('/api/v1/courses', auth, courseRoutes);

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
