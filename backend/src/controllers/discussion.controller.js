const Discussion = require('../models/discussion.model');
const { success } = require('../utils/response');

exports.createThread = async (req, res, next) => {
  try {
    const { title, course, message } = req.body;
    if (!title || !course || !message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Title, course, and message are required' });
    }

    const payload = {
      title,
      course,
      starter: req.user._id,
      posts: [{ author: req.user._id, message: message.trim() }],
    };

    const thread = await Discussion.create(payload);
    success(res, thread, 201);
  } catch (err) {
    console.error('Create Thread Error:', err);
    next(err);
  }
};

exports.addPost = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const thread = await Discussion.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });

    thread.posts.push({ author: req.user._id, message: message.trim() });
    await thread.save();
    success(res, thread);
  } catch (err) {
    console.error('Add Post Error:', err);
    next(err);
  }
};
