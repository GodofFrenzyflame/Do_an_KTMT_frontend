import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, Grid, Paper } from '@mui/material';

const Profile = () => {
  const [username, setUsername] = useState('john_doe');
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('');
  const [aioUser, setAioUser] = useState('aio_user');
  const [aiokey, setAioPassword] = useState('aio_key');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/100'); // Placeholder for avatar
  const [isEditable, setIsEditable] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    alert('Profile saved!');
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              value="123-456-7890" // Static value as it cannot be changed
              InputProps={{
                readOnly: true,
              }}
              fullWidth
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
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              onClick={() => setIsEditable(!isEditable)}
            >
              {isEditable ? 'Cancel' : 'Setting'}
            </Button>
            {isEditable && (
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
