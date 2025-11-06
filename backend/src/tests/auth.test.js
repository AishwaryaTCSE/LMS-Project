const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
require('dotenv').config();

const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/lms_project_test';

describe('Auth Routes', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await mongoose.connect(MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should return 401 for invalid login', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'wrong@example.com',
      password: 'invalid'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('should register a new user and return token', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'student'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('email', 'testuser@example.com');
  });

  test('should login an existing user', async () => {
    // First, create user
    const user = await User.create({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'password123',
      role: 'student'
    });

    const res = await request(app).post('/auth/login').send({
      email: 'existing@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('email', 'existing@example.com');
  });
});
