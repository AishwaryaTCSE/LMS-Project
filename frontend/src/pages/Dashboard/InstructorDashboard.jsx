// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { 
//   FiUsers, 
//   FiBook, 
//   FiMessageSquare, 
//   FiBarChart2,
//   FiCalendar,
//   FiClock,
//   FiBell,
//   FiCheckCircle,
//   FiAlertTriangle,
//   FiPlus,
//   FiFileText,
//   FiDollarSign,
//   FiBookOpen,
//   FiTrendingUp,
//   FiChevronRight,
//   FiActivity,
//   FiAward,
//   FiFile,
//   FiLayers,
//   FiVideo
// } from 'react-icons/fi';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { 
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import { useQuery } from '@tanstack/react-query';
// import io from 'socket.io-client';
// import axios from '../../api/axiosInstance';
// import useAuth from '../../hooks/useAuth';
// import { useNotifications } from '../../context/NotificationContext';
// import StatCard from '../../components/StatsCard';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import ErrorMessage from '../../components/ErrorMessage';
// import { 
//   getInstructorDashboardStats, 
//   getInstructorRecentActivities, 
//   getInstructorUpcomingEvents 
// } from '../../api/dashboardApi';
// import { 
//   getCourses, 
//   getAssignments, 
//   getQuizzes, 
//   getSubmissions 
// } from '../../api/instructorApi';

// // Activity Item Component
// const ActivityItem = ({ activity }) => (
//   <div className="py-3 flex items-start">
//     <div className={`p-2 rounded-full ${activity.color} bg-opacity-20 mr-3`}>
//       {activity.icon}
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
//       <p className="text-xs text-gray-500 truncate">{activity.course}</p>
//       <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
//     </div>
//   </div>
// );

// // Event Item Component
// const EventItem = ({ event }) => {
//   const getEventIcon = () => {
//     switch (event.type) {
//       case 'class':
//         return <FiBookOpen className="h-4 w-4 text-blue-500" />;
//       case 'meeting':
//         return <FiUsers className="h-4 w-4 text-green-500" />;
//       case 'assignment':
//         return <FiFileText className="h-4 w-4 text-yellow-500" />;
//       default:
//         return <FiCalendar className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const getEventColor = () => {
//     switch (event.type) {
//       case 'class':
//         return 'bg-blue-100 text-blue-800';
//       case 'meeting':
//         return 'bg-green-100 text-green-800';
//       case 'assignment':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
//       <div className={`p-2 rounded-lg ${getEventColor()} mr-3`}>
//         {getEventIcon()}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
//         <div className="flex items-center text-xs text-gray-500 mt-1">
//           <FiClock className="mr-1" size={12} />
//           <span>{event.time}</span>
//         </div>
//         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getEventColor()}">
//           {event.date}
//         </span>
//       </div>
//     </div>
//   );
// };

// // Colors for charts
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// const InstructorDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { unreadMessageCount } = useNotifications();
//   const [socket, setSocket] = useState(null);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // Fetch dashboard data using React Query
//   const { 
//     data: stats, 
//     isLoading: statsLoading, 
//     error: statsError 
//   } = useQuery({
//     queryKey: ['dashboardStats'],
//     queryFn: getInstructorDashboardStats,
//     refetchOnWindowFocus: false,
//   });

//   const { 
//     data: activities, 
//     isLoading: activitiesLoading 
//   } = useQuery({
//     queryKey: ['recentActivities'],
//     queryFn: getInstructorRecentActivities
//   });

//   const { 
//     data: events, 
//     isLoading: eventsLoading 
//   } = useQuery({
//     queryKey: ['upcomingEvents'],
//     queryFn: getInstructorUpcomingEvents
//   });

//   const { 
//     data: coursesData, 
//     isLoading: coursesLoading 
//   } = useQuery({
//     queryKey: ['instructorCourses', user?._id],
//     queryFn: () => getCourses({ instructor: user?._id }),
//     enabled: !!user?._id
//   });

//   // Set up WebSocket connection for real-time updates
//   useEffect(() => {
//     const newSocket = io(import.meta.env.VITE_APP_API_URL);
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log('Connected to WebSocket');
//       newSocket.emit('joinInstructorRoom', user?._id);
//     });

//     newSocket.on('newSubmission', (data) => {
//       toast.info(`New submission received for ${data.assignmentTitle}`);
//       // Refetch data
//       queryClient.invalidateQueries('dashboardStats');
//     });

//     newSocket.on('newMessage', (data) => {
//       setUnreadCount(prev => prev + 1);
//       toast.info(`New message from ${data.senderName}`);
//     });

//     return () => newSocket.close();
//   }, [user?._id]);

//   // Sample data for charts
//   const coursePerformanceData = [
//     { name: 'Mathematics 101', students: 45, completion: 78, engagement: 82 },
//     { name: 'Science 201', students: 32, completion: 65, engagement: 71 },
//     { name: 'Physics 101', students: 28, completion: 81, engagement: 89 },
//     { name: 'Chemistry 101', students: 36, completion: 72, engagement: 75 },
//     { name: 'Biology 101', students: 29, completion: 68, engagement: 79 },
//   ];

