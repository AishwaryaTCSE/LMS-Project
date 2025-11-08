const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const dotenv = require('dotenv');

dotenv.config();

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@lms.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@lms.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();