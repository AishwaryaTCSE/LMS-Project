import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    enrollments: [],
    courseStats: [],
    studentEngagement: [],
    assignmentStats: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [enrollmentsRes, courseStatsRes, studentEngagementRes, assignmentStatsRes] = await Promise.all([
          axios.get(`/api/v1/analytics/enrollments?timeRange=${timeRange}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/v1/analytics/course-stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`/api/v1/analytics/student-engagement?timeRange=${timeRange}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/v1/analytics/assignment-stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setAnalyticsData({
          enrollments: enrollmentsRes.data,
          courseStats: courseStatsRes.data,
          studentEngagement: studentEngagementRes.data,
          assignmentStats: assignmentStatsRes.data
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const renderLoading = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
      <CircularProgress />
    </Box>
  );

  const renderError = () => (
    <Box mt={3} mb={3}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  const renderEnrollmentsChart = () => {
    if (!analyticsData.enrollments.length) return <Typography>No enrollment data available</Typography>;
    
    const data = {
      labels: analyticsData.enrollments.map(item => item.courseName),
      datasets: [
        {
          label: 'Enrollments',
          data: analyticsData.enrollments.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Course Enrollments',
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderCourseStats = () => {
    if (!analyticsData.courseStats.length) return <Typography>No course statistics available</Typography>;
    
    const data = {
      labels: analyticsData.courseStats.map(item => item.courseName),
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: analyticsData.courseStats.map(item => item.completionRate),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    };

    return <Line data={data} />;
  };

  const renderStudentEngagement = () => {
    if (!analyticsData.studentEngagement.length) return <Typography>No engagement data available</Typography>;
    
    const data = {
      labels: analyticsData.studentEngagement.map(item => item.date),
      datasets: [
        {
          label: 'Active Students',
          data: analyticsData.studentEngagement.map(item => item.activeStudents),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    return <Bar data={data} />;
  };

  const renderAssignmentStats = () => {
    if (!analyticsData.assignmentStats.length) return <Typography>No assignment statistics available</Typography>;
    
    const data = {
      labels: analyticsData.assignmentStats.map(item => item.assignmentName),
      datasets: [
        {
          data: analyticsData.assignmentStats.map(item => item.averageGrade),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return <Pie data={data} />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderEnrollmentsChart();
      case 1:
        return renderCourseStats();
      case 2:
        return renderStudentEngagement();
      case 3:
        return renderAssignmentStats();
      default:
        return null;
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Time Range"
          >
            <MenuItem value="week">Last 7 days</MenuItem>
            <MenuItem value="month">Last 30 days</MenuItem>
            <MenuItem value="quarter">Last 3 months</MenuItem>
            <MenuItem value="year">Last 12 months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && renderError()}

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Courses</Typography>
              </Box>
              <Typography variant="h4">
                {loading ? '--' : analyticsData.courseStats.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Students</Typography>
              </Box>
              <Typography variant="h4">
                {loading ? '--' : analyticsData.enrollments.reduce((sum, item) => sum + item.count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AssignmentIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg. Completion</Typography>
              </Box>
              <Typography variant="h4">
                {loading ? '--' : 
                  analyticsData.courseStats.length > 0 
                    ? `${Math.round(analyticsData.courseStats.reduce((sum, item) => sum + item.completionRate, 0) / analyticsData.courseStats.length)}%`
                    : '0%'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<BarChartIcon />} label="Enrollments" />
          <Tab icon={<TimelineIcon />} label="Course Stats" />
          <Tab icon={<PeopleIcon />} label="Student Engagement" />
          <Tab icon={<AssignmentIcon />} label="Assignments" />
        </Tabs>
        
        <Box mt={3} minHeight="400px">
          {loading ? renderLoading() : renderTabContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default AnalyticsDashboard;