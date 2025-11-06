import React, { useEffect, useMemo, useState } from 'react';
import { 
  FiTrendingUp,
  FiUsers,
  FiMessageSquare,
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiFileText,
  FiBell
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import CourseProgressChart from '../../components/Charts/CourseProgressChart';
import { listStudents } from '../../api/studentApi';
import * as courseApi from '../../api/courseApi';
import { useNotifications } from '../../context/NotificationContext';

const InstructorDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState({ totalStudents: 0, activeCourses: 0, unreadMessages: 0, earnings: 0 });
  const { unreadMessageCount } = useNotifications();
  const navigate = useNavigate();
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [{ items: students = [], pagination }, courses] = await Promise.all([
          listStudents({ page: 1, limit: 1 }),
          courseApi.getCourses()
        ]);
        setKpis({
          totalStudents: pagination?.total || students.length || 0,
          activeCourses: Array.isArray(courses?.data) ? courses.data.length : Array.isArray(courses) ? courses.length : 0,
          unreadMessages: unreadMessageCount || 0,
          earnings: 0
        });
        setError('');
      } catch (e) {
        setError(e.message || 'Failed to load KPIs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [unreadMessageCount]);

  const stats = useMemo(() => ([
    { title: 'Total Students', value: String(kpis.totalStudents), change: '', icon: <FiUsers className="h-6 w-6" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Courses', value: String(kpis.activeCourses), change: '', icon: <FiBookOpen className="h-6 w-6" />, color: 'bg-green-100 text-green-600' },
    { title: 'Messages', value: String(kpis.unreadMessages), change: 'unread', icon: <FiMessageSquare className="h-6 w-6" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Earnings', value: `$${kpis.earnings}`, change: '', icon: <FiBarChart2 className="h-6 w-6" />, color: 'bg-yellow-100 text-yellow-600' }
  ]), [kpis]);
  
  // Mock recent activities
  const recentActivities = [
    { 
      id: 1, 
      title: 'New assignment submitted', 
      course: 'Web Development', 
      time: '2 hours ago', 
      type: 'submission' 
    },
    { 
      id: 2, 
      title: 'Course updated', 
      course: 'React Fundamentals', 
      time: '5 hours ago', 
      type: 'update' 
    },
    { 
      id: 3, 
      title: 'New student enrolled', 
      course: 'JavaScript Basics', 
      time: '1 day ago', 
      type: 'enrollment' 
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200 max-w-3xl mx-auto my-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error loading dashboard</h3>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Instructor</h1>
        <p className="mt-1 text-sm text-gray-500">Here's what's happening with your courses today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Courses & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
                <Link
                  to="/instructor/courses"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <CourseProgressChart />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Create New Assignment</span>
                </div>
                <FiArrowRight className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Grade Submissions</span>
                </div>
                <FiArrowRight className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                    <FiMessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">View Student Messages</span>
                </div>
                <FiArrowRight className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              View All
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <li 
                key={activity.id} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-gray-400">
                    <FiBell className="h-5 w-5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
