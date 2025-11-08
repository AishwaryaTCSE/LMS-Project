import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboard } from '../../api/dashboardApi';
import { getStudentPerformance } from '../../api/gradebookApi';
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

const formatTimeAgo = (date) => {
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

const PerformanceChart = ({ performanceData }) => {
  const data = performanceData?.map(item => ({
    name: item.courseName,
    grade: item.percentage
  })) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="grade" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CalendarWidget = ({ upcomingDeadlines }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
      <div className="space-y-3">
        {upcomingDeadlines?.map((deadline, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
              <p className="text-xs text-gray-500">{new Date(deadline.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {(!upcomingDeadlines || upcomingDeadlines.length === 0) && (
          <p className="text-sm text-gray-500 text-center">No upcoming deadlines</p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
  >
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-4xl font-semibold">{value}</p>
  </div>
);

const ActivityCard = ({ title, children }) => (
  <div className="bg-white rounded-lg p-6">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    {children}
  </div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getStudentDashboard();
        setRecentActivity(response.recentActivity || []);
        setUpcomingDeadlines(response.upcomingDeadlines || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard and gradebook data in parallel
        const [dashboardResponse, gradebookResponse] = await Promise.allSettled([
          getStudentDashboard(),
          user?._id ? getStudentPerformance(user._id) : Promise.resolve(null)
        ]);
        
        // Handle dashboard data
        if (dashboardResponse.status === 'fulfilled') {
          setDashboardData(dashboardResponse.value?.data || dashboardResponse.value);
        } else {
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
        }
        
        // Handle gradebook performance data
        if (gradebookResponse.status === 'fulfilled' && gradebookResponse.value) {
          setPerformanceData(gradebookResponse.value?.data);
        }
        
        setError('');
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

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
      title: 'My Courses', 
      value: performanceData?.totalCourses || dashboardData?.coursesEnrolled || 5, 
      icon: <FiBookOpen className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/student/courses'
    },
    { 
      title: 'Pending Assignments', 
      value: dashboardData?.assignmentsPending || 3, 
      icon: <FiClock className="w-8 h-8" />,
      color: 'bg-orange-500',
      link: '/student/assignments'
    },
    { 
      title: 'Average Grade', 
      value: performanceData?.overallGrade || dashboardData?.overallGrade || 'A-', 
      icon: <FiAward className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/student/grades'
    },
    { 
      title: 'Upcoming Quizzes', 
      value: dashboardData?.upcomingQuizzes || 2, 
      icon: <FiEdit3 className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/student/quizzes'
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
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <div className="flex gap-4">
          <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">Week</button>
          <button className="px-3 py-1 text-sm rounded-full hover:bg-gray-100">Month</button>
          <button className="px-3 py-1 text-sm rounded-full hover:bg-gray-100">Quarter</button>
          <button className="px-3 py-1 text-sm rounded-full hover:bg-gray-100">Year</button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-semibold">{performanceData?.totalCourses || "1.5K"}</p>
              <p className="text-sm text-gray-500 mt-1">Courses view</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiBookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-semibold">2.8K</p>
              <p className="text-sm text-gray-500 mt-1">Total learning hours</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <FiClockAlt className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-semibold">258</p>
              <p className="text-sm text-gray-500 mt-1">Students enrol</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-semibold">120</p>
              <p className="text-sm text-gray-500 mt-1">Tasks completed</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <FiCheckCircleAlt className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-semibold">12</p>
              <p className="text-sm text-gray-500 mt-1">Tasks due</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <FiClock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Course Activity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Courses</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', views: 250, enroll: 100 },
                { day: 'Tue', views: 150, enroll: 30 },
                { day: 'Wed', views: 200, enroll: 80 },
                { day: 'Thu', views: 180, enroll: 20 },
                { day: 'Fri', views: 250, enroll: 120 },
                { day: 'Sat', views: 220, enroll: 100 },
                { day: 'Sun', views: 150, enroll: 30 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#E2E8F0" />
                <Bar dataKey="enroll" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks/Assignment Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tasks/Assignment</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', views: 250, completed: 90 },
                { day: 'Tue', views: 150, completed: 40 },
                { day: 'Wed', views: 220, completed: 85 },
                { day: 'Thu', views: 180, completed: 25 },
                { day: 'Fri', views: 240, completed: 110 },
                { day: 'Sat', views: 200, completed: 95 },
                { day: 'Sun', views: 140, completed: 35 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#E2E8F0" />
                <Bar dataKey="completed" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <CalendarWidget />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses with Grades */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
          <div className="space-y-4">
            {(performanceData?.courses || dashboardData?.courses || []).slice(0, 5).map((course, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-medium">
                    {(course.courseName || course.name)?.[0] || 'C'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {course.courseName || course.name || 'Untitled Course'}
                  </p>
                  {course.letterGrade && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {course.letterGrade}
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.percentage?.toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {!course.letterGrade && course.instructor && (
                    <p className="text-xs text-gray-500">{course.instructor}</p>
                  )}
                </div>
                <button 
                  onClick={() => navigate(`/student/courses/${course.courseId || course.id}`)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiMessageSquare className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
            {(!performanceData?.courses && !dashboardData?.courses) || 
             ((performanceData?.courses?.length === 0) && (dashboardData?.courses?.length === 0)) ? (
              <p className="text-sm text-gray-500 text-center py-4">No courses enrolled yet</p>
            ) : null}
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
