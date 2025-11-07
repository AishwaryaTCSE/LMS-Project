const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Gradebook = require('../models/gradebook.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');

describe('Gradebook API', () => {
  let token;
  let studentId;
  let courseId;

  beforeAll(async () => {
    // Setup test data
    const student = await User.create({
      firstName: 'Test',
      lastName: 'Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'student'
    });
    studentId = student._id;

    const course = await Course.create({
      title: 'Test Course',
      instructor: studentId
    });
    courseId = course._id;

    token = 'Bearer mock_token';
  });

  afterAll(async () => {
    await Gradebook.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/v1/gradebook/course/:courseId/student/:studentId', () => {
    it('should get student gradebook', async () => {
      const res = await request(app)
        .get(`/api/v1/gradebook/course/${courseId}/student/${studentId}`)
        .set('Authorization', token);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('courseId');
    });
  });

  describe('GET /api/v1/gradebook/student/:studentId/performance', () => {
    it('should get student performance summary', async () => {
      const res = await request(app)
        .get(`/api/v1/gradebook/student/${studentId}/performance`)
        .set('Authorization', token);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('averageGPA');
    });
  });
});