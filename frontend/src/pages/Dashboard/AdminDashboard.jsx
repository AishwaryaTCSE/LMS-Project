import React, { useState, useEffect } from 'react';
import { 
  FiUsers,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiActivity,
  FiTrendingUp,
  FiServer,
  FiMessageSquare
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import Loader from '../../components/Loader';
import useAuth from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { message } from 'antd';

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

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const [
        usersResponse,
        coursesResponse,
        dashboardResponse,
        activitiesResponse,
        analyticsResponse
      ] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/admin/stats/users', config),
        axios.get('http://localhost:5000/api/v1/admin/stats/courses', config),
        axios.get('http://localhost:5000/api/v1/admin/dashboard', config),
        axios.get('http://localhost:5000/api/v1/admin/activities', config),
        axios.get('http://localhost:5000/api/v1/admin/analytics', config)
      ]);

      setDashboardData({
        stats: {
          totalStudents: usersResponse.data.data?.totalStudents || 0,
          activeInstructors: usersResponse.data.data?.totalInstructors || 0,
          totalCourses: coursesResponse.data.data?.totalCourses || 0,
          activeCourses: coursesResponse.data.data?.activeCourses || 0,
          totalRevenue: coursesResponse.data.data?.totalRevenue || 0
        },
        systemStats: dashboardResponse.data.data?.systemStats || { cpu: 0, memory: 0, storage: 0 },
        recentUsers: dashboardResponse.data.data?.recentUsers || [],
        recentActivities: activitiesResponse.data.data || [],
        analytics: dashboardResponse.data.data?.analytics || { userGrowth: [], courseEngagement: [] }
      });
      
      setError('');
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      message.error('Failed to load dashboard data');
      
      // Set default values on error
      setDashboardData({
        stats: {
          totalStudents: 0,
          activeInstructors: 0,
          totalCourses: 0,
          activeCourses: 0,
          totalRevenue: 0
        },
        systemStats: { cpu: 0, memory: 0, storage: 0 },
        recentUsers: [],
        recentActivities: [],
        analytics: { userGrowth: [], courseEngagement: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pollInterval = setInterval(fetchDashboardData, 30000);
    fetchDashboardData();

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

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
            onClick={fetchDashboardData}
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
      title: 'Total Students', 
      value: dashboardData?.stats?.totalStudents || 0, 
      icon: <FiUsers className="w-8 h-8" />,
      color: 'bg-purple-500',
      path: '/admin/students'
    },
    { 
      title: 'Active Instructors', 
      value: dashboardData?.stats?.activeInstructors || 0, 
      icon: <FiUser className="w-8 h-8" />,
      color: 'bg-orange-500',
      path: '/admin/instructors'
    },
    { 
      title: 'Total Courses', 
      value: dashboardData?.stats?.totalCourses || 0, 
      icon: <FiFileText className="w-8 h-8" />,
      color: 'bg-yellow-500',
      path: '/admin/courses'
    },
    { 
      title: 'Total Revenue', 
      value: `$${((dashboardData?.stats?.totalRevenue || 0) / 1000).toFixed(0)}k`, 
      icon: <FiDollarSign className="w-8 h-8" />,
      color: 'bg-blue-600',
      path: '/admin/analytics'
    }
  ];

  const CalendarWidget = () => {
    const [currentDate] = useState(new Date());
    const month = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">{month}</p>
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center py-1 font-medium">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={`text-center py-2 text-sm transition-colors ${
                day 
                  ? 'hover:bg-gray-100 cursor-pointer rounded' 
                  : ''
              } ${
                day === today && 
                currentDate.getMonth() === currentMonth && 
                currentDate.getFullYear() === currentYear
                  ? 'bg-purple-500 text-white rounded-full font-semibold' 
                  : day 
                    ? 'text-gray-700' 
                    : 'text-gray-300'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const UserGrowthChart = () => {
    const userGrowth = dashboardData?.analytics?.userGrowth || [];
    
    if (userGrowth.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#9333ea" 
              strokeWidth={2}
              dot={{ fill: '#9333ea', r: 4 }}
              name="Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.firstName || 'Admin'}!
        </h1>
        <p className="text-purple-100">System overview and management</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.color} rounded-lg p-6 text-white flex items-center gap-4 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
            onClick={() => navigate(stat.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(stat.path)}
          >
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <CalendarWidget />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-4">
            {(dashboardData?.recentUsers || []).slice(0, 5).map((user) => (
              <motion.div 
                key={user.id || user._id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => navigate(`/admin/users?view=${user.id || user._id}`)}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-medium">
                    {user.name?.[0] || user.firstName?.[0] || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/users?view=${user.id || user._id}`);
                  }}
                >
                  <FiMessageSquare className="w-4 h-4 text-gray-600" />
                </button>
              </motion.div>
            ))}
            {(!dashboardData?.recentUsers || dashboardData.recentUsers.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No recent users</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/admin/users')}
            className="mt-4 w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            View All Users
          </button>
        </motion.div>

        {/* System Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiServer className="mr-2" /> System Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="text-sm font-semibold">{dashboardData?.systemStats?.cpu || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dashboardData?.systemStats?.cpu || 0}%` }}
                  transition={{ duration: 1 }}
                  className={`h-2 rounded-full ${
                    (dashboardData?.systemStats?.cpu || 0) > 80 ? 'bg-red-500' : 
                    (dashboardData?.systemStats?.cpu || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                ></motion.div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Memory</span>
                <span className="text-sm font-semibold">{dashboardData?.systemStats?.memory || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dashboardData?.systemStats?.memory || 0}%` }}
                  transition={{ duration: 1 }}
                  className={`h-2 rounded-full ${
                    (dashboardData?.systemStats?.memory || 0) > 80 ? 'bg-red-500' : 
                    (dashboardData?.systemStats?.memory || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                ></motion.div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-semibold">{dashboardData?.systemStats?.storage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dashboardData?.systemStats?.storage || 0}%` }}
                  transition={{ duration: 1 }}
                  className={`h-2 rounded-full ${
                    (dashboardData?.systemStats?.storage || 0) > 80 ? 'bg-red-500' : 
                    (dashboardData?.systemStats?.storage || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {(dashboardData?.recentActivities || []).slice(0, 5).map((activity) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiActivity className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time ? formatDistanceToNow(activity.time) : 'Recently'}
                  </p>
                </div>
              </motion.div>
            ))}
            {(!dashboardData?.recentActivities || dashboardData.recentActivities.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
