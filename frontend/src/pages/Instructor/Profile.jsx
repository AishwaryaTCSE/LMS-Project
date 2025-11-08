// frontend/src/pages/Instructor/Profile.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Avatar, Divider, CircularProgress, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../api/userApi';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  bio: Yup.string().max(500, 'Bio should not exceed 500 characters'),
  department: Yup.string().required('Department is required'),
});

const InstructorProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      department: user?.department || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        const updatedUser = await updateUserProfile(user._id, values);
        updateUser(updatedUser);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Instructor Profile</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        {/* ... rest of the component code ... */}
      </Paper>
    </Box>
  );
};

export default InstructorProfile;