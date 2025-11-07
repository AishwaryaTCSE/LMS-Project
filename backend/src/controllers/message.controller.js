const Message = require('../models/message.model');
const User = require('../models/user.model');
const notificationService = require('../services/notification.service');
const storageService = require('../services/storage.service');
const openaiService = require('../services/openai.service');

/**
 * Send a new message
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { to, content, type = 'text', threadId } = req.body;
    const from = req.user._id;
    
    if (!to || (!content && req.files?.length === 0)) {
      return res.status(400).json({ success: false, message: 'Recipient and content/attachment required' });
    }
    
    const messageData = {
      from,
      to,
      type,
      content,
      threadId: threadId || `${from}_${to}`,
      attachments: []
    };
    
    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => storageService.uploadFile(file, { folder: 'messages' }));
      const uploads = await Promise.all(uploadPromises);
      messageData.attachments = uploads.map(u => ({
        filename: u.filename,
        url: u.url,
        size: u.size,
        mimeType: req.files.find(f => f.originalname === u.filename)?.mimetype
      }));
    }
    
    const message = await Message.create(messageData);
    await message.populate('from to', 'firstName lastName avatar');
    
    // Send real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${to}`).emit('message:received', message);
      io.to(`conversation_${messageData.threadId}`).emit('new_message', message);
    }
    
    // Create notification
    const sender = await User.findById(from);
    await notificationService.notifyMessageReceived(to, sender.fullName, io);
    
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    next(error);
  }
};

/**
 * Get conversation between two users
 */
exports.getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    })
      .populate('from to', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Message.countDocuments({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    });
    
    res.json({
      success: true,
      data: messages.reverse(),
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    next(error);
  }
};

/**
 * Get user's conversations list
 */
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get unique conversation partners
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from', userId] },
              '$to',
              '$from'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$to', userId] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'partner'
        }
      },
      {
        $unwind: '$partner'
      },
      {
        $project: {
          partnerId: '$_id',
          partnerName: { $concat: ['$partner.firstName', ' ', '$partner.lastName'] },
          partnerAvatar: '$partner.avatar',
          lastMessage: '$lastMessage.content',
          lastMessageTime: '$lastMessage.createdAt',
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);
    
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get conversations error:', error);
    next(error);
  }
};

/**
 * Mark messages as read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { messageIds } = req.body;
    const userId = req.user._id;
    
    await Message.updateMany(
      { _id: { $in: messageIds }, to: userId },
      { read: true, readAt: new Date() }
    );
    
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    next(error);
  }
};

/**
 * Delete message
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const message = await Message.findOne({ _id: id, from: userId });
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    // Delete attachments if any
    if (message.attachments && message.attachments.length > 0) {
      const deletePromises = message.attachments.map(att => storageService.deleteFile(att.url));
      await Promise.all(deletePromises);
    }
    
    await Message.findByIdAndDelete(id);
    
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    next(error);
  }
};

/**
 * Get AI suggestion for reply (OpenAI)
 */
exports.getSuggestion = async (req, res, next) => {
  try {
    const { conversation } = req.body;
    
    if (!conversation || conversation.length === 0) {
      return res.status(400).json({ success: false, message: 'Conversation history required' });
    }
    
    const result = await openaiService.getAssistantSuggestion(conversation);
    
    res.json({ success: result.success, data: result });
  } catch (error) {
    console.error('Get suggestion error:', error);
    next(error);
  }
};

/**
 * Upload voice message
 */
exports.uploadVoice = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Audio file required' });
    }
    
    const result = await storageService.uploadFile(req.file, { folder: 'voice-messages', resourceType: 'audio' });
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Upload voice error:', error);
    next(error);
  }
};