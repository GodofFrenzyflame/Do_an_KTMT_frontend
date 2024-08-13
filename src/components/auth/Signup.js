import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Signup({ onClose }) {  // Nhận prop onClose từ Login component
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully!');
        setError('');

        // Đóng hộp thoại sau 2 giây
        setTimeout(() => {
          setSuccess('');
          onClose(); // Gọi hàm onClose để đóng hộp thoại đăng ký
        }, 1000);
      } else {
        console.error('Error:', result.message);
        setError(result.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server');
    }
  };

  return (
    <Box sx={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Sign Up</Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}

      <Button variant="contained" color="primary" onClick={handleSignup} fullWidth>
        Create Account
      </Button>
    </Box>
  );
}
