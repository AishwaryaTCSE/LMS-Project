const Course = require('../models/course.model');
const { success } = require('../utils/response');

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, syllabus } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const course = await Course.create({ title, description, syllabus, instructor: req.user._id });
    success(res, course, 201);
  } catch (err) {
    console.error('Create Course Error:', err);
    next(err);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    success(res, courses);
  } catch (err) {
    console.error('Get Courses Error:', err);
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lessons')
      .populate('instructor', 'name email');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    success(res, course);
  } catch (err) {
    console.error('Get Course Error:', err);
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = {};
    const allowed = ['title', 'description', 'syllabus'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )
      .populate('lessons')
      .populate('instructor', 'name email');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    success(res, course);
  } catch (err) {
    console.error('Update Course Error:', err);
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    success(res, { message: 'Course deleted' });
  } catch (err) {
    console.error('Delete Course Error:', err);
    next(err);
  }
};