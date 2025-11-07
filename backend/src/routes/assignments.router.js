const express = require('express');
const router = express.Router();
const assignmentCtrl = require('../controllers/assignments.controller');
const { auth, permit } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

// All routes require authentication
router.use(auth);

// Get assignments for a course (all users)
router.get('/course/:courseId', assignmentCtrl.getAssignments);
router.get('/:id', assignmentCtrl.getAssignment);

// Create assignment (teacher/admin only)
router.post('/', permit('teacher', 'instructor', 'admin'), upload.array('files', 10), assignmentCtrl.createAssignment);

// Update/delete assignment (teacher/admin only)
router.put('/:id', permit('teacher', 'instructor', 'admin'), assignmentCtrl.updateAssignment);
router.delete('/:id', permit('teacher', 'instructor', 'admin'), assignmentCtrl.deleteAssignment);

// Submit assignment (student only)
router.post('/:assignmentId/submit', permit('student'), upload.array('files', 5), assignmentCtrl.submitAssignment);

// Grade submission (teacher/admin only)
router.post('/submissions/:submissionId/grade', permit('teacher', 'instructor', 'admin'), assignmentCtrl.gradeSubmission);

// Get submissions (teacher/admin only)
router.get('/:assignmentId/submissions', permit('teacher', 'instructor', 'admin'), assignmentCtrl.getSubmissions);

module.exports = router;