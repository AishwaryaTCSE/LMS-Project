import axios from 'axios';

async function testLogin() {
  try {
    console.log('Testing login with new admin credentials...');
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.log('Login error status:', error.response?.status);
    console.log('Login error data:', error.response?.data);
    console.log('Login error message:', error.message);
  }
}

testLogin();