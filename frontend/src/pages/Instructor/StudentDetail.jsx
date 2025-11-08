import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Divider, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { Person, Assignment, School, BarChart, Email, Phone, CalendarToday } from '@mui/icons-material';
import axios from 'axios';

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Fetch student details
        const studentRes = await axios.get(`/api/students/${studentId}`);
        setStudent(studentRes.data);
        
        // Fetch student's courses
        const coursesRes = await axios.get(`/api/students/${studentId}/courses`);
        setCourses(coursesRes.data);
        
        // Fetch student's assignments
        const assignmentsRes = await axios.get(`/api/students/${studentId}/assignments`);
        setAssignments(assignmentsRes.data);
        
        // Fetch student's grades
        const gradesRes = await axios.get(`/api/students/${studentId}/grades`);
        setGrades(gradesRes.data);
        
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box p={3}>
        <Alert severity="info">Student not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Student Details
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Back to Students
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box 
              sx={{
                width: '100%',
                height: 200,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Person sx={{ fontSize: 100, color: '#666' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h5" gutterBottom>
              {student.firstName} {student.lastName}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Email color="action" sx={{ mr: 1 }} />
                  <Typography>{student.email}</Typography>
                </Box>
                {student.phone && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Phone color="action" sx={{ mr: 1 }} />
                    <Typography>{student.phone}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <School color="action" sx={{ mr: 1 }} />
                  <Typography>
                    {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Enrolled
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CalendarToday color="action" sx={{ mr: 1 }} />
                  <Typography>
                    Joined {new Date(student.joinedDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Courses" icon={<School />} iconPosition="start" />
          <Tab label="Assignments" icon={<Assignment />} iconPosition="start" />
          <Tab label="Grades" icon={<BarChart />} iconPosition="start" />
        </Tabs>
        
        <Divider />
        
        <Box p={3}>
          {tabValue === 0 && (
            <div>
              <Typography variant="h6" gutterBottom>Enrolled Courses</Typography>
              {courses.length > 0 ? (
                <ul>
                  {courses.map((course) => (
                    <li key={course._id}>{course.name}</li>
                  ))}
                </ul>
              ) : (
                <Typography>No courses enrolled.</Typography>
              )}
            </div>
          )}
          
          {tabValue === 1 && (
            <div>
              <Typography variant="h6" gutterBottom>Assignments</Typography>
              {assignments.length > 0 ? (
                <ul>
                  {assignments.map((assignment) => (
                    <li key={assignment._id}>
                      {assignment.title} - {assignment.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No assignments found.</Typography>
              )}
            </div>
          )}
          
          {tabValue === 2 && (
            <div>
              <Typography variant="h6" gutterBottom>Grades</Typography>
              {grades.length > 0 ? (
                <ul>
                  {grades.map((grade) => (
                    <li key={grade._id}>
                      {grade.courseName}: {grade.grade}%
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No grades available.</Typography>
              )}
            </div>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDetail;