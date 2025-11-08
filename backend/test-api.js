const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

async function testAPIEndpoints() {
  try {
    console.log('Testing API endpoints...');
    
    // Test user stats
    console.log('\n1. Testing /api/admin/stats/users');
    const userStatsResponse = await axios.get(`${API_BASE}/admin/stats/users`);
    console.log('User Stats:', JSON.stringify(userStatsResponse.data, null, 2));
    
    // Test course stats
    console.log('\n2. Testing /api/admin/stats/courses');
    const courseStatsResponse = await axios.get(`${API_BASE}/admin/stats/courses`);
    console.log('Course Stats:', JSON.stringify(courseStatsResponse.data, null, 2));
    
    // Test dashboard
    console.log('\n3. Testing /api/admin/dashboard');
    const dashboardResponse = await axios.get(`${API_BASE}/admin/dashboard`);
    console.log('Dashboard:', JSON.stringify(dashboardResponse.data, null, 2));
    
    // Test activities
    console.log('\n4. Testing /api/admin/activities');
    const activitiesResponse = await axios.get(`${API_BASE}/admin/activities`);
    console.log('Activities:', JSON.stringify(activitiesResponse.data, null, 2));
    
    // Test analytics
    console.log('\n5. Testing /api/admin/analytics');
    const analyticsResponse = await axios.get(`${API_BASE}/admin/analytics`);
    console.log('Analytics:', JSON.stringify(analyticsResponse.data, null, 2));
    
    console.log('\n✅ All API endpoints tested successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testAPIEndpoints();