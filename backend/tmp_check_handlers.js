const path = require('path');
const base = path.resolve(__dirname, 'src', 'controllers');
const checks = [
  {file: 'submission.controller.js', name: 'submitAssignment'},
  {file: 'submission.controller.js', name: 'getMySubmissions'},
  {file: 'quiz.controller.js', name: 'getAvailableQuizzes'},
  {file: 'quiz.controller.js', name: 'getQuizAttempt'},
  {file: 'message.controller.js', name: 'getMyMessages'},
  {file: 'message.controller.js', name: 'getMessage'},
  {file: 'course.controller.js', name: 'getCourseDetails'},
  {file: 'user.controller.js', name: 'getMyGrades'},
  {file: 'user.controller.js', name: 'getCourseGrades'},
  {file: 'user.controller.js', name: 'getMyEvents'}
];

checks.forEach(c => {
  try {
    const mod = require(path.join(base, c.file));
    console.log(`${c.file} -> ${c.name}:`, typeof mod[c.name]);
  } catch (err) {
    console.log(`${c.file} -> require failed:`, err.message);
  }
});
