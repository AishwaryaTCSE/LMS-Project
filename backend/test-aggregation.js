const mongoose = require('mongoose');
const Course = require('./src/models/course.model');

async function testCourseAggregation() {
  try {
    console.log('Testing Course.aggregate...');
    
    // Test basic aggregation
    const result = await Course.aggregate([
      {
        $project: {
          title: 1,
          studentCount: { $size: { $ifNull: ['$students', []] } }
        }
      },
      { $sort: { studentCount: -1 } },
      { $limit: 5 }
    ]);
    
    console.log('Aggregation successful:', result);
  } catch (error) {
    console.error('Aggregation error:', error.message);
    console.error('Full error:', error);
  }
}

testCourseAggregation();