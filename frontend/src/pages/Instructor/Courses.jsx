// src/pages/Instructor/Courses.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, CardMedia, Typography, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const coursesData = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the basics of React.js',
    image: 'https://via.placeholder.com/300x200',
    students: 25,
    lessons: 12
  },
  // Add more sample courses as needed
];

export default function Courses() {
  const [courses, setCourses] = useState(coursesData);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/instructor/courses/${selectedCourse.id}/edit`);
    handleMenuClose();
  };

  const handleDelete = () => {
    // Implement delete logic
    setCourses(courses.filter(course => course.id !== selectedCourse.id));
    handleMenuClose();
  };

  const handleView = () => {
    navigate(`/instructor/courses/${selectedCourse.id}`);
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">My Courses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/instructor/courses/new')}
        >
          New Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {course.title}
                  </Typography>
                  <IconButton
                    aria-label="more"
                    aria-controls="course-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, course)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {course.students} Students
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.lessons} Lessons
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        id="course-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}