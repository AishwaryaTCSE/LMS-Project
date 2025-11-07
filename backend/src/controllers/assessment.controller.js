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

// Get assignment by ID
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title description');
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    success(res, assignment);
  } catch (err) {
    console.error('Get Assignment Error:', err);
    next(err);
  }
};

// Update assignment
exports.updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = {};
    const allowed = ['title', 'description', 'dueDate', 'points'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    const assignment = await Assignment.findByIdAndUpdate(id, { $set: update }, { new: true })
      .populate('course', 'title');
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    success(res, assignment);
  } catch (err) {
    console.error('Update Assignment Error:', err);
    next(err);
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    success(res, { message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('Delete Assignment Error:', err);
    next(err);
  }
};

// Get all assignments with filters
exports.getAllAssignments = async (req, res, next) => {
  try {
    const { 
      q = '', 
      course = 'all',
      page = 1, 
      limit = 20,
      sortBy = 'dueDate',
      sortOrder = 'asc'
    } = req.query;
    
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (course !== 'all') filter.course = course;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Assignment.countDocuments(filter);
    const assignments = await Assignment.find(filter)
      .populate('course', 'title')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    success(res, { 
      items: assignments, 
      pagination: { 
        page: Number(page), 
        limit: Number(limit), 
        total,
        totalPages: Math.ceil(total / limit)
      } 
    });
  } catch (err) {
    console.error('Get All Assignments Error:', err);
    next(err);
  }
};

// Export assignments
exports.exportAssignments = async (req, res, next) => {
  try {
    const { q = '', course = 'all' } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (course !== 'all') filter.course = course;
    
    const assignments = await Assignment.find(filter)
      .populate('course', 'title')
      .lean();
    
    const { Parser } = require('json2csv');
    const fields = ['title', 'description', 'course.title', 'dueDate', 'points', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(assignments);
    res.header('Content-Type', 'text/csv');
    res.attachment(`assignments_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error('Export Assignments Error:', err);
    next(err);
  }
};