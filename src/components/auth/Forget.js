import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import LoadingSpinner from '../ui/Loading/LoadingSpinner';
export default function Forget({ open, onClose }) {
  const [step, setStep] = useState('request'); // Các bước: 'request', 'verify', 'resetPassword'
  const [emailOrusername, setEmailOrUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); 


  const handleRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/email/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrusername }),
      });
      const result = await response.json();
      if (response.ok) {
        setError('');
        setStep('verify');
        setSuccess('Instructions for resetting your password have been sent.');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/email/confirm-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrusername, verificationCode }),
      });
      const result = await response.json();
      if (response.ok) {
        setError('');
        setSuccess('Verification successful.');
        setStep('resetPassword');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error);
    }
    finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    emailOrusername = emailOrusername.toLowerCase();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/forgot-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrusername, newPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        setError('');
        setSuccess('Password reset successful. Redirecting to login...');
        setTimeout(() => {
          onClose();
          window.location.href = '/';
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error);
    }
    finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {step === 'request' && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter your email or username to reset your password
              </Typography>
              <TextField
                label="Email or Username"
                value={emailOrusername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          {step === 'verify' && (
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
          )}
          {step === 'resetPassword' && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter your new password
              </Typography>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Close</Button>
        {step === 'request' && (
          <Button variant="contained" color="primary" onClick={handleRequest}>
           {loading ? <LoadingSpinner /> : 'Submit'} 
          </Button>
        )}
        {step === 'verify' && (
          <Button variant="contained" color="primary" onClick={handleVerify}>
            {loading ? <LoadingSpinner /> : 'Verify'}
          </Button>
        )}
        {step === 'resetPassword' && (
          <Button variant="contained" color="primary" onClick={handleResetPassword}>
            {loading ? <LoadingSpinner /> : 'Reset Password'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
