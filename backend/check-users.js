const mongoose = require('mongoose');
const User = require('./src/models/user.model.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@lms.com' });
    if (adminUser) {
      console.log('Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      console.log('Is Active:', adminUser.isActive);
      console.log('Email Verified:', adminUser.emailVerified);
      
      // Test password
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
      console.log('Password valid for admin123:', isPasswordValid);
      
      // Test common passwords
      const passwords = ['password', 'admin123', 'admin', '123456'];
      for (const pwd of passwords) {
        const valid = await bcrypt.compare(pwd, adminUser.password);
        if (valid) {
          console.log(`Found valid password: ${pwd}`);
          break;
        }
      }
    } else {
      console.log('Admin user not found');
      
      // List all users
      const allUsers = await User.find({}).select('email role isActive emailVerified');
      console.log('All users:', allUsers);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();