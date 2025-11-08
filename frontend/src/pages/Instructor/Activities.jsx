// frontend/src/pages/Instructor/Activities.jsx
import React from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';

const Activities = () => {
  const { courseId } = useParams();
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {courseId ? 'Course Activities' : 'All Activities'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Tabs value={0} aria-label="activity tabs">
          <Tab label="All Activities" />
          <Tab label="Assignments" />
          <Tab label="Quizzes" />
          <Tab label="Discussions" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          <Typography>Activity feed will be displayed here</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Activities;