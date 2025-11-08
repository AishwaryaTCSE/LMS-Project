const express = require('express');
const router = express.Router();
const assignmentCtrl = require('../controllers/assignments.controller');
const { auth, permit } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

// Guard route handlers so server doesn't crash if a controller export is missing
const safe = (fn, name) => {
  if (typeof fn === 'function') return fn;
  console.warn(`Missing handler for ${name} — registering fallback to avoid crash.`);
  return (req, res) => res.status(501).json({ success: false, message: `${name} handler not implemented on server` });
};

// All routes require authentication
router.use(auth);

// Get assignments for a course (all users)
router.get('/course/:courseId', safe(assignmentCtrl.getAssignments, 'assignments.getAssignments'));
router.get('/:id', safe(assignmentCtrl.getAssignment, 'assignments.getAssignment'));

// Create assignment (teacher/admin only)
router.post('/', permit('teacher', 'instructor', 'admin'), upload.array('files', 10), safe(assignmentCtrl.createAssignment, 'assignments.createAssignment'));

// Update/delete assignment (teacher/admin only)
router.put('/:id', permit('teacher', 'instructor', 'admin'), safe(assignmentCtrl.updateAssignment, 'assignments.updateAssignment'));
router.delete('/:id', permit('teacher', 'instructor', 'admin'), assignmentCtrl.deleteAssignment);

// Submit assignment (student only)
router.post('/:assignmentId/submit', permit('student'), upload.array('files', 5), assignmentCtrl.submitAssignment);

// Grade submission (teacher/admin only)
router.post('/submissions/:submissionId/grade', permit('teacher', 'instructor', 'admin'), assignmentCtrl.gradeSubmission);

// Get submissions (teacher/admin only)
router.get('/:assignmentId/submissions', permit('teacher', 'instructor', 'admin'), assignmentCtrl.getSubmissions);

module.exports = router;