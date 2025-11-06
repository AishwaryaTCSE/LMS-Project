const Assignment = require('../models/assignment.model');
const Quiz = require('../models/quiz.model');
const { success } = require('../utils/response');

exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate, course } = req.body;
    if (!title || !course) {
      return res.status(400).json({ success: false, message: 'Title and course are required' });
    }

    const a = await Assignment.create({ title, description, dueDate, course });
    success(res, a, 201);
  } catch (err) {
    console.error('Create Assignment Error:', err);
    next(err);
  }
};

exports.createQuiz = async (req, res, next) => {
  try {
    const { title, questions, course } = req.body;
    if (!title || !course || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz data' });
    }

    const q = await Quiz.create({ title, questions, course });
    success(res, q, 201);
  } catch (err) {
    console.error('Create Quiz Error:', err);
    next(err);
  }
};

exports.getAssignmentsByCourse = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const list = await Assignment.find({ course: req.params.courseId })
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    success(res, list);
  } catch (err) {
    console.error('Get Assignments Error:', err);
    next(err);
  }
};
