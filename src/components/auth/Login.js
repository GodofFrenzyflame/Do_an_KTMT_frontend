import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Signup from './Signup'; // Import component Signup

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSignup, setOpenSignup] = useState(false); // Trạng thái để điều khiển hộp thoại đăng ký
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const { accessToken, refreshToken } = result;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Access Token:', localStorage.getItem('accessToken'));
        console.log('Refresh Token:', localStorage.getItem('refreshToken'));
        onLogin(true);
        navigate('/home');
      } else {
        console.error('Error:', result.message);
        setError(result.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server');
    }
  };

  const handleOpenSignup = () => setOpenSignup(true); // Mở hộp thoại đăng ký
  const handleCloseSignup = () => setOpenSignup(false); // Đóng hộp thoại đăng ký

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundImage: 'url(/static/imagelogin.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Login
        </Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
          Login
        </Button>
        <Typography sx={{ mt: 2 }}>
          <Button onClick={handleOpenSignup}>Create new account</Button> {/* Mở hộp thoại đăng ký */}
        </Typography>
      </Box>

      {/* Hộp thoại đăng ký */}
      <Dialog open={openSignup} onClose={handleCloseSignup}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <Signup onClose={handleCloseSignup} /> {/* Truyền hàm đóng hộp thoại */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignup}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}