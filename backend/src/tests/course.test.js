const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const Course = require('../models/course.model');
require('dotenv').config();

const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/lms_project_test';

describe('Course Routes', () => {
  let token;
  let instructor;

  beforeAll(async () => {
    await mongoose.connect(MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    // Create an instructor and get auth token
    instructor = await User.create({
      name: 'Instructor User',
      email: 'instructor@example.com',
      password: 'password123',
      role: 'instructor'
    });

    const res = await request(app).post('/auth/login').send({
      email: 'instructor@example.com',
      password: 'password123'
    });

    token = res.body.data.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /courses should return empty array initially', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  test('POST /courses should create a new course', async () => {
    const res = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Course',
        description: 'This is a test course'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('title', 'Test Course');
    expect(res.body.data).toHaveProperty('instructor', instructor._id.toString());
  });

  test('GET /courses should return created course', async () => {
    await Course.create({ title: 'Existing Course', instructor: instructor._id });

    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).toHaveProperty('title', 'Existing Course');
  });
});
