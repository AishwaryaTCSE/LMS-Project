const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Course = require('./src/models/course.model');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: { $in: ['teacher', 'instructor'] } });
    const totalCourses = await Course.countDocuments();
    
    console.log('Database Stats:');
    console.log('Total Users:', totalUsers);
    console.log('Total Students:', totalStudents);
    console.log('Total Instructors:', totalInstructors);
    console.log('Total Courses:', totalCourses);
    
    const users = await User.find().limit(5);
    console.log('\nSample Users:');
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.role}) - ${user.email}`);
    });
    
    const courses = await Course.find().limit(5);
    console.log('\nSample Courses:');
    courses.forEach(course => {
      console.log(`- ${course.title} - Instructor: ${course.instructor}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkData();