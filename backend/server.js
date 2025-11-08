
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Import routes
const courseRoutes = require('./src/routes/course.routes');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const adminRoutes = require('./src/routes/admin.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const messageRoutes = require('./src/routes/message.routes');
const assignmentRoutes = require('./src/routes/assignments.router');
const quizRoutes = require('./src/routes/quiz.routes');
const gradebookRoutes = require('./src/routes/gradebook.routes');
const studentRoutes = require('./src/routes/student.routes');
// === FIX: Import the instructor routes file ===
const instructorRoutes = require('./src/routes/instructor.routes');
// =============================================

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms_project")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Handle new message
  socket.on('send_message', (data) => {
    io.to(`conversation_${data.conversationId}`).emit('new_message', data);
    // Notify recipient
    if (data.recipientId) {
      io.to(`user_${data.recipientId}`).emit('notification', {
        type: 'message',
        message: 'New message received',
        data
      });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/gradebook', gradebookRoutes);
// Mount student routes so student-specific endpoints (e.g., /api/v1/student/quizzes) are available
app.use('/api/v1/student', studentRoutes);

// === FIX: Mount the instructor routes at the correct base path ===
app.use('/api/v1/instructor', instructorRoutes);
// =================================================================

// Basic route
app.get("/", (req, res) => {
  res.send("🚀 LMS Backend is running successfully!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Socket.io server ready`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});