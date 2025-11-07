const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message.controller');
const { auth } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

// All routes require authentication
router.use(auth);

// Message routes
router.post('/send', upload.array('files', 5), messageCtrl.sendMessage);
router.get('/conversation/:userId', messageCtrl.getConversation);
router.get('/conversations', messageCtrl.getConversations);
router.patch('/read', messageCtrl.markAsRead);
router.delete('/:id', messageCtrl.deleteMessage);

// AI suggestion
router.post('/suggest', messageCtrl.getSuggestion);

// Voice message
router.post('/voice', upload.single('audio'), messageCtrl.uploadVoice);

module.exports = router;