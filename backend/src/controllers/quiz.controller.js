const Quiz = require('../models/quiz.model');
const Submission = require('../models/submission.model');
const Course = require('../models/course.model');

exports.createQuiz = async (req, res, next) => {
  try {
    const { title, description, course, questions, timeLimit, passingScore } = req.body;
    const createdBy = req.user._id;
    
    if (!title || !course || !questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Title, course, and questions required' });
    }
    
    const courseDoc = await Course.findById(course);
    if (!courseDoc || courseDoc.instructor.toString() !== createdBy.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const quiz = await Quiz.create({
      title,
      description,
      course,
      questions,
      timeLimit,
      passingScore,
      createdBy
    });
    
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    next(error);
  }
};

exports.getQuizzes = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ course: courseId })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate('course', 'title');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    
    // Don't send correct answers to students
    if (req.user.role === 'student') {
      quiz.questions = quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        points: q.points
      }));
    }
    
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

exports.updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz || quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const allowed = ['title', 'description', 'questions', 'timeLimit', 'passingScore', 'isPublished'];
    const update = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });
    
    const updated = await Quiz.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz || quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await Quiz.findByIdAndDelete(id);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};

exports.attemptQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    
    // Calculate score
    let score = 0;
    const processedAnswers = answers.map((ans, idx) => {
      const question = quiz.questions[idx];
      const isCorrect = question.correctIndex === ans.selectedIndex;
      if (isCorrect) score += question.points || 1;
      return {
        questionId: question._id,
        selectedIndex: ans.selectedIndex,
        isCorrect,
        pointsEarned: isCorrect ? (question.points || 1) : 0
      };
    });
    
    const totalScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = (score / totalScore) * 100;
    
    const submission = await Submission.create({
      student: studentId,
      quiz: quizId,
      submissionType: 'quiz',
      answers: processedAnswers,
      score,
      totalScore,
      percentage,
      status: 'graded'
    });
    
    await Quiz.findByIdAndUpdate(quizId, { $inc: { attemptCount: 1 } });
    
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

exports.getAttempts = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const attempts = await Submission.find({ quiz: quizId, submissionType: 'quiz' })
      .populate('student', 'firstName lastName')
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: attempts });
  } catch (error) {
    next(error);
  }
};