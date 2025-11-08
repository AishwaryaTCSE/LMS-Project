const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    isActive: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'instructor1@example.com',
    password: 'password123',
    role: 'teacher',
    isActive: true
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'instructor2@example.com',
    password: 'password123',
    role: 'teacher',
    isActive: true
  },
  {
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'student1@example.com',
    password: 'password123',
    role: 'student',
    isActive: true
  },
  {
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'student2@example.com',
    password: 'password123',
    role: 'student',
    isActive: true
  },
  {
    firstName: 'Diana',
    lastName: 'Davis',
    email: 'student3@example.com',
    password: 'password123',
    role: 'student',
    isActive: true
  },
  {
    firstName: 'Eve',
    lastName: 'Miller',
    email: 'student4@example.com',
    password: 'password123',
    role: 'student',
    isActive: false
  },
  {
    firstName: 'Frank',
    lastName: 'Wilson',
    email: 'student5@example.com',
    password: 'password123',
    role: 'student',
    isActive: true
  }
];

const sampleCourses = [
  {
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    subjects: ['Web Development', 'Programming'],
    price: 99.99,
    status: 'published'
  },
  {
    title: 'Advanced React Development',
    description: 'Master React.js and build modern web applications',
    subjects: ['React', 'JavaScript', 'Frontend'],
    price: 149.99,
    status: 'published'
  },
  {
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js',
    subjects: ['Node.js', 'Backend', 'API'],
    price: 129.99,
    status: 'published'
  },
  {
    title: 'Database Design Fundamentals',
    description: 'Learn SQL and database design principles',
    subjects: ['Database', 'SQL', 'Design'],
    price: 79.99,
    status: 'draft'
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts and algorithms',
    subjects: ['Machine Learning', 'Python', 'AI'],
    price: 199.99,
    status: 'published'
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Existing data cleared');

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        studentId: userData.role === 'student' ? uuidv4() : undefined
      });
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    // Create courses
    console.log('Creating courses...');
    const teachers = createdUsers.filter(user => user.role === 'teacher');
    const students = createdUsers.filter(user => user.role === 'student');

    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      const teacher = teachers[i % teachers.length];
      
      const course = new Course({
        ...courseData,
        instructor: teacher._id,
        students: students.slice(0, Math.floor(Math.random() * students.length) + 1).map(s => s._id),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
      
      await course.save();
      console.log(`Created course: ${course.title}`);

      // Students are already added to course.students array, no need to update user model
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${sampleCourses.length} courses`);

    // Show summary
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const courseStats = await Course.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    console.log('\nUser Statistics:');
    userStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}`);
    });

    console.log('\nCourse Statistics:');
    courseStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;