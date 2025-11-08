const Message = require('../models/message.model');
const User = require('../models/user.model');
const openaiService = require('../services/openai.service');
const notificationService = require('../services/notification.service');
const storageService = require('../services/storage.service');

const MESSAGE_TYPES = {
  TEXT: 'text',
  AI_SUGGESTION: 'ai_suggestion',
  AI_RESPONSE: 'ai_response',
  SMART_REPLY: 'smart_reply',
  FILE: 'file'
};

const AI_MODES = {
  TUTOR: 'tutor',
  WRITING_ASSISTANT: 'writing_assistant',
  CODE_HELPER: 'code_helper',
  STUDY_BUDDY: 'study_buddy'
};

// AI context prompts for different modes
const AI_PROMPTS = {
  [AI_MODES.TUTOR]: `You are an expert tutor. Help explain concepts clearly and provide examples.
                     When appropriate, break down complex topics into simpler steps.
                     Focus on understanding rather than just giving answers.`,
  
  [AI_MODES.WRITING_ASSISTANT]: `You are a writing assistant. Help improve writing clarity,
                                suggest better phrasing, and correct grammar/style issues.
                                Explain your suggestions to help users learn.`,
  
  [AI_MODES.CODE_HELPER]: `You are a coding assistant. Help debug code, suggest improvements,
                          and explain programming concepts. Provide code examples when helpful.
                          Focus on best practices and clear explanations.`,
  
  [AI_MODES.STUDY_BUDDY]: `You are a study partner. Help with learning strategies,
                          ask questions to check understanding, and provide encouragement.
                          Make learning engaging and interactive.`
};

/**
 * Send a new message with AI capabilities
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { to, content, type = MESSAGE_TYPES.TEXT, aiMode, threadId } = req.body;
    const from = req.user._id;
    
    if (!to || (!content && req.files?.length === 0)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Recipient and content/attachment required' 
      });
    }

    // Check content moderation if it's a text message
    if (type === MESSAGE_TYPES.TEXT && openaiService.OPENAI_ENABLED) {
      const moderationResult = await openaiService.moderateContent(content);
      if (moderationResult.flagged) {
        return res.status(400).json({
          success: false,
          message: 'Message contains inappropriate content'
        });
      }
    }
    
    const messageData = {
      from,
      to,
      type,
      content,
      threadId: threadId || `${from}_${to}`,
      attachments: [],
      aiMode
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

    // Generate AI response if mode is specified
    if (aiMode && openaiService.OPENAI_ENABLED) {
      // Get conversation history for context
      const history = await Message.find({ threadId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('content type aiMode')
        .lean();

      const prompt = `${AI_PROMPTS[aiMode]}\n\nUser message: ${content}\n\nProvide a helpful response as ${aiMode}.`;
      
      const aiResponse = await openaiService.generateText({
        messages: [
          { role: 'system', content: AI_PROMPTS[aiMode] },
          ...history.reverse().map(msg => ({
            role: msg.type === MESSAGE_TYPES.AI_RESPONSE ? 'assistant' : 'user',
            content: msg.content
          })),
          { role: 'user', content }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      if (aiResponse) {
        const aiMessage = await Message.create({
          from: 'AI_ASSISTANT',
          to: from,
          type: MESSAGE_TYPES.AI_RESPONSE,
          content: aiResponse,
          threadId: messageData.threadId,
          aiMode
        });

        if (io) {
          io.to(`user_${from}`).emit('message:received', aiMessage);
          io.to(`conversation_${messageData.threadId}`).emit('new_message', aiMessage);
        }
      }
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
exports.generateSmartReply = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId)
      .populate('from', 'firstName lastName role')
      .populate('to', 'firstName lastName role');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (!openaiService.OPENAI_ENABLED) {
      return res.status(503).json({
        success: false,
        message: 'AI services are not available'
      });
    }

    const suggestions = await openaiService.generateText({
      messages: [
        {
          role: 'system',
          content: 'Generate 3 concise, context-appropriate smart reply suggestions for the following message. ' +
                   'Each reply should be different in tone (professional, friendly, and neutral). ' +
                   'Keep replies under 100 characters each.'
        },
        {
          role: 'user',
          content: message.content
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    // Parse the suggestions into an array
    const replies = suggestions.split('\n')
      .filter(s => s.trim())
      .map(s => s.replace(/^[0-9]+\.\s*/, '').trim())
      .filter(s => s.length > 0 && s.length <= 100);

    res.json({
      success: true,
      data: replies
    });

  } catch (error) {
    next(error);
  }
};

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

// Backwards-compatible handlers expected by student routes
exports.getMyMessages = async (req, res, next) => {
  try {
    // Reuse getConversations logic to return conversation list for the user
    const userId = req.user._id;
    const messages = await Message.aggregate([
      { $match: { $or: [{ from: userId }, { to: userId }] } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: { $cond: [ { $eq: ['$from', userId] }, '$to', '$from' ] },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: { $sum: { $cond: [ { $and: [ { $eq: ['$to', userId] }, { $eq: ['$read', false] } ] }, 1, 0 ] } }
      } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'partner' } },
      { $unwind: '$partner' },
      { $project: {
        partnerId: '$_id',
        partnerName: { $concat: ['$partner.firstName', ' ', '$partner.lastName'] },
        partnerAvatar: '$partner.avatar',
        lastMessage: '$lastMessage.content',
        lastMessageTime: '$lastMessage.createdAt',
        unreadCount: 1
      } },
      { $sort: { lastMessageTime: -1 } }
    ]);

    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await Message.findById(id).populate('from to', 'firstName lastName avatar');
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    // Ensure user is part of the message
    const userId = req.user._id.toString();
    if (msg.from._id.toString() !== userId && msg.to._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};