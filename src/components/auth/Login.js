import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Đảm bảo đã nhập khẩu các thành phần cần thiết
import Signup from './Signup';
import Forget from './Forget'; // Import component Forget

export default function Login({ onLogin }) {
  const [emailOrusername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSignup, setOpenSignup] = useState(false);
  const [openForget, setOpenForget] = useState(false); // Thêm trạng thái để mở/đóng cửa sổ Forget
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const fetchConnect = async (token) => {
    console.log('Connecting to MQTT...');
    const connect = 'MQTT';
    try {
      const response = await fetch('http://localhost:8080/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ connect }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Connected to MQTT successfully');
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error connecting to MQTT:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!emailOrusername || !password) {
        setError('Username and password are required.');
        return;
      }
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrusername, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setError('');
        const { accessToken, refreshToken } = result;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('connect', 'MQTT');
        fetchConnect(accessToken);
        onLogin(true);
        navigate('/home');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  const handleOpenSignup = () => setOpenSignup(true);
  const handleCloseSignup = () => setOpenSignup(false);

  const handleOpenForget = () => setOpenForget(true); // Mở cửa sổ Forget
  const handleCloseForget = () => setOpenForget(false); // Đóng cửa sổ Forget

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  const handleMouseMove = (e) => {
    const { clientX: x, clientY: y } = e;
    setBackgroundPosition({ x, y });
  };

  const gradientStyle = {
    background: `radial-gradient(circle at ${backgroundPosition.x}px ${backgroundPosition.y}px,  #299121, #1e90ff)`,
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        ...gradientStyle, // Sử dụng gradient dựa trên vị trí con trỏ chuột
      }}
    >
      {/* Form đăng nhập */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Login
        </Typography>
        <TextField
          label="Username"
          value={emailOrusername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{ mb: 0 }}
        />
        <Box sx={{ mt: 0, textAlign: 'right' }}>
          <Button onClick={handleOpenForget} sx={{ textTransform: 'lowercase' }}>
            Forgot password ?
          </Button>
        </Box>
        {error && <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>}
        <Button sx={{ mt: 3 }} variant="contained" color="primary" onClick={handleLogin} fullWidth>
          Login
        </Button>

        <Typography sx={{ mt: 2 }}>
          <Button onClick={handleOpenSignup}>Create new account</Button>
        </Typography>
      </Box>

      {/* Cửa sổ Signup */}
      <Dialog open={openSignup} onClose={handleCloseSignup}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <Signup onClose={handleCloseSignup} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignup}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cửa sổ Forget */}
      <Forget open={openForget} onClose={handleCloseForget} />
    </Box>
  );
}
