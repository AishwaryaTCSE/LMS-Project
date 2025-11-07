const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Quiz = require('../models/quiz.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');

describe('Quiz API', () => {
  let token;
  let teacherId;
  let courseId;
  let quizId;

  beforeAll(async () => {
    // Create test teacher and get token
    const teacher = await User.create({
      firstName: 'Test',
      lastName: 'Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });
    teacherId = teacher._id;

    // Login to get token (mock this or implement actual login)
    token = 'Bearer mock_token'; // Replace with actual token generation

    // Create test course
    const course = await Course.create({
      title: 'Test Course',
      instructor: teacherId
    });
    courseId = course._id;
  });

  afterAll(async () => {
    await Quiz.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/v1/quizzes', () => {
    it('should create a new quiz', async () => {
      const res = await request(app)
        .post('/api/v1/quizzes')
        .set('Authorization', token)
        .send({
          title: 'Test Quiz',
          course: courseId,
          questions: [
            {
              question: 'What is 2+2?',
              options: ['3', '4', '5', '6'],
              correctIndex: 1,
              points: 1
            }
          ],
          timeLimit: 30,
          passingScore: 70
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      quizId = res.body.data._id;
    });
  });

  describe('GET /api/v1/quizzes/course/:courseId', () => {
    it('should get all quizzes for a course', async () => {
      const res = await request(app)
        .get(`/api/v1/quizzes/course/${courseId}`)
        .set('Authorization', token);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/quizzes/:quizId/attempt', () => {
    it('should submit quiz attempt', async () => {
      const res = await request(app)
        .post(`/api/v1/quizzes/${quizId}/attempt`)
        .set('Authorization', token)
        .send({
          answers: [{ selectedIndex: 1 }]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('score');
    });
  });
});