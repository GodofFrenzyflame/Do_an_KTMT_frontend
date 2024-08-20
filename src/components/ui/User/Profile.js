import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Grid, Paper } from '@mui/material';
import PasswordDialog from './PasswordDialog';
import { InputAdornment } from '@mui/material';


const Profile = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone] = useState('');
  
  const [aioUser, setAioUser] = useState('');
  const [aioKey, setAioPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [originalAvatar, setOriginalAvatar] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [setIsPasswordConfirmed] = useState(false);

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
        setFullName(result.data.fullname);
        setEmail(result.data.email);
        setPhone(result.data.phone_number);
        setAioUser(result.data.AIO_USERNAME);
        setAioPassword(result.data.AIO_KEY);
        if (result.data.avatar) {
          const avatarSrc = `data:${result.data.avatar.contentType};base64,${result.data.avatar.data}`;
          setAvatar(avatarSrc);
          setOriginalAvatar(avatarSrc); // Save original avatar
        }
        else {
          setAvatar('');
          setOriginalAvatar(''); // No avatar
        }
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchProfileEdit = async (token) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('fullname', fullname);
      formData.append('email', email);
      formData.append('phone_number', phone_number);
      formData.append('AIO_USERNAME', aioUser);
      formData.append('AIO_KEY', aioKey);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append('avatar', fileInput.files[0]);
      }

      const response = await fetch('http://localhost:8080/profile/edit', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Use FormData instead of JSON.stringify
      });

      const result = await response.json();
      if (response.ok) {
        alert('Profile saved!');
        setIsEditable(false);
        fetchProfileData(token);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSave = () => {
    fetchProfileEdit(localStorage.getItem('accessToken'));
  };

  const handleCancel = () => {
    fetchProfileData(localStorage.getItem('accessToken'));
    setIsEditable(false);
    setAvatar(originalAvatar); // Reset to original avatar
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

  const handlePasswordChangeClick = () => {
    if (isEditable) {
      setIsPasswordDialogOpen(true);
    }
  };
  

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchProfileData(accessToken);
  }, []);

  const obfuscatePhone = (phone_number) => {
    if (!phone_number) return '';
    const digits = phone_number.replace(/\D/g, ''); // Remove non-digit characters
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
              value={fullname}
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
              value={isEditable ? phone_number : obfuscatePhone(phone_number)}
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
              value="**** ****"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: isEditable && (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      sx={{ textTransform: 'none' }}
                      onClick={handlePasswordChangeClick}
                    >
                      Click here to change password
                    </Button>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true, // Luôn giữ nhãn trên đầu
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
              value={aioKey}
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