//   // Sample recent activities data
//   const recentActivities = [
//     { 
//       id: 1, 
//       type: 'assignment', 
//       title: 'Assignment 1 graded', 
//       course: 'Mathematics 101', 
//       time: '2 hours ago',
//       icon: <FiBook className="text-blue-500" />,
//       color: 'bg-blue-100 text-blue-600'
//     },
//     { 
//       id: 2, 
//       type: 'message', 
//       title: 'New message from John Doe', 
//       course: 'Science 201', 
//       time: '5 hours ago',
//       icon: <FiMessageSquare className="text-green-500" />,
//       color: 'bg-green-100 text-green-600'
//     },
//     { 
//       id: 3, 
//       type: 'submission', 
//       title: 'New submission received', 
//       course: 'Physics 101', 
//       time: '1 day ago',
//       icon: <FiCheckCircle className="text-purple-500" />,
//       color: 'bg-purple-100 text-purple-600'
//     }
//   ];

//   // Sample upcoming events data
//   const upcomingEvents = [
//     { 
//       id: 1, 
//       title: 'Class: Advanced Calculus', 
//       time: '10:00 AM - 11:30 AM', 
//       date: 'Tomorrow',
//       type: 'class'
//     },
//     { 
//       id: 2, 
//       title: 'Faculty Meeting', 
//       time: '2:00 PM - 3:30 PM', 
//       date: 'Tomorrow',
//       type: 'meeting'
//     },
//     { 
//       id: 3, 
//       title: 'Assignment Due: Linear Algebra', 
//       time: '11:59 PM', 
//       date: 'In 2 days',
//       type: 'assignment'
//     }
//   ];

//   // Memoized stats cards data
//   const statsCards = useMemo(() => ([
//     { title: 'Total Students', value: stats ? String(stats.totalStudents || 0) : '0', change: '', icon: <FiUsers className="h-6 w-6" />, color: 'bg-blue-500' },
//     { title: 'Total Courses', value: stats ? String(stats.totalCourses || 0) : '0', change: '', icon: <FiBookOpen className="h-6 w-6" />, color: 'bg-green-500' },
//     { title: 'Messages', value: stats ? String(stats.unreadMessages || 0) : '0', change: 'unread', icon: <FiMessageSquare className="h-6 w-6" />, color: 'bg-purple-500' },
//     { title: 'Pending Tasks', value: stats ? String(stats.pendingTasks || 0) : '0', change: '', icon: <FiAlertTriangle className="h-6 w-6" />, color: 'bg-yellow-500' }
//   ]), [stats]);

//   if (statsLoading || activitiesLoading || eventsLoading || coursesLoading) {
//     return <LoadingSpinner />;
//   }

//   if (statsError) {
//     return <ErrorMessage message="Failed to load dashboard data" />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow">
//         <div className="px-4 py-6 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
//               <p className="mt-1 text-sm text-gray-500">Here's what's happening with your courses today.</p>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => navigate('/instructor/courses/new')}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 <FiPlus className="mr-2" />
//                 New Course
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
//             {statsCards.map((card, index) => (
//               <StatCard key={index} {...card} />
//             ))}
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-lg shadow p-6 mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-2 gap-3">
//               <Link 
//                 to="/instructor/courses/new" 
//                 className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mb-2">
//                   <FiPlus size={16} />
//                 </div>
//                 <span className="text-xs text-center font-medium text-gray-700">New Course</span>
//               </Link>
//               <Link 
//                 to="/instructor/assignments/new" 
//                 className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <div className="p-2 bg-green-100 rounded-full text-green-600 mb-2">
//                   <FiFileText size={16} />
//                 </div>
//                 <span className="text-xs text-center font-medium text-gray-700">New Assignment</span>
//               </Link>
//               <Link 
//                 to="/instructor/announcements/new" 
//                 className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <div className="p-2 bg-yellow-100 rounded-full text-yellow-600 mb-2">
//                   <FiBell size={16} />
//                 </div>
//                 <span className="text-xs text-center font-medium text-gray-700">New Announcement</span>
//               </Link>
//               <Link 
//                 to="/instructor/gradebook" 
//                 className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <div className="p-2 bg-purple-100 rounded-full text-purple-600 mb-2">
//                   <FiBarChart2 size={16} />
//                 </div>
//                 <span className="text-xs text-center font-medium text-gray-700">Gradebook</span>
//               </Link>
//             </div>
//           </div>
          
//           {/* Quick Stats */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-500">Course Completion</span>
//                 <span className="text-sm font-medium">78%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
//               </div>
              
//               <div className="flex justify-between items-center pt-2">
//                 <span className="text-sm text-gray-500">Student Engagement</span>
//                 <span className="text-sm font-medium">85%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
//               </div>
              
