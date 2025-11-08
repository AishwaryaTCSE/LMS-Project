import React, { useState } from 'react';
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: 'en',
    timezone: 'UTC+05:30',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', settings);
      setIsSaving(false);
      setSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>
        
        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    name="emailNotifications"
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: -1 }}>
                Receive email notifications for important updates
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={handleChange}
                    name="pushNotifications"
                    color="primary"
                  />
                }
                label="Push Notifications"
              />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: -1 }}>
                Enable push notifications in your browser
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Display
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleChange}
                    name="darkMode"
                    color="primary"
                  />
                }
                label="Dark Mode"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                SelectProps={{ native: true }}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                SelectProps={{ native: true }}
              >
                <option value="UTC+05:30">(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                <option value="UTC+00:00">(UTC+00:00) London, Dublin, Edinburgh</option>
                <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
                <option value="UTC+08:00">(UTC+08:00) Beijing, Singapore, Hong Kong</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Card sx={{ mt: 4, p: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" color="error" sx={{ mr: 2 }}>
            Delete Account
          </Button>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Permanently delete your account and all associated data
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default Settings;