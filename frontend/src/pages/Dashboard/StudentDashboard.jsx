import React, { useState, useEffect } from 'react';
import { 
  FiBookOpen,
  FiFileText,
  FiCheckCircle,
  FiAward,
  FiClock,
  FiMessageSquare,
  FiCalendar
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboard } from '../../api/dashboardApi';
import Loader from '../../components/Loader';
import useAuth from '../../hooks/useAuth';

const formatDistanceToNow = (date) => {
  if (!date) return 'No date';
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getStudentDashboard();
        setDashboardData(response.data || response);
        setError('');
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
        // Set default data to prevent blank screen
        setDashboardData({
          coursesEnrolled: 0,
          assignmentsPending: 0,
          quizzesCompleted: 0,
          overallGrade: 0,
          courses: [],
          upcomingAssignments: [],
          recentActivities: [],
          performanceData: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Courses Enrolled', 
      value: dashboardData?.coursesEnrolled || 0, 
      icon: <FiBookOpen className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    { 
      title: 'Assignments Due', 
      value: dashboardData?.assignmentsPending || 0, 
      icon: <FiFileText className="w-8 h-8" />,
      color: 'bg-orange-500'
    },
    { 
      title: 'Quizzes Completed', 
      value: dashboardData?.quizzesCompleted || 0, 
      icon: <FiCheckCircle className="w-8 h-8" />,
      color: 'bg-yellow-500'
    },
    { 
      title: 'Overall Grade', 
      value: `${dashboardData?.overallGrade || 0}%`, 
      icon: <FiAward className="w-8 h-8" />,
      color: 'bg-blue-600'
    }
  ];

  const CalendarWidget = () => {
    const [currentDate] = useState(new Date());
    const month = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">{month}</p>
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={`text-center py-2 text-sm ${day ? 'hover:bg-gray-100 cursor-pointer' : ''} ${
                day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() 
                  ? 'bg-purple-500 text-white rounded-full' 
                  : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PerformanceChart = () => {
    const performanceData = dashboardData?.performanceData || [];
    const maxScore = Math.max(...performanceData.map(d => d.score || 0), 100);
    
    if (performanceData.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No performance data available
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {performanceData.map((data, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <div 
                  className="w-full bg-purple-500 rounded-t mb-1 relative group"
                  style={{ height: `${((data.score || 0) / maxScore) * 100}%`, minHeight: '10px' }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 bg-gray-800 text-white px-2 py-1 rounded">
                    {data.score}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{data.week}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Student'}!
        </h1>
        <p className="text-purple-100">Here's your learning overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`${stat.color} rounded-lg p-6 text-white flex items-center gap-4 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <CalendarWidget />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
          <div className="space-y-4">
            {(dashboardData?.courses || []).slice(0, 5).map((course, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-medium">{course.name?.[0] || 'C'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{course.name || 'Untitled Course'}</p>
                  <p className="text-xs text-gray-500">{course.instructor || 'Instructor'}</p>
                </div>
                <button 
                  onClick={() => navigate('/student/courses')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiMessageSquare className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
            {(!dashboardData?.courses || dashboardData.courses.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No courses enrolled yet</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/student/courses')}
            className="mt-4 w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            View All Courses
          </button>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
          <div className="space-y-3">
            {(dashboardData?.upcomingAssignments || []).map((assignment) => (
              <div 
                key={assignment.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100"
                onClick={() => navigate(`/student/assignments/${assignment.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-xs text-gray-500">{assignment.course}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {assignment.dueDate ? formatDistanceToNow(assignment.dueDate) : 'No due date'}
                  </span>
                </div>
              </div>
            ))}
            {(!dashboardData?.upcomingAssignments || dashboardData.upcomingAssignments.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming assignments</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {(dashboardData?.recentActivities || []).slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                  <FiCheckCircle className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time ? formatDistanceToNow(activity.time) : 'Recently'}
                  </p>
                </div>
              </div>
            ))}
            {(!dashboardData?.recentActivities || dashboardData.recentActivities.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
