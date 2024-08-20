import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const PasswordDialog = ({ open, onClose, onConfirm }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: currentPassword }), // Đặt username ở đây nếu cần thiết
      });

      if (response.ok) {
        // Gửi mật khẩu mới tới backend
        const changeResponse = await fetch('http://localhost:8080/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ newPassword }),
        });

        if (changeResponse.ok) {
          onConfirm(true); // Xác nhận mật khẩu đã được đổi
          onClose();
        } else {
          setError('Error !!!');
        }
      } else {
        setError('Password is incorrect');
      }
    } catch (error) {
      setError('Eror !!!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chang Password</DialogTitle>
      <DialogContent>
        <TextField
          label="Current password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={!!error}
          helperText={error}
          margin="normal"
        />
        <TextField
          label="New password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Confirm new password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
