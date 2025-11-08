// frontend/src/pages/Assignments/AssignmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { createAssignment, updateAssignment, getAssignmentById } from '../../api/assignmentApi';

const AssignmentForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dueDate: '',
      totalPoints: 100,
      course: '',
      files: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      dueDate: Yup.date().required('Due date is required').min(new Date(), 'Due date must be in the future'),
      totalPoints: Yup.number().required('Total points is required').min(1, 'Must be at least 1 point'),
      course: Yup.string().required('Course is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError('');
        
        if (mode === 'edit' && assignmentId) {
          await updateAssignment(assignmentId, values);
        } else {
          await createAssignment(values);
        }
        
        navigate('/instructor/assignments');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to save assignment');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (mode === 'edit' && assignmentId) {
      const fetchAssignment = async () => {
        try {
          const assignment = await getAssignmentById(assignmentId);
          formik.setValues(assignment);
        } catch (err) {
          setError('Failed to load assignment');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAssignment();
    }
  }, [assignmentId, mode]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {mode === 'edit' ? 'Edit Assignment' : 'Create New Assignment'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Assignment Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            margin="normal"
          />
          
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            margin="normal"
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              id="dueDate"
              name="dueDate"
              label="Due Date"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
              helperText={formik.touched.dueDate && formik.errors.dueDate}
            />
            
            <TextField
              fullWidth
              id="totalPoints"
              name="totalPoints"
              label="Total Points"
              type="number"
              value={formik.values.totalPoints}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.totalPoints && Boolean(formik.errors.totalPoints)}
              helperText={formik.touched.totalPoints && formik.errors.totalPoints}
            />
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading || !formik.isValid || !formik.dirty}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Save Assignment'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AssignmentForm;