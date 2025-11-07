const express = require('express');
const router = express.Router();
const courseCtrl = require('../controllers/course.controller');
const { auth, permit } = require('../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /courses - list all courses
router.get('/', courseCtrl.getCourses);

// POST /courses - create a course (instructor/admin only)
router.post(
  '/',
  auth,
  permit('instructor', 'admin'),
  [
    body('title').notEmpty().withMessage('Course title is required'),
    body('description').optional().isString()
  ],
  validate,
  courseCtrl.createCourse
);

// GET /courses/:id - get details of a specific course
router.get('/:id', courseCtrl.getCourse);

// PUT /courses/:id - update a course (instructor/admin only)
router.put(
  '/:id',
  auth,
  permit('instructor', 'admin'),
  [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('syllabus').optional()
  ],
  validate,
  courseCtrl.updateCourse
);

// DELETE /courses/:id - delete a course (instructor/admin only)
router.delete(
  '/:id',
  auth,
  permit('instructor', 'admin'),
  courseCtrl.deleteCourse
);

// GET /courses/filter/all - get courses with filters, sorting, pagination
router.get('/filter/all', auth, courseCtrl.getCoursesWithFilters);

// POST /courses/bulk - bulk update courses
router.post('/bulk', auth, permit('admin', 'instructor'), courseCtrl.bulkUpdateCourses);

// GET /courses/export/all - export courses as CSV
router.get('/export/all', auth, permit('admin', 'instructor'), courseCtrl.exportCourses);

module.exports = router;
