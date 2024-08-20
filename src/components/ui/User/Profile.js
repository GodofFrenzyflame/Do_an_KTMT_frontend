import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Grid, Paper } from '@mui/material';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [aioUser, setAioUser] = useState('')
  const [aiokey, setAioPassword] = useState('');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/100'); // Placeholder for avatar
  const [isEditable, setIsEditable] = useState(false);

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
        setAioUser(result.data.AIO_USERNAME)
        setAioPassword(result.data.AIO_KEY);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching humidity data:', error);
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

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchProfileData(accessToken);
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        {/* Avatar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={avatar} sx={{ width: 100, height: 100, mr: 2 }} />
          <Button variant="contained" component="label">
            Upload Avatar
            <input type="file" hidden onChange={handleAvatarChange} />
          </Button>
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
              value={email}
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
              value={phone} // Static value as it cannot be changed
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              value={password}
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
              type="key"
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
                <Button variant="outlined" sx={{  bgcolor: '#f44336', color: '#fff',}} onClick={handleCancel}>
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
    </Box>
  );
};

export default Profile;
