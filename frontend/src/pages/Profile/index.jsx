import React, { useState } from 'react';
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student',
    bio: 'Computer Science Major',
    phone: '+1 (555) 123-4567',
    avatar: '/default-avatar.png',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Implement save to API
    setEditing(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">My Profile</Typography>
          {!editing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                {editing && (
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <input hidden accept="image/*" type="file" />
                    <PhotoCamera />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h6">{profile.name}</Typography>
              <Typography color="textSecondary" gutterBottom>
                {profile.role}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  name="role"
                  value={profile.role}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {editing && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  // TODO: Reset form
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Container>
  );
};

export default Profile;