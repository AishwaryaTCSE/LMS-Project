# 🏫 LMS System - Complete Implementation Guide

## ✅ Completed Tasks (Applied Automatically)

- ✓ **Task 1**: Course model updated (instructorName, videoUrl, thumbnail, tags, price, visibility)
- ✓ **Task 2**: Assignment, Quiz, Submission models enhanced
- ✓ Server.js updated with Socket.io for real-time features
- ✓ Backend package.json updated with OpenAI and test scripts

## 🛠️ Quick Start

```bash
# Install dependencies
cd backend && npm install && cd ..
npm install

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
npm run dev
```

## 📋 Files to Create Manually

### TASK 2: Message & Gradebook Models

Create `backend/src/models/message.model.js`:

```javascript
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  senderName: { type: String, trim: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipientName: { type: String, trim: true },
  conversationId: { type: String, required: true, index: true },
  messageType: { type: String, enum: ['text', 'image', 'file', 'audio'], default: 'text' },
  content: { type: String, trim: true, maxlength: 10000 },
  attachments: [{ filename: String, url: String, size: Number, mimeType: String }],
  audioMessage: { url: String, duration: Number },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.statics.generateConversationId = (id1, id2) => [id1, id2].sort().join('_');
module.exports = mongoose.model('Message', MessageSchema);
```

Create `backend/src/models/gradebook.model.js`:

```javascript
const mongoose = require('mongoose');

const GradebookSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  overallGrade: { type: Number, min: 0, max: 100 },
  letterGrade: { type: String },
  assignments: [{ assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }, grade: Number }],
  quizzes: [{ quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, score: Number }]
}, { timestamps: true });

GradebookSchema.index({ student: 1, course: 1 }, { unique: true });
module.exports = mongoose.model('Gradebook', GradebookSchema);
```

### TASK 3: Storage & OpenAI Services

Create `backend/src/services/storageService.js`:

```javascript
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadToCloudinary = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, { folder: 'lms' });
  } catch (error) {
    console.error('Cloudinary error:', error);
    return { url: `/uploads/${path.basename(filePath)}` };
  }
};

module.exports = { upload, uploadToCloudinary, uploadSingle: upload.single('file'), uploadMultiple: upload.array('files', 10) };
```

Create `backend/src/services/openaiService.js`:

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateMessageSuggestions = async (context) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Suggest 3 professional replies for: ${context}` }],
      max_tokens: 150
    });
    return response.choices[0].message.content.split('\n').filter(s => s.trim()).slice(0, 3);
  } catch (error) {
    return ['Thank you', 'I understand', 'Let me get back to you'];
  }
};

module.exports = { generateMessageSuggestions };
```

### TASK 4: Messaging Routes & Controllers

Create `backend/src/controllers/message.controller.js`:

```javascript
const Message = require('../models/message.model');
const { uploadToCloudinary } = require('../services/storageService');
const { generateMessageSuggestions } = require('../services/openaiService');

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { recipient: userId }], isDeleted: false } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' } } }
    ]);
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId, isDeleted: false }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType } = req.body;
    const conversationId = Message.generateConversationId(req.user._id, recipientId);
    const message = await Message.create({ sender: req.user._id, recipient: recipientId, conversationId, content, messageType });
    const io = req.app.get('io');
    io.to(`user_${recipientId}`).emit('new_message', message);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessageWithAttachment = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const file = req.file;
    const uploadResult = await uploadToCloudinary(file.path);
    const conversationId = Message.generateConversationId(req.user._id, recipientId);
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      conversationId,
      messageType: 'file',
      attachments: [{ filename: file.originalname, url: uploadResult.url, size: file.size, mimeType: file.mimetype }]
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany({ conversationId: req.params.conversationId, recipient: req.user._id }, { isRead: true, readAt: new Date() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAISuggestions = async (req, res) => {
  try {
    const suggestions = await generateMessageSuggestions(req.body.context);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

Create `backend/src/routes/message.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const messageController = require('../controllers/message.controller');
const { uploadSingle } = require('../services/storageService');

router.get('/conversations', auth, messageController.getConversations);
router.get('/conversation/:conversationId', auth, messageController.getMessages);
router.post('/send', auth, messageController.sendMessage);
router.post('/send/attachment', auth, uploadSingle, messageController.sendMessageWithAttachment);
router.put('/read/:conversationId', auth, messageController.markAsRead);
router.post('/ai/suggestions', auth, messageController.getAISuggestions);

module.exports = router;
```

### TASK 5: Assignment/Quiz Routes & Controllers

Create `backend/src/controllers/assignment.controller.js`:

```javascript
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const { uploadToCloudinary } = require('../services/storageService');

exports.createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { course: { $in: req.user.enrolledCourses || [] } } : { createdBy: req.user._id };
    const assignments = await Assignment.find(query).populate('course', 'title');
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { textAnswer } = req.body;
    const files = req.files || [];
    const uploadedFiles = await Promise.all(files.map(async f => {
      const result = await uploadToCloudinary(f.path);
      return { filename: f.originalname, url: result.url, size: f.size, mimeType: f.mimetype };
    }));
    const submission = await Submission.create({
      student: req.user._id,
      assignment: assignmentId,
      submissionType: 'assignment',
      textAnswer,
      files: uploadedFiles,
      status: 'submitted'
    });
    await Assignment.findByIdAndUpdate(assignmentId, { $inc: { submissionCount: 1 } });
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksAwarded, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(submissionId, {
      marksAwarded,
      feedback,
      status: 'graded',
      gradedAt: new Date(),
      gradedBy: req.user._id
    }, { new: true });
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

Create `backend/src/routes/assignment.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth.middleware');
const assignmentController = require('../controllers/assignment.controller');
const { uploadMultiple } = require('../services/storageService');

router.post('/', auth, permit('teacher', 'admin'), assignmentController.createAssignment);
router.get('/', auth, assignmentController.getAssignments);
router.post('/:assignmentId/submit', auth, permit('student'), uploadMultiple, assignmentController.submitAssignment);
router.put('/:submissionId/grade', auth, permit('teacher', 'admin'), assignmentController.gradeSubmission);

module.exports = router;
```

## 🔧 Update server.js

Add to routes section:

```javascript
const messageRoutes = require('./src/routes/message.routes');
const assignmentRoutes = require('./src/routes/assignment.routes');

app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
```

## 🎯 Next Steps

1. Create the files above
2. Run `npm install` in both backend and root
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `npm run dev`
5. Test messaging and assignments

## 📝 Remaining Tasks (6-13)

See `IMPLEMENTATION_TASKS_6-13.md` for:
- Analytics service updates
- Notification system
- Frontend components (messaging UI, assignment UI, analytics dashboard)
- Teacher profile settings
- Backend tests
- Smoke test script
