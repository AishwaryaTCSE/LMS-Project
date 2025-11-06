const mongoose = require('mongoose');
const Course = require('../models/course.model');
const Assignment = require('../models/assignment.model');
const Quiz = require('../models/quiz.model');
const Submission = require('../models/submission.model');
const User = require('../models/user.model');
const { success } = require('../utils/response');

exports.getCourseReport = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const totalAssignments = await Assignment.countDocuments({ course: courseId });
    const totalQuizzes = await Quiz.countDocuments({ course: courseId });

    const assignmentIds = await Assignment.find({ course: courseId }).distinct('_id');
    const quizIds = await Quiz.find({ course: courseId }).distinct('_id');

    const totalAssignmentSubmissions = await Submission.countDocuments({ assignment: { $in: assignmentIds } });
    const totalQuizSubmissions = await Submission.countDocuments({ quiz: { $in: quizIds } });

    const report = {
      course,
      totalAssignments,
      totalQuizzes,
      totalAssignmentSubmissions,
      totalQuizSubmissions
    };

    success(res, report);

  } catch (err) {
    console.error('Get Course Report Error:', err);
    next(err);
  }
};

exports.getStudentReport = async (req, res, next) => {
  try {
    const { courseId, studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID(s)' });
    }

    const assignments = await Assignment.find({ course: courseId }).distinct('_id');
    const quizzes = await Quiz.find({ course: courseId }).distinct('_id');

    const assignmentsSubmitted = await Submission.countDocuments({ assignment: { $in: assignments }, student: studentId });
    const quizzesSubmitted = await Submission.countDocuments({ quiz: { $in: quizzes }, student: studentId });

    const student = await User.findById(studentId, 'name email');

    const studentReport = {
      student,
      totalAssignments: assignments.length,
      totalQuizzes: quizzes.length,
      assignmentsSubmitted,
      quizzesSubmitted
    };

    success(res, studentReport);

  } catch (err) {
    console.error('Get Student Report Error:', err);
    next(err);
  }
};