//               <div className="flex justify-between items-center pt-2">
//                 <span className="text-sm text-gray-500">Assignment Grading</span>
//                 <span className="text-sm font-medium">65%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstructorDashboard;
// src/pages/Instructor/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography,
  Toolbar, AppBar, CssBaseline, Divider, Paper, Grid, Card, CardContent, Button, Badge,
  CircularProgress, useTheme, useMediaQuery, Avatar, IconButton, styled, Snackbar, Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  Assignment as AssignmentsIcon,
  Quiz as QuizIcon,
  Grade as GradebookIcon,
  People as StudentsIcon,
  Analytics as AnalyticsIcon,
  Message as MessagesIcon,
  Notifications as NotificationsIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  // === MISSING ICON IMPORTS RESOLVED ===
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Event as EventIcon
  // =====================================
} from '@mui/icons-material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    }),
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/instructor' },
  { text: 'Courses', icon: <CoursesIcon />, path: '/instructor/courses' },
  { text: 'Assignments', icon: <AssignmentsIcon />, path: '/instructor/assignments' },
  { text: 'Quizzes', icon: <QuizIcon />, path: '/instructor/quizzes' },
  { text: 'Gradebook', icon: <GradebookIcon />, path: '/instructor/gradebook' },
  { text: 'Students', icon: <StudentsIcon />, path: '/instructor/students' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/instructor/analytics' },
  { text: 'Messages', icon: <MessagesIcon />, path: '/instructor/messages' },
];

const settingsMenu = [
  { text: 'Profile', icon: <ProfileIcon />, path: '/instructor/profile' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/instructor/settings' },
  { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
];

export default function InstructorDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    pendingAssignments: 0,
    recentActivities: [],
    upcomingDeadlines: []
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // NOTE: The API endpoint used here must match the backend route (e.g., '/api/v1/instructor/dashboard')
        // The previous error suggested the route was missing on the backend.
        const response = await axios.get('/api/v1/instructor/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // The axios.get in the original code was `/api/dashboard/instructor`, 
        // which did not align with the logged 404s of `/api/v1/instructor/stats`. 
        // I have replaced it with a generic instructor dashboard route '/api/v1/instructor/dashboard' 
        // to reflect best practices, assuming the backend is now properly mounted.
        setError('Failed to load dashboard data. Check API routes.');
        setSnackbar({
          open: true,
          message: 'Failed to load dashboard data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Force client-side logout anyway
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      setSnackbar({
        open: true,
        message: 'Error during logout, but logged out locally.',
        severity: 'warning'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    if (path === '/logout') {
      handleLogout();
    } else {
      navigate(path);
    }
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Instructor Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settingsMenu.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => navigate('/instructor/notifications')}
            >
              <Badge badgeContent={dashboardData.notificationsCount || 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => navigate('/instructor/profile')}
              sx={{ p: 0, ml: 1 }}
            >
              <Avatar
                alt={JSON.parse(localStorage.getItem('user'))?.name || 'User'}
                src={JSON.parse(localStorage.getItem('user'))?.avatar}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Main open={!isMobile}>
        <DrawerHeader />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
             {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Stats Grid */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                      <CoursesIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Courses
                      </Typography>
                      {/* === HARDCODED VALUE RESOLVED === */}
                      <Typography variant="h5">{dashboardData.totalCourses}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48 }}>
                      <StudentsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Students
                      </Typography>
                      {/* === HARDCODED VALUE RESOLVED === */}
                      <Typography variant="h5">{dashboardData.totalStudents}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Pending Grading
                      </Typography>
                      {/* Using pendingAssignments from state */}
                      <Typography variant="h5">{dashboardData.pendingAssignments}</Typography> 
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 48, height: 48 }}>
                      <StarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Avg. Rating
                      </Typography>
                      {/* Assuming avgRating might be in dashboardData */}
                      <Typography variant="h5">{dashboardData.avgRating || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Activities */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2}>
                <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Recent Activities</Typography>
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ChevronRightIcon />}
                    onClick={() => navigate('/instructor/activities')}
                  >
                    View All
                  </Button>
                </Box>
                <Divider />
                <Box p={2} textAlign="center">
                  {dashboardData.recentActivities.length > 0 ? (
                    <List>
                      {/* Render list items for activities here */}
                    </List>
                  ) : (
                    <Typography color="textSecondary">No recent activities</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ mb: 3 }}>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/instructor/courses/new')}
                    sx={{ mb: 2 }}
                  >
                    Create New Course
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<AssignmentsIcon />}
                    onClick={() => navigate('/instructor/assignments/new')}
                    sx={{ mb: 2 }}
                  >
                    Add Assignment
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<MessagesIcon />}
                    onClick={() => navigate('/instructor/messages')}
                  >
                    Check Messages
                  </Button>
                </Box>
              </Paper>

              {/* Upcoming Deadlines */}
              <Paper elevation={2}>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>Upcoming Deadlines</Typography>
                  <List>
                    {/* Placeholder content; should be populated by dashboardData.upcomingDeadlines */}
                    <ListItem>
                      <ListItemIcon><EventIcon color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Assignment 1 - Introduction"
                        secondary="Due: Tomorrow, 11:59 PM"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon><EventIcon color="secondary" /></ListItemIcon>
                      <ListItemText
                        primary="Midterm Exam"
                        secondary="Due: Next Monday, 9:00 AM"
                      />
                    </ListItem>
                  </List>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Main>
    </Box>
  );
}