const Course = require('../models/course.model');
const User = require('../models/user.model');
const Enrollment = require('../models/enrollment.model');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

class AnalyticsService {
  constructor() {
    this.CACHE_TTL = 3600; // 1 hour
  }

  async generateDailyReport() {
    try {
      logger.info('Generating daily analytics report...');
      
      const [totalStudents, totalInstructors, totalCourses, activeCourses] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'instructor' }),
        Course.countDocuments(),
        Course.countDocuments({ status: 'active' })
      ]);

      const report = {
        date: new Date(),
        metrics: {
          users: {
            total: totalStudents + totalInstructors,
            students: totalStudents,
            instructors: totalInstructors
          },
          courses: {
            total: totalCourses,
            active: activeCourses
          }
        }
      };

      await cache.set('analytics:daily', report, this.CACHE_TTL);
      return report;
    } catch (error) {
      logger.error('Error generating analytics report:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();