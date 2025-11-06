import React, { useState, useEffect } from 'react';
import { 
  FiHome,
  FiUsers,
  FiUserPlus,
  FiBookOpen,
  FiBarChart2,
  FiDollarSign,
  FiSettings,
  FiShield,
  FiServer,
  FiDatabase,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiPieChart,
  FiActivity,
  FiMessageSquare,
  FiMail,
  FiLogOut,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiMenu,
  FiX,
  FiAward,
  FiCalendar,
  FiFileText,
  FiRefreshCw,
  FiFilter,
  FiExternalLink,
  FiMoreVertical
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getAnalyticsReport } from '../../api/analyticsApi';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New user registration requires approval', time: '30 minutes ago', read: false },
    { id: 2, message: 'System backup completed successfully', time: '2 hours ago', read: true },
    { id: 3, message: 'New course submission for review', time: '1 day ago', read: true },
  ]);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data - in a real app, this would come from an API
  const mockDashboardData = {
    stats: {
      totalUsers: 1245,
      activeUsers: 987,
      totalCourses: 87,
      activeCourses: 65,
      revenue: 45230,
      pendingApprovals: 12,
      systemHealth: 98.7,
    },
    recentActivities: [
      { id: 1, user: 'John Doe', action: 'created a new course', time: '10 minutes ago', type: 'course' },
      { id: 2, user: 'Jane Smith', action: 'updated profile information', time: '25 minutes ago', type: 'profile' },
      { id: 3, user: 'System', action: 'performed nightly backup', time: '2 hours ago', type: 'system' },
      { id: 4, user: 'Alex Johnson', action: 'submitted a support ticket', time: '3 hours ago', type: 'support' },
    ],
    pendingApprovals: [
      { id: 1, type: 'Instructor', title: 'Mark Wilson', user: 'mark.wilson@example.com', submitted: '2 days ago' },
      { id: 2, type: 'Course', title: 'Advanced React Patterns', user: 'sarah.johnson@example.com', submitted: '1 day ago' },
      { id: 3, type: 'Content', title: 'React Hooks Guide', user: 'mike.chen@example.com', submitted: '5 hours ago' },
    ],
    systemStatus: {
      cpu: 65,
      memory: 45,
      storage: 32,
      uptime: '99.98%',
      lastBackup: '2023-11-06 02:00:00',
      activeSessions: 156,
    },
    recentUsers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Instructor', status: 'active', joinDate: '2023-10-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'active', joinDate: '2023-11-01' },
      { id: 3, name: 'Alex Johnson', email: 'alex@example.com', role: 'Student', status: 'pending', joinDate: '2023-11-05' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Instructor', status: 'inactive', joinDate: '2023-09-20' },
    ],
    popularCourses: [
      { id: 1, title: 'Web Development Bootcamp', students: 245, revenue: 12250 },
      { id: 2, title: 'Data Science Fundamentals', students: 189, revenue: 9450 },
      { id: 3, title: 'Mobile App Development', students: 156, revenue: 7800 },
    ],
  };

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome, current: true },
    { name: 'Users', href: '/admin/users', icon: FiUsers, count: 12, current: false },
    { name: 'Courses', href: '/admin/courses', icon: FiBookOpen, current: false },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2, current: false },
    { name: 'Billing', href: '/admin/billing', icon: FiDollarSign, current: false },
    { name: 'System', href: '/admin/system', icon: FiServer, current: false },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings, current: false },
  ];

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  // Toggle notification read status
  const toggleNotificationRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: !notification.read } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // In a real app, you would fetch data for the selected tab
    console.log('Switched to tab:', tab);
  };

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New user registration requires approval', time: '30 minutes ago', read: false },
    { id: 2, message: 'System backup completed successfully', time: '2 hours ago', read: false },
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome, current: location.pathname === '/admin/dashboard' },
    { name: 'Users', href: '/admin/users', icon: FiUsers, current: location.pathname.startsWith('/admin/users') },
    { name: 'Courses', href: '/admin/courses', icon: FiBookOpen, current: location.pathname.startsWith('/admin/courses') },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2, current: location.pathname.startsWith('/admin/analytics') },
    { name: 'Billing', href: '/admin/billing', icon: FiDollarSign, current: location.pathname.startsWith('/admin/billing') },
    { name: 'System', href: '/admin/system', icon: FiServer, current: location.pathname.startsWith('/admin/system') },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings, current: location.pathname.startsWith('/admin/settings') },
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setDashboardData({
            totalUsers: 1245,
            activeUsers: 987,
            totalCourses: 87,
            activeCourses: 65,
            revenue: 45230,
            pendingApprovals: 12,
            systemHealth: 98.7,
            recentActivities: [
              { id: 1, user: 'John Doe', action: 'created a new course', time: '10 minutes ago', type: 'course' },
              { id: 2, user: 'Jane Smith', action: 'updated profile information', time: '25 minutes ago', type: 'profile' },
              { id: 3, user: 'System', action: 'performed nightly backup', time: '2 hours ago', type: 'system' },
              { id: 4, user: 'Alex Johnson', action: 'submitted a support ticket', time: '3 hours ago', type: 'support' },
            ],
            userStats: {
              total: 1245,
              active: 987,
              newThisMonth: 145,
              inactive: 258,
              growth: 12.5
            },
            courseStats: {
              total: 87,
              published: 65,
              draft: 12,
              archived: 10,
              popularCourses: [
                { id: 1, name: 'Web Development Bootcamp', students: 245, revenue: 12250 },
                { id: 2, name: 'Data Science Fundamentals', students: 189, revenue: 9450 },
                { id: 3, name: 'Mobile App Development', students: 156, revenue: 7800 },
              ]
            },
            systemStatus: {
              cpu: 42,
              memory: 68,
              storage: 45,
              uptime: '99.98%',
              lastBackup: '2023-11-06 02:00:00',
              activeSessions: 342
            },
            recentUsers: [
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Instructor', status: 'active', joinDate: '2023-10-15' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'active', joinDate: '2023-11-01' },
              { id: 3, name: 'Alex Johnson', email: 'alex@example.com', role: 'Student', status: 'pending', joinDate: '2023-11-05' },
              { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Instructor', status: 'inactive', joinDate: '2023-09-20' },
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  const [dashboardData, setDashboardData] = useState({
    users: [],
    courses: [],
    analytics: {},
    systemHealth: {},
    systemSettings: {},
    auditLogs: [],
    systemLogs: [],
    stats: {},
    systemStats: { cpu: 0, memory: 0, storage: 0, uptime: '—', activeSessions: 0, responseTime: '—' },
    recentActivities: [],
    pendingApprovals: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    dateRange: 'all',
    logLevel: 'all'
  });
  const [isRealTime, setIsRealTime] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [currentPage, setCurrentPage] = useState({
    users: 1,
    courses: 1,
    logs: 1
  });
  const itemsPerPage = 10;
  
  // WebSocket reference
  const ws = useRef(null);

  // WebSocket setup
  const setupWebSocket = useCallback((onMessage) => {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = `${protocol}${window.location.host}/ws/admin`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      // Send authentication token if available
      const token = localStorage.getItem('token');
      if (token) {
        socket.send(JSON.stringify({ type: 'auth', token }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after a delay if still mounted
      if (isRealTime) {
        setTimeout(() => setupWebSocket(onMessage), 5000);
      }
    };

    return () => {
      socket.close();
    };
  }, [isRealTime]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    switch (data.type) {
      case 'stats_update':
        setDashboardData(prev => ({
          ...prev,
          stats: { ...prev.stats, ...data.payload }
        }));
        break;
      case 'user_activity':
        // Update user activity in real-time
        setDashboardData(prev => ({
          ...prev,
          recentActivities: [
            data.payload,
            ...prev.recentActivities.slice(0, 49) // Keep last 50 activities
          ]
        }));
        break;
      case 'system_alert':
        toast.warning(`System Alert: ${data.message}`, {
          autoClose: 10000,
          position: 'top-right'
        });
        break;
      default:
        break;
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        stats,
        usersData,
        coursesData,
        analyticsData,
        systemHealth,
        systemSettings,
        auditLogs,
        systemLogs
      ] = await Promise.all([
        getDashboardStats(),
        getUsers({ page: currentPage.users, limit: itemsPerPage }),
        getCourses({ page: currentPage.courses, limit: itemsPerPage }),
        getAnalytics({ timeRange }),
        getSystemHealth(),
        getSystemSettings(),
        getAuditLogs({ page: currentPage.logs, limit: itemsPerPage }),
        getSystemLogs({ level: filters.logLevel })
      ]);

      setDashboardData(prev => ({
        ...prev,
        stats,
        users: usersData.users || [],
        courses: coursesData.courses || [],
        analytics: analyticsData,
        systemHealth,
        systemStats: systemHealth || prev.systemStats,
        systemSettings,
        auditLogs: auditLogs.logs || [],
        systemLogs: systemLogs.logs || [],
        pagination: {
          users: usersData.pagination,
          courses: coursesData.pagination,
          logs: auditLogs.pagination
        }
      }));
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [timeRange, currentPage, filters.logLevel, itemsPerPage]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isRealTime) {
      ws.current = setupWebSocket(handleWebSocketMessage);
    }
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [isRealTime, setupWebSocket, handleWebSocketMessage]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetchDashboardData]);

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(prev => ({
      ...prev,
      [tab]: 1 // Reset to first page when changing tabs
    }));
  };

  // Handle pagination
  const handlePageChange = (tab, page) => {
    setCurrentPage(prev => ({
      ...prev,
      [tab]: page
    }));
  };

  // Toggle log expansion
  const toggleLogExpansion = (logId) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  // Handle bulk actions
  const handleBulkAction = async (action, itemType) => {
    if (selectedItems.length === 0) {
      toast.warning('Please select at least one item');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (itemType === 'user') {
        response = await bulkUpdateUsers(selectedItems, { action });
      } else if (itemType === 'course') {
        response = await bulkUpdateCourses(selectedItems, { action });
      }

      toast.success(`Successfully ${action}ed ${selectedItems.length} ${itemType}(s)`);
      setSelectedItems([]);
      fetchDashboardData();
    } catch (err) {
      console.error(`Error performing bulk ${action}:`, err);
      toast.error(`Failed to ${action} selected items`);
    } finally {
      setLoading(false);
    }
  };

  // Handle data export
  const handleExport = async (type) => {
    try {
      setLoading(true);
      const data = await exportData(type, { format: 'csv' });
      
      // Create download link
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success(`Successfully exported ${type} data`);
    } catch (err) {
      console.error('Error exporting data:', err);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const getFilteredUsers = () => {
    return dashboardData.users.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const getFilteredCourses = () => {
    return dashboardData.courses.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || course.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredLogs = () => {
    return dashboardData.systemLogs.filter(log => {
      const matchesSearch = searchQuery === '' || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = filters.logLevel === 'all' || log.level === filters.logLevel;
      
      return matchesSearch && matchesLevel;
    });
  };


  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  const stats = [
    { 
      title: 'Total Students', 
      value: dashboardData.stats.totalStudents ?? 0, 
      icon: <FiUsers className="w-6 h-6" />,
      change: '+12% from last month',
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Active Instructors', 
      value: dashboardData.stats.activeInstructors ?? 0, 
      icon: <FiUser className="w-6 h-6" />,
      change: '+3 this month',
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Total Courses', 
      value: dashboardData.stats.totalCourses ?? 0, 
      icon: <FiBookOpen className="w-6 h-6" />,
      change: '8 new this month',
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      title: 'Total Revenue', 
      value: `$${Number(dashboardData.stats.totalRevenue ?? 0).toLocaleString()}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      change: '18% from last month',
      color: 'bg-amber-100 text-amber-600'
    },
    { 
      title: 'Active Users', 
      value: dashboardData.stats.activeUsers ?? 0, 
      icon: <FiActivity className="w-6 h-6" />,
      change: '24% increase',
      color: 'bg-emerald-100 text-emerald-600'
    },
    { 
      title: 'System Health', 
      value: `${dashboardData.stats.systemHealth ?? 100}%`, 
      icon: <FiServer className="w-6 h-6" />,
      change: 'Stable',
      color: 'bg-green-100 text-green-600'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-300 text-sm mt-1">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
                  <FiBell className="w-6 h-6" />
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                </button>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="font-medium text-white">AD</span>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-6 mt-6 border-b border-gray-700">
            {['Overview', 'Users', 'Courses', 'Analytics', 'Settings', 'System'].map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-1 font-medium text-sm ${
                  activeTab === tab.toLowerCase() 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              colorClass={stat.color}
            />
          ))}
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
                <select 
                  className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="day">Last 24 hours</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                      <FiServer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CPU Usage</p>
                      <p className="text-lg font-semibold">{dashboardData.systemStats.cpu}%</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        dashboardData.systemStats.cpu > 80 ? 'bg-red-500' : 
                        dashboardData.systemStats.cpu > 60 ? 'bg-amber-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${dashboardData.systemStats.cpu}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                      <FiServer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Memory</p>
                      <p className="text-lg font-semibold">{dashboardData.systemStats.memory}%</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        dashboardData.systemStats.memory > 80 ? 'bg-red-500' : 
                        dashboardData.systemStats.memory > 60 ? 'bg-amber-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${dashboardData.systemStats.memory}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                      <FiServer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Storage</p>
                      <p className="text-lg font-semibold">{dashboardData.systemStats.storage}%</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        dashboardData.systemStats.storage > 80 ? 'bg-red-500' : 
                        dashboardData.systemStats.storage > 60 ? 'bg-amber-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${dashboardData.systemStats.storage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                      <FiActivity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Uptime</p>
                      <p className="text-lg font-semibold">{dashboardData.systemStats.uptime}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600 mr-3">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Sessions</p>
                      <p className="text-lg font-semibold">{dashboardData.systemStats.activeSessions}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mr-3">
                      <FiClock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Response Time</p>
                      <p className="text-lg font-semibold">{dashboardData.systemStats.responseTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                <Link to="/analytics/reports" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  View All
                </Link>
              </div>
              <ul className="divide-y divide-gray-100">
                {dashboardData.recentActivities.map((activity) => (
                  <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'course' ? (
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <FiBookOpen className="w-4 h-4" />
                          </div>
                        ) : activity.type === 'profile' ? (
                          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                            <FiUser className="w-4 h-4" />
                          </div>
                        ) : activity.type === 'system' ? (
                          <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                            <FiServer className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-green-100 text-green-600">
                            <FiAward className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800">
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {dashboardData.pendingApprovals.map((item) => (
                  <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                          {item.type === 'Instructor' ? (
                            <FiUserCheck className="w-4 h-4" />
                          ) : item.type === 'Course' ? (
                            <FiBookOpen className="w-4 h-4" />
                          ) : (
                            <FiFileText className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">{item.type}</span> • {item.user}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Submitted {item.submitted}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-full">
                            <FiCheck className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-full">
                          <FiUserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-3 bg-gray-50 text-center">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  View all pending requests
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <button className="p-2 rounded hover:bg-gray-50" onClick={()=> setQuickMenuOpen(v=> !v)} aria-label="More actions">
                  <FiMoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {quickMenuOpen && (
                <div className="px-4 pt-2">
                  <div className="border rounded-lg divide-y">
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Add New User</button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Create Course</button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">System Settings</button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Security Settings</button>
                  </div>
                </div>
              )}
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Add New User</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                      <FiBookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Create Course</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600 mr-3">
                      <FiSettings className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">System Settings</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-red-100 text-red-600 mr-3">
                      <FiShield className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Security Settings</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
              </div>
              <div className="p-4">
                <div className="p-4 bg-green-50 rounded-lg mb-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiCheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">System Update Available</h3>
                      <p className="text-xs text-green-700 mt-1">Version 2.5.0 is ready to install</p>
                      <div className="mt-2">
                        <button className="text-xs font-medium text-green-700 hover:text-green-600">
                          Update Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Storage Warning</h3>
                      <p className="text-xs text-amber-700 mt-1">85% of storage used. Consider upgrading.</p>
                      <div className="mt-2">
                        <button className="text-xs font-medium text-amber-700 hover:text-amber-600">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm w-64"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="text-sm border border-gray-200 rounded-md px-3 py-2"
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  className="text-sm border border-gray-200 rounded-md px-3 py-2"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('activate', 'user')} className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50">Activate</button>
                <button onClick={() => handleBulkAction('suspend', 'user')} className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50">Suspend</button>
                <button onClick={() => handleExport('users')} className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"><FiDownload /> Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 px-3"><input type="checkbox" onChange={(e) => {
                      if (e.target.checked) setSelectedItems(getFilteredUsers().map(u => u.id)); else setSelectedItems([]);
                    }} /></th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredUsers().map(user => (
                    <tr key={user.id} className="border-t">
                      <td className="py-2 px-3"><input type="checkbox" checked={selectedItems.includes(user.id)} onChange={(e)=>{
                        setSelectedItems(prev => e.target.checked ? [...prev, user.id] : prev.filter(id => id !== user.id));
                      }} /></td>
                      <td className="py-2 px-3">{user.name}</td>
                      <td className="py-2 px-3">{user.email}</td>
                      <td className="py-2 px-3 capitalize">{user.role}</td>
                      <td className="py-2 px-3"><span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{user.status}</span></td>
                      <td className="py-2 px-3 text-right">
                        <button onClick={async()=>{ await updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active'); fetchDashboardData(); }} className="text-indigo-600 hover:text-indigo-800 text-sm">{user.status === 'active' ? 'Suspend' : 'Activate'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm w-64"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="text-sm border border-gray-200 rounded-md px-3 py-2"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('publish', 'course')} className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50">Publish</button>
                <button onClick={() => handleBulkAction('unpublish', 'course')} className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50">Unpublish</button>
                <button onClick={() => handleExport('courses')} className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"><FiDownload /> Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 px-3"><input type="checkbox" onChange={(e) => {
                      if (e.target.checked) setSelectedItems(getFilteredCourses().map(c => c.id)); else setSelectedItems([]);
                    }} /></th>
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Instructor</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredCourses().map(course => (
                    <tr key={course.id} className="border-t">
                      <td className="py-2 px-3"><input type="checkbox" checked={selectedItems.includes(course.id)} onChange={(e)=>{
                        setSelectedItems(prev => e.target.checked ? [...prev, course.id] : prev.filter(id => id !== course.id));
                      }} /></td>
                      <td className="py-2 px-3">{course.title}</td>
                      <td className="py-2 px-3">{course.instructor}</td>
                      <td className="py-2 px-3"><span className={`px-2 py-1 rounded-full text-xs ${course.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>{course.status}</span></td>
                      <td className="py-2 px-3 text-right">
                        <button onClick={async()=>{ await updateCourseStatus(course.id, course.status === 'published' ? 'draft' : 'published'); fetchDashboardData(); }} className="text-indigo-600 hover:text-indigo-800 text-sm">{course.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
              <Line data={dashboardData.analytics.userGrowth || { labels: [], datasets: [] }} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Engagement</h2>
              <Bar data={dashboardData.analytics.courseEngagement || { labels: [], datasets: [] }} />
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <select
                className="text-sm border border-gray-200 rounded-md px-3 py-2"
                value={filters.logLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, logLevel: e.target.value }))}
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
              </select>
              <div className="relative">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  className="pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm w-64"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={() => handleExport('logs')} className="ml-auto px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1"><FiDownload /> Export</button>
            </div>
            <div className="divide-y">
              {getFilteredLogs().map((log) => (
                <div key={log.id} className="py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(log.level)}`}>{log.level}</span>
                      <span className="text-gray-900">{log.message}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Real-time Updates</h2>
                <p className="text-sm text-gray-500">Receive live updates via WebSockets</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" checked={isRealTime} onChange={(e)=> setIsRealTime(e.target.checked)} />
                <span className="mr-2 text-sm">Off</span>
                <div className={`w-10 h-5 rounded-full ${isRealTime ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <span className="ml-2 text-sm">On</span>
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
