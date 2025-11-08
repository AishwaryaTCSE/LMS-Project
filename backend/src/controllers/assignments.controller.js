const mongoose = require('mongoose');
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const Course = require('../models/course.model');
const storageService = require('../services/storage.service');
const notificationService = require('../services/notification.service');

/**
 * Create assignment (Teacher only)
 */
exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, course, dueDate, maxMarks, instructions } = req.body;
    const createdBy = req.user._id;
    
    if (!title || !course || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title, course, and due date are required' });
    }
    
    // Verify teacher owns the course
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    if (courseDoc.instructor.toString() !== createdBy.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to create assignments for this course' });
    }
    
    const assignmentData = {
      title,
      description,
      course,
      dueDate,
      maxMarks: maxMarks || 100,
      instructions,
      createdBy,
      attachments: []
    };
    
    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const uploads = await storageService.uploadMultipleFiles(req.files, { folder: 'assignments' });
      assignmentData.attachments = uploads.map(u => ({
        filename: u.filename,
        url: u.url,
        size: u.size,
        mimeType: req.files.find(f => f.originalname === u.filename)?.mimetype
      }));
    }
    
    const assignment = await Assignment.create(assignmentData);
    
    // Notify students
    const io = req.app.get('io');
    await notificationService.notifyAssignmentPosted(
      courseDoc.students,
      assignment.title,
      courseDoc.title,
      io
    );
    
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    next(error);
  }
};

/**
 * Get assignments for a course
 */
exports.getAssignments = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    if (!courseId || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing courseId parameter' });
    }
    const { page = 1, limit = 20 } = req.query;
    
    const assignments = await Assignment.find({ course: courseId })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Assignment.countDocuments({ course: courseId });
    
    res.json({
      success: true,
      data: assignments,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    next(error);
  }
};

/**
 * Get assignment details
 */
exports.getAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing assignment id' });
    }
    
    const assignment = await Assignment.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('course', 'title');
    
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Get assignment error:', error);
    next(error);
  }
};

/**
 * Update assignment (Teacher only)
 */
exports.updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    if (assignment.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const allowed = ['title', 'description', 'dueDate', 'maxMarks', 'instructions', 'allowLateSubmissions'];
    const update = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });
    
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, update, { new: true });
    
    res.json({ success: true, data: updatedAssignment });
  } catch (error) {
    console.error('Update assignment error:', error);
    next(error);
  }
};

/**
 * Delete assignment (Teacher only)
 */
exports.deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    if (assignment.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await Assignment.findByIdAndDelete(id);
    
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    next(error);
  }
};

/**
 * Submit assignment (Student only)
 */
exports.submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    if (!assignmentId || !mongoose.isValidObjectId(assignmentId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing assignmentId' });
    }
    const { textAnswer } = req.body;
    const studentId = req.user._id;
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    // Check if late
    const isLate = new Date() > assignment.dueDate;
    if (isLate && !assignment.allowLateSubmissions) {
      return res.status(400).json({ success: false, message: 'Late submissions not allowed' });
    }
    
    const submissionData = {
      student: studentId,
      assignment: assignmentId,
      submissionType: 'assignment',
      textAnswer,
      isLate,
      files: []
    };
    
    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const uploads = await storageService.uploadMultipleFiles(req.files, { folder: 'submissions' });
      submissionData.files = uploads.map(u => ({
        filename: u.filename,
        url: u.url,
        size: u.size,
        mimeType: req.files.find(f => f.originalname === u.filename)?.mimetype
      }));
    }
    
    const submission = await Submission.create(submissionData);
    
    // Update submission count
    await Assignment.findByIdAndUpdate(assignmentId, { $inc: { submissionCount: 1 } });
    
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    console.error('Submit assignment error:', error);
    next(error);
  }
};

/**
 * Grade submission (Teacher only)
 */
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { marksAwarded, feedback } = req.body;
    const gradedBy = req.user._id;
    
    const submission = await Submission.findById(submissionId).populate('assignment');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    // Verify teacher owns the course
    const assignment = await Assignment.findById(submission.assignment).populate('course');
    if (assignment.createdBy.toString() !== gradedBy.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    submission.marksAwarded = marksAwarded;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedAt = new Date();
    submission.gradedBy = gradedBy;
    submission.percentage = (marksAwarded / assignment.maxMarks) * 100;
    
    await submission.save();
    
    // Notify student
    const io = req.app.get('io');
    await notificationService.notifyGradePublished(
      submission.student,
      assignment.title,
      marksAwarded,
      io
    );
    
    res.json({ success: true, data: submission });
  } catch (error) {
    console.error('Grade submission error:', error);
    next(error);
  }
};

/**
 * Get submissions for assignment (Teacher)
 */
exports.getSubmissions = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    if (!assignmentId || !mongoose.isValidObjectId(assignmentId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing assignmentId' });
    }
    
    const submissions = await Submission.find({ assignment: assignmentId, submissionType: 'assignment' })
      .populate('student', 'firstName lastName email')
      .sort({ submittedAt: -1 });
    
    res.json({ success: true, data: submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    next(error);
  }
};