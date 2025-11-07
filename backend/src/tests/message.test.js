const request = require('supertest');
const app = require('../app');

describe('Message API', () => {
  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/v1/messages/send')
      .send({ recipientId: '123', content: 'Test message' });
    expect(res.statusCode).toBe(201);
  });
});