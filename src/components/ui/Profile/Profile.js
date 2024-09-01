import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Grid, Paper } from '@mui/material';
import PasswordDialog from './ChangePass';
import { InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const token = localStorage.getItem('accessToken');

const showAlert = (message, type) => {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Oops...' : 'Success',
    text: message,
    confirmButtonText: 'OK',
  });
};

const Profile = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone] = useState('');
  const [webServerIp, setWebServerIp] = useState('');

  const [aioUser, setAioUser] = useState('');
  const [aioKey, setAioPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [originalAvatar, setOriginalAvatar] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [originalCoverPhoto, setOriginalCoverPhoto] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  const loadData = () => {
    setUsername(localStorage.getItem('username'));
    setFullName(localStorage.getItem('fullname'));
    setEmail(localStorage.getItem('email'));
    setPhone(localStorage.getItem('phone_number'));
    setWebServerIp(localStorage.getItem('webServerIp'));
    setAioUser(localStorage.getItem('AIO_USERNAME'));
    setAioPassword(localStorage.getItem('AIO_KEY'));
    if (localStorage.getItem('avatar')) {
      setAvatar(localStorage.getItem('avatar'));
      setOriginalAvatar(localStorage.getItem('avatar'));
    } else {
      setAvatar('');
      setOriginalAvatar('');
    }
    if (localStorage.getItem('coverPhoto')) {
      setCoverPhoto(localStorage.getItem('coverPhoto'));
      setOriginalCoverPhoto(localStorage.getItem('coverPhoto'));
    } else {
      setCoverPhoto('');
      setOriginalCoverPhoto('');
    }
  };

  const fetchProfileEdit = async () => {
    if (!username) {
      showAlert('Username is required', 'error');
      return;
    }
    if (!aioUser || !aioKey) {
      showAlert('AIO Username and AIO Key are required', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('phone_number', phone_number);
    formData.append('AIO_USERNAME', aioUser);
    formData.append('AIO_KEY', aioKey);
    formData.append('webServerIp', webServerIp);
    const fileInputAvatar = document.querySelector('input[name="avatar"]');
    const fileInputCover = document.querySelector('input[name="coverPhoto"]');
    if (fileInputAvatar && fileInputAvatar.files[0]) {
      formData.append('avatar', fileInputAvatar.files[0]);
    }
    if (fileInputCover && fileInputCover.files[0]) {
      formData.append('coverPhoto', fileInputCover.files[0]);
    }
    try {
      const response = await fetch('http://localhost:8080/profile/edit', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        setIsEditable(false);
        localStorage.setItem('username', result.data.username || '');
        localStorage.setItem('fullname', result.data.fullname || '');
        localStorage.setItem('email', result.data.email || '');
        localStorage.setItem('phone_number', result.data.phone_number || '');
        localStorage.setItem('AIO_USERNAME', result.data.AIO_USERNAME || '');
        localStorage.setItem('AIO_KEY', result.data.AIO_KEY || '');
        localStorage.setItem('webServerIp', result.data.webServerIp || '');
        if (result.data.avatar) {
          const avatarSrc = `data:${result.data.avatar.contentType};base64,${result.data.avatar.data}`;
          localStorage.setItem('avatar', avatarSrc);
        }
        if (result.data.coverPhoto) {
          const coverPhotoSrc = `data:${result.data.coverPhoto.contentType};base64,${result.data.coverPhoto.data}`;
          localStorage.setItem('coverPhoto', coverPhotoSrc);
        }
        toast.success('Profile saved!');
        loadData();
      } else {
        console.error('Error saving profile:', result.error);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSave = () => {
    fetchProfileEdit();
  };

  const handleCancel = () => {
    loadData();
    setIsEditable(false);
    setAvatar(originalAvatar);
    setCoverPhoto(originalCoverPhoto);
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

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
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
    loadData();
  }, []);

  const obfuscatePhone = (phone_number) => {
    if (!phone_number) return '';
    const digits = phone_number.replace(/\D/g, '');
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };

  const obfuscateEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}${'*'.repeat(user.length - 2)}@${domain}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto', }}>
      <Paper sx={{ p: 3, borderRadius: '17px' ,background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 1) 100%)`,}}>
        {/* Cover Photo Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200, // Adjust height as needed
            backgroundImage: `url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '17px',
            border: '1px solid #ddd', // Border around the cover photo
            mb: 2,
          }}
        >
          {isEditable && (
            <Button
              variant="contained"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                bgcolor: '#ffffff',
                color: '#000',
                fontSize: '0.75rem', // Kích thước chữ nhỏ hơn
                padding: '4px 8px', // Kích thước nút nhỏ hơn
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              Upload Cover Photo
              <input
                type="file"
                name="coverPhoto"
                hidden
                onChange={handleCoverPhotoChange}
              />
            </Button>
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              mb: 2,
            }}
          >
            <Avatar src={avatar} sx={{ width: 100, height: 100,top:15, }} />
            {isEditable && (
              <Button
                variant="contained"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#ffffff',
                  color: '#000',
                  padding: '1px 1px', // Kích thước nút nhỏ hơn
                  borderRadius: '20px',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                  },
                }}
              >
                <CameraAltIcon />
                <input
                  type="file"
                  name="avatar"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            )}
          </Box>
        </Box>

        {/* Profile Form */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              value={fullname || ''}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true,
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
                shrink: true,
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
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="AIO User"
              value={aioUser || ''}
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
              label="AIO Key"
              value={aioKey || ''}
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
          <Grid item xs={12}>
            <TextField
              label="Web Server IP" // Thêm trường nhập Web Server IP
              value={webServerIp || ''}
              onChange={(e) => setWebServerIp(e.target.value)}
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
                <Button
                  variant="outlined"
                  sx={{
                    bgcolor: '#ff0505',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#b50000', // Màu đỏ đậm khi di chuột vào
                    },
                  }}
                  onClick={handleCancel}
                >
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
        onClose={() => {
          setIsPasswordDialogOpen(false);
          if (isPasswordConfirmed) {
            // Refresh profile data if the password was confirmed
            loadData();
          }
        }}
        onConfirm={(confirmed) => {
          setIsPasswordConfirmed(confirmed); // Đảm bảo setIsPasswordConfirmed được gọi đúng cách
          if (confirmed) {
            setIsPasswordDialogOpen(false); // Close the dialog if password is confirmed
          }
        }}
      />
    </Box>
  );
};

export default Profile;
