import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function Forget({ open, onClose }) {
  const [step, setStep] = useState('request'); // Các bước: 'request', 'verify'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Xử lý yêu cầu reset mật khẩu
  const handleRequest = async () => {
    try {
      const response = await fetch('http://localhost:8080/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone }),
      });
      const result = await response.json();
      if (response.ok) {
        setStep('verify');
        setSuccess('Instructions for resetting your password have been sent.');
      } else {
        setError(result.message || 'Failed to request password reset');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  // Xử lý xác thực mã
  const handleVerify = async () => {
    try {
      const response = await fetch('http://localhost:8080/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone, verificationCode }),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccess('Verification successful. Please follow the instructions sent to your email or phone.');
        setStep('completed');
      } else {
        setError(result.message || 'Failed to verify code');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {step === 'request' ? (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter your email or phone number to reset your password
              </Typography>
              <TextField
                label="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          ) : step === 'verify' ? (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter the verification code sent to your email or phone
              </Typography>
              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          ) : (
            <Typography variant="h6" sx={{ mb: 3 }}>
              Your password has been reset. Please follow the instructions sent to your email or phone.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'flex-end', // Căn lề phải các nút
        }}
      >
        <Button onClick={onClose}>Close</Button>
        {step === 'request' && (
          <Button variant="contained" color="primary" onClick={handleRequest}>
            Submit
          </Button>
        )}
        {step === 'verify' && (
          <Button variant="contained" color="primary" onClick={handleVerify}>
            Verify
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
