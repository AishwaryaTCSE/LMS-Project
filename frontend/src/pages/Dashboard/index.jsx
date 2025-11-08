import React from 'react';
import { Card, Grid, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate('/courses')}>
            <Typography variant="h6">My Courses</Typography>
            <Typography variant="h4" color="primary">5</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate('/assignments')}>
            <Typography variant="h6">Pending Assignments</Typography>
            <Typography variant="h4" color="secondary">3</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate('/grades')}>
            <Typography variant="h6">Average Grade</Typography>
            <Typography variant="h4">A-</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate('/quizzes')}>
            <Typography variant="h6">Upcoming Quizzes</Typography>
            <Typography variant="h4">2</Typography>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {/* Add your activity feed component here */}
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Upcoming Deadlines</Typography>
            {/* Add your deadlines component here */}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;