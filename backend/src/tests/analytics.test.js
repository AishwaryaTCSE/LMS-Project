const request = require('supertest');
const app = require('../app');

describe('Analytics API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    token = res.body.token;
  });

  it('should get analytics overview', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/overview')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('totalCourses');
    expect(res.body.data).toHaveProperty('totalStudents');
    expect(res.body.data).toHaveProperty('insights');
  });
});