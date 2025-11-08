const Discussion = require('../models/discussion.model');
const { success } = require('../utils/response');

const discussionController = {
  // Get all discussions
  getDiscussions: async (req, res, next) => {
    try {
      const { courseId } = req.query;
      let query = {};

      if (courseId) {
        query.course = courseId;
      }

      const discussions = await Discussion.find(query)
        .populate('starter', 'name email')
        .populate('posts.author', 'name email')
        .sort({ createdAt: -1 });

      success(res, discussions);
    } catch (err) {
      console.error('Get Discussions Error:', err);
      next(err);
    }
  },

  // Create a new discussion thread
  createThread: async (req, res, next) => {
    try {
      const { title, course, message } = req.body;
      if (!title || !course || !message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Title, course, and message are required' });
      }

      const payload = {
        title,
        course,
        starter: req.user._id,
        posts: [{
          author: req.user._id,
          message: message.trim()
        }]
      };

      const thread = await Discussion.create(payload);
      success(res, thread, 201);
    } catch (err) {
      console.error('Create Thread Error:', err);
      next(err);
    }
  },

  // Add a reply to a discussion
  addReply: async (req, res, next) => {
    try {
      const { message } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message cannot be empty' });
      }

      // Check both req.params.id (from the first block) and req.params.threadId (from the second block) 
      // to handle the two different parameter names used in your duplicated code. 
      // I will prioritize req.params.id as it appeared first, but use a fallback if possible.
      const threadId = req.params.id || req.params.threadId;

      const thread = await Discussion.findById(threadId);

      // Used "Discussion not found" from the first block, as "Thread not found" from the second is also fine.
      if (!thread) {
        return res.status(404).json({ success: false, message: 'Discussion not found' });
      }

      thread.posts.push({
        author: req.user._id,
        message: message.trim()
      });

      await thread.save();
      success(res, thread);
    } catch (err) {
      // Used "Add Reply Error" from the first block, as it is more descriptive than "Add Post Error".
      console.error('Add Reply Error:', err);
      next(err);
    }
  },

  // Get a single discussion by ID
  getDiscussion: async (req, res, next) => {
    try {
      const discussion = await Discussion.findById(req.params.id)
        .populate('starter', 'name email')
        .populate('posts.author', 'name email');

      if (!discussion) {
        return res.status(404).json({ success: false, message: 'Discussion not found' });
      }

      success(res, discussion);
    } catch (err) {
      console.error('Get Discussion Error:', err);
      next(err);
    }
  }
};

module.exports = discussionController;