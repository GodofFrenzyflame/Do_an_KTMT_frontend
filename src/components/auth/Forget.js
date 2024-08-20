// Forget.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography} from '@mui/material';

export default function Forget() {
  const [step, setStep] = useState('main'); // Quản lý bước hiện tại (chọn quên mật khẩu hay quên tài khoản)
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    try {
      // Gửi yêu cầu lấy lại mật khẩu
      const response = await fetch('http://localhost:8080/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Instructions for resetting your password have been sent.');
      } else {
        setError(result.message || 'Failed to request password reset');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  const handleForgotUsername = async () => {
    try {
      // Gửi yêu cầu lấy lại tài khoản
      const response = await fetch('http://localhost:8080/forgot-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Instructions for retrieving your username have been sent.');
      } else {
        setError(result.message || 'Failed to request username retrieval');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      {step === 'main' ? (
        <>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Forgot Password or Username?
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setStep('forgot-password')}>
            Forgot Password
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setStep('forgot-username')}>
            Forgot Username
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Enter your email or username:
          </Typography>
          <TextField
            label="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {step === 'forgot-password' ? (
            <Button variant="contained" color="primary" onClick={handleForgotPassword}>
              Submit
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleForgotUsername}>
              Submit
            </Button>
          )}
          <Button variant="outlined" color="inherit" onClick={() => setStep('main')} sx={{ mt: 2 }}>
            Back
          </Button>
        </>
      )}
    </Box>
  );
}
