// src/pages/Instructor/Assignments.jsx
import React, { useState } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const assignments = [
  {
    id: 1,
    title: 'React Hooks Assignment',
    course: 'Introduction to React',
    dueDate: '2023-12-15',
    submissions: 15,
    totalStudents: 20,
  },
  // Add more assignments as needed
];

export default function Assignments() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">Assignments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/instructor/assignments/new')}
        >
          New Assignment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Submissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.course}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>{assignment.submissions}/{assignment.totalStudents}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/instructor/assignments/${assignment.id}/edit`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}