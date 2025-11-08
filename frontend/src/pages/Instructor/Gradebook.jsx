// src/pages/Instructor/Gradebook.jsx
import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const students = [
  {
    id: 1,
    name: 'John Doe',
    assignments: [
      { id: 1, title: 'React Hooks', grade: 'A', submitted: true },
      { id: 2, title: 'State Management', grade: 'B+', submitted: true },
      { id: 3, title: 'API Integration', grade: null, submitted: false },
    ],
  },
  // Add more students as needed
];

export default function Gradebook() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gradebook
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search students..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              {students[0]?.assignments.map((assignment) => (
                <TableCell key={assignment.id} align="center">
                  {assignment.title}
                  <Typography variant="caption" display="block">
                    {assignment.submitted ? 'Submitted' : 'Pending'}
                  </Typography>
                </TableCell>
              ))}
              <TableCell>Overall Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                {student.assignments.map((assignment) => (
                  <TableCell key={assignment.id} align="center">
                    <TextField
                      size="small"
                      value={assignment.grade || ''}
                      disabled={!assignment.submitted}
                      sx={{ width: '60px' }}
                    />
                  </TableCell>
                ))}
                <TableCell>B+</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}