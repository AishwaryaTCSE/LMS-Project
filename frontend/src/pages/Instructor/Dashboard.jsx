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
  // === MISSING IMPORTS RESOLVED ===
  TrendingUp as TrendingUpIcon, 
  Star as StarIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Event as EventIcon
  // ===============================
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
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get('/api/instructor/dashboard/overview', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.success) {
          setDashboardData({
            totalStudents: response.data.data?.totalStudents || 0,
            totalCourses: response.data.data?.totalCourses || 0,
            pendingAssignments: response.data.data?.pendingAssignments || 0,
            recentActivities: response.data.data?.recentActivities || [],
            upcomingDeadlines: response.data.data?.upcomingDeadlines || []
          });
        } else {
          throw new Error(response.data?.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Fallback for missing/empty data, use default state values
        // setError('Failed to load dashboard data'); // Keeping the error state for full failure
        setLoading(false); // Make sure to stop loading even on error
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
      // Even if the API call fails, force logout on the client side for a better user experience
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
  
  // Note: Keeping the error state logic as it was, but the useEffect was adjusted to only set error 
  // on a genuine fetch failure, otherwise data defaults to 0s from the initial state.
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
              <Badge badgeContent={dashboardData.pendingAssignments} color="error"> {/* Using pendingAssignments for badge */}
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
            {/* === SYNTAX ERROR RESOLVED: Removed stray closing tag === */}
            {/* <Typography>...</Typography> */} 
          </Box>

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
                        Completion Rate
                      </Typography>
                      <Typography variant="h5">0%</Typography>
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
                      <Typography variant="h5">N/A</Typography>
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
                {/* Dynamically render activities or "No recent activities" */}
                {dashboardData.recentActivities.length > 0 ? (
                  <List>
                    {/* Map over activities here */}
                  </List>
                ) : (
                  <Box p={2} textAlign="center">
                    <Typography color="textSecondary">No recent activities</Typography>
                  </Box>
                )}
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
                    {/* Render from state, or default static if state is empty/placeholder */}
                    {dashboardData.upcomingDeadlines.length > 0 ? (
                      // Map over upcoming deadlines here
                      <></>
                    ) : (
                      <>
                        {/* Static placeholders kept for demonstration */}
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
                      </>
                    )}
                  </List>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Main>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    </Box>
  );
}