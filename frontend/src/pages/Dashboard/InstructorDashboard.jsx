import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  FiUsers, 
  FiBook, 
  FiMessageSquare, 
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiBell,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlus,
  FiFileText,
  FiDollarSign,
  FiBookOpen,
  FiTrendingUp,
  FiChevronRight,
  FiActivity,
  FiAward,
  FiFile,
  FiLayers,
  FiVideo
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import io from 'socket.io-client';
import axios from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import StatCard from '../../components/StatsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { 
  getInstructorDashboardStats, 
  getInstructorRecentActivities, 
  getInstructorUpcomingEvents 
} from '../../api/dashboardApi';
import { 
  getCourses, 
  getAssignments, 
  getQuizzes, 
  getSubmissions 
} from '../../api/instructorApi';

// Activity Item Component
const ActivityItem = ({ activity }) => (
  <div className="py-3 flex items-start">
    <div className={`p-2 rounded-full ${activity.color} bg-opacity-20 mr-3`}>
      {activity.icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
      <p className="text-xs text-gray-500 truncate">{activity.course}</p>
      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
    </div>
  </div>
);

// Event Item Component
const EventItem = ({ event }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'class':
        return <FiBookOpen className="h-4 w-4 text-blue-500" />;
      case 'meeting':
        return <FiUsers className="h-4 w-4 text-green-500" />;
      case 'assignment':
        return <FiFileText className="h-4 w-4 text-yellow-500" />;
      default:
        return <FiCalendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case 'class':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'assignment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${getEventColor()} mr-3`}>
        {getEventIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <FiClock className="mr-1" size={12} />
          <span>{event.time}</span>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getEventColor()}">
          {event.date}
        </span>
      </div>
    </div>
  );
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { unreadMessageCount } = useNotifications();
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch dashboard data using React Query
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getInstructorDashboardStats,
    refetchOnWindowFocus: false,
  });

  const { 
    data: activities, 
    isLoading: activitiesLoading 
  } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: getInstructorRecentActivities
  });

  const { 
    data: events, 
    isLoading: eventsLoading 
  } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: getInstructorUpcomingEvents
  });

  const { 
    data: coursesData, 
    isLoading: coursesLoading 
  } = useQuery({
    queryKey: ['instructorCourses', user?._id],
    queryFn: () => getCourses({ instructor: user?._id }),
    enabled: !!user?._id
  });

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_APP_API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('joinInstructorRoom', user?._id);
    });

    newSocket.on('newSubmission', (data) => {
      toast.info(`New submission received for ${data.assignmentTitle}`);
      // Refetch data
      queryClient.invalidateQueries('dashboardStats');
    });

    newSocket.on('newMessage', (data) => {
      setUnreadCount(prev => prev + 1);
      toast.info(`New message from ${data.senderName}`);
    });

    return () => newSocket.close();
  }, [user?._id]);

  // Sample data for charts
  const coursePerformanceData = [
    { name: 'Mathematics 101', students: 45, completion: 78, engagement: 82 },
    { name: 'Science 201', students: 32, completion: 65, engagement: 71 },
    { name: 'Physics 101', students: 28, completion: 81, engagement: 89 },
    { name: 'Chemistry 101', students: 36, completion: 72, engagement: 75 },
    { name: 'Biology 101', students: 29, completion: 68, engagement: 79 },
  ];

  // Sample recent activities data
  const recentActivities = [
    { 
      id: 1, 
      type: 'assignment', 
      title: 'Assignment 1 graded', 
      course: 'Mathematics 101', 
      time: '2 hours ago',
      icon: <FiBook className="text-blue-500" />,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      id: 2, 
      type: 'message', 
      title: 'New message from John Doe', 
      course: 'Science 201', 
      time: '5 hours ago',
      icon: <FiMessageSquare className="text-green-500" />,
      color: 'bg-green-100 text-green-600'
    },
    { 
      id: 3, 
      type: 'submission', 
      title: 'New submission received', 
      course: 'Physics 101', 
      time: '1 day ago',
      icon: <FiCheckCircle className="text-purple-500" />,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Sample upcoming events data
  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Class: Advanced Calculus', 
      time: '10:00 AM - 11:30 AM', 
      date: 'Tomorrow',
      type: 'class'
    },
    { 
      id: 2, 
      title: 'Faculty Meeting', 
      time: '2:00 PM - 3:30 PM', 
      date: 'Tomorrow',
      type: 'meeting'
    },
    { 
      id: 3, 
      title: 'Assignment Due: Linear Algebra', 
      time: '11:59 PM', 
      date: 'In 2 days',
      type: 'assignment'
    }
  ];

  // Memoized stats cards data
  const statsCards = useMemo(() => ([
    { title: 'Total Students', value: stats ? String(stats.totalStudents || 0) : '0', change: '', icon: <FiUsers className="h-6 w-6" />, color: 'bg-blue-500' },
    { title: 'Total Courses', value: stats ? String(stats.totalCourses || 0) : '0', change: '', icon: <FiBookOpen className="h-6 w-6" />, color: 'bg-green-500' },
    { title: 'Messages', value: stats ? String(stats.unreadMessages || 0) : '0', change: 'unread', icon: <FiMessageSquare className="h-6 w-6" />, color: 'bg-purple-500' },
    { title: 'Pending Tasks', value: stats ? String(stats.pendingTasks || 0) : '0', change: '', icon: <FiAlertTriangle className="h-6 w-6" />, color: 'bg-yellow-500' }
  ]), [stats]);

  if (statsLoading || activitiesLoading || eventsLoading || coursesLoading) {
    return <LoadingSpinner />;
  }

  if (statsError) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
              <p className="mt-1 text-sm text-gray-500">Here's what's happening with your courses today.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/instructor/courses/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="mr-2" />
                New Course
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {statsCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/instructor/courses/new" 
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mb-2">
                  <FiPlus size={16} />
                </div>
                <span className="text-xs text-center font-medium text-gray-700">New Course</span>
              </Link>
              <Link 
                to="/instructor/assignments/new" 
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-full text-green-600 mb-2">
                  <FiFileText size={16} />
                </div>
                <span className="text-xs text-center font-medium text-gray-700">New Assignment</span>
              </Link>
              <Link 
                to="/instructor/announcements/new" 
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600 mb-2">
                  <FiBell size={16} />
                </div>
                <span className="text-xs text-center font-medium text-gray-700">New Announcement</span>
              </Link>
              <Link 
                to="/instructor/gradebook" 
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-full text-purple-600 mb-2">
                  <FiBarChart2 size={16} />
                </div>
                <span className="text-xs text-center font-medium text-gray-700">Gradebook</span>
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Course Completion</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">Student Engagement</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">Assignment Grading</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
