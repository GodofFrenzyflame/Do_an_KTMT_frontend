import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Grid, Paper } from '@mui/material';
import PasswordDialog from './PasswordDialog';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [aioUser, setAioUser] = useState('');
  const [aiokey, setAioPassword] = useState('');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/100');
  const [isEditable, setIsEditable] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [ setIsPasswordConfirmed] = useState(false);

  const fetchProfileData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUsername(result.data.username);
        setFullName(result.data.fullName);
        setEmail(result.data.email);
        setPhone(result.data.phone); // Assuming phone is fetched from the backend
        setAioUser(result.data.AIO_USERNAME);
        setAioPassword(result.data.AIO_KEY);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSave = () => {
    // Handle save logic here
    alert('Profile saved!');
    setIsEditable(false);
  };

  const handleCancel = () => {
    // Reset fields or other necessary state here
    setIsEditable(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordClick = () => {
    if (isEditable) {
      setIsPasswordDialogOpen(true);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchProfileData(accessToken);
  }, []);

  const obfuscatePhone = (phone) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, ''); // Remove non-digit characters
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };
  
  const obfuscateEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}${'*'.repeat(user.length - 2)}@${domain}`;
  };
  

  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        {/* Avatar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={avatar} sx={{ width: 100, height: 100, mr: 2 }} />
          {isEditable && (
            <Button variant="contained" component="label">
              Upload Avatar
              <input type="file" hidden onChange={handleAvatarChange} />
            </Button>
          )}
        </Box>
  
        {/* Profile Form */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={isEditable ? email : obfuscateEmail(email)}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              value={isEditable ? phone : obfuscatePhone(phone)}
              fullWidth
              InputProps={{
                readOnly: true, // Phone number is always read-only
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              value={isEditable ? password : '****'}
              onClick={handlePasswordClick}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="AIO-User"
              value={aioUser}
              onChange={(e) => setAioUser(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="AIO-key"
              value={aiokey}
              onChange={(e) => setAioPassword(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {!isEditable ? (
              <Button variant="contained" onClick={() => setIsEditable(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant="outlined" sx={{ bgcolor: '#f44336', color: '#fff' }} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
  
      {/* Password Dialog */}
      <PasswordDialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onConfirm={(confirmed) => setIsPasswordConfirmed(confirmed)}
      />
    </Box>
  );
};  
export default Profile;
