const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const API_PREFIX = '/api/v1';

async function runSmokeTests() {
  console.log('🔥 Running smoke tests...\n');
  let passed = 0;
  let failed = 0;

  const tests = [
    { name: 'Health Check', url: '/', method: 'GET', expectStatus: 200 },
    { name: 'Auth Routes', url: `${API_PREFIX}/auth/login`, method: 'POST', expectStatus: [400, 401] },
    { name: 'Course Routes', url: `${API_PREFIX}/courses`, method: 'GET', expectStatus: [200, 401] },
    { name: 'User Routes', url: `${API_PREFIX}/users/me`, method: 'GET', expectStatus: 401 },
    { name: 'Message Routes', url: `${API_PREFIX}/messages/conversations`, method: 'GET', expectStatus: 401 },
    { name: 'Assignment Routes', url: `${API_PREFIX}/assignments`, method: 'GET', expectStatus: [404, 401] },
    { name: 'Quiz Routes', url: `${API_PREFIX}/quizzes`, method: 'GET', expectStatus: [404, 401] },
    { name: 'Gradebook Routes', url: `${API_PREFIX}/gradebook`, method: 'GET', expectStatus: [404, 401] },
    { name: 'Analytics Routes', url: `${API_PREFIX}/analytics/report`, method: 'GET', expectStatus: [401, 403] },
    { name: 'Notification Routes', url: `${API_PREFIX}/notifications`, method: 'GET', expectStatus: 401 },
  ];

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        validateStatus: () => true,
        timeout: 5000
      });

      const expectedStatuses = Array.isArray(test.expectStatus) 
        ? test.expectStatus 
        : [test.expectStatus];

      if (expectedStatuses.includes(response.status)) {
        console.log(`✅ ${test.name}: ${response.status}`);
        passed++;
      } else {
        console.log(`⚠️  ${test.name}: Got ${response.status}, expected ${expectedStatuses.join(' or ')}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(failed === 0 ? '✅ All smoke tests passed!' : '⚠️ Some tests failed');
  
  process.exit(failed > 0 ? 1 : 0);
}

runSmokeTests().catch((error) => {
  console.error('❌ Smoke test failed:', error);
  process.exit(1);
});