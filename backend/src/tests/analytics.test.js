const mongoose = require('mongoose');
const { generateReport } = require('../services/analytics.service');
require('dotenv').config();

// Use a separate test database
const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/lms_project_test';

describe('Analytics Service', () => {
  beforeAll(async () => {
    jest.setTimeout(30000); // Increase timeout for slow DB connections
    await mongoose.connect(MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Clean database before each test
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should generate valid analytics report', async () => {
    const report = await generateReport();

    expect(report).toHaveProperty('totalCourses');
    expect(report).toHaveProperty('totalStudents');
    expect(report).toHaveProperty('totalInstructors');
    expect(report).toHaveProperty('generatedAt');

    // Type and value checks
    expect(typeof report.totalCourses).toBe('number');
    expect(typeof report.totalStudents).toBe('number');
    expect(typeof report.totalInstructors).toBe('number');
    expect(report.generatedAt).toBeInstanceOf(Date);

    // Values should be non-negative
    expect(report.totalCourses).toBeGreaterThanOrEqual(0);
    expect(report.totalStudents).toBeGreaterThanOrEqual(0);
    expect(report.totalInstructors).toBeGreaterThanOrEqual(0);
  });
});
