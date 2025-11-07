const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Assignment API', () => {
  let token;
  let courseId;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'teacher@test.com', password: 'password123' });
    token = res.body.token;
    courseId = 'test_course_id'; // Use actual test course ID
  });

  describe('POST /api/v1/assignments', () => {
    it('should create an assignment as teacher', async () => {
      const res = await request(app)
        .post('/api/v1/assignments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Assignment',
          description: 'Test description',
          course: courseId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          maxMarks: 100
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', 'Test Assignment');
    });

    it('should forbid student from creating assignment', async () => {
      // Login as student
      const studentRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'student@test.com', password: 'password123' });
      
      const res = await request(app)
        .post('/api/v1/assignments')
        .set('Authorization', `Bearer ${studentRes.body.token}`)
        .send({
          title: 'Unauthorized Assignment',
          course: courseId,
          dueDate: new Date(),
          maxMarks: 100
        });
      
      expect(res.statusCode).toBe(403);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});