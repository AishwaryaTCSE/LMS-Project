const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message.controller');
const { auth } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

// All routes require authentication
router.use(auth);

// Basic message operations
router.post('/send', upload.array('files', 5), messageCtrl.sendMessage);
router.get('/conversation/:userId', messageCtrl.getConversation);
router.get('/conversations', messageCtrl.getConversations);
router.patch('/read/:messageId', messageCtrl.markAsRead);
router.delete('/:messageId', messageCtrl.deleteMessage);

// AI-powered features
router.post('/smart-reply/:messageId', messageCtrl.generateSmartReply);
router.post('/ai-assist', messageCtrl.sendMessage); // Same endpoint but with aiMode parameter
router.get('/ai-modes', (req, res) => {
  res.json({
    success: true,
    data: {
      modes: {
        TUTOR: 'tutor',
        WRITING_ASSISTANT: 'writing_assistant',
        CODE_HELPER: 'code_helper',
        STUDY_BUDDY: 'study_buddy'
      }
    }
  });
});

// Voice message
router.post('/voice', upload.single('audio'), messageCtrl.uploadVoice);

module.exports = router;