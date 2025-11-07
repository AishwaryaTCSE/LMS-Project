const express = require('express');
const router = express.Router();
const quizCtrl = require('../controllers/quiz.controller');
const { auth, permit } = require('../middlewares/auth.middleware');

router.use(auth);

// Get quizzes
router.get('/course/:courseId', quizCtrl.getQuizzes);
router.get('/:id', quizCtrl.getQuiz);

// Create/update/delete (teacher only)
router.post('/', permit('teacher', 'instructor', 'admin'), quizCtrl.createQuiz);
router.put('/:id', permit('teacher', 'instructor', 'admin'), quizCtrl.updateQuiz);
router.delete('/:id', permit('teacher', 'instructor', 'admin'), quizCtrl.deleteQuiz);

// Submit quiz (student)
router.post('/:quizId/attempt', permit('student'), quizCtrl.attemptQuiz);

// Get attempts
router.get('/:quizId/attempts', quizCtrl.getAttempts);

module.exports = router;