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

// Get courses with filters, sorting, and pagination
exports.getCoursesWithFilters = async (req, res, next) => {
  try {
    const { 
      q = '', 
      instructor = 'all',
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (instructor !== 'all') filter.instructor = instructor;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName email')
      .populate('students', 'firstName lastName')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    success(res, { 
      items: courses, 
      pagination: { 
        page: Number(page), 
        limit: Number(limit), 
        total,
        totalPages: Math.ceil(total / limit)
      } 
    });
  } catch (err) {
    console.error('Get Courses With Filters Error:', err);
    next(err);
  }
};

// Bulk update courses
exports.bulkUpdateCourses = async (req, res, next) => {
  try {
    const { ids, action, data } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid course IDs' });
    }

    let update = {};
    if (action === 'archive') update.status = 'archived';
    else if (action === 'publish') update.status = 'published';
    else if (action === 'update' && data) update = data;

    const result = await Course.updateMany({ _id: { $in: ids } }, { $set: update });
    success(res, { message: `${result.modifiedCount} courses updated`, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Bulk Update Courses Error:', err);
    next(err);
  }
};

// Export courses
exports.exportCourses = async (req, res, next) => {
  try {
    const { q = '', instructor = 'all' } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (instructor !== 'all') filter.instructor = instructor;
    
    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName email')
      .lean();
    
    const { Parser } = require('json2csv');
    const fields = ['title', 'description', 'instructor.firstName', 'instructor.lastName', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(courses);
    res.header('Content-Type', 'text/csv');
    res.attachment(`courses_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error('Export Courses Error:', err);
    next(err);
  }
};

// Get instructor's courses
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const instructorId = req.user._id;
    const courses = await Course.find({ instructor: instructorId })
      .populate('students', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();
    
    success(res, courses);
  } catch (err) {
    console.error('Get Instructor Courses Error:', err);
    next(err);
  }
};

// Get student's enrolled courses
exports.getStudentCourses = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({ students: studentId })
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();
    
    success(res, courses);
  } catch (err) {
    console.error('Get Student Courses Error:', err);
    next(err);
  }
};