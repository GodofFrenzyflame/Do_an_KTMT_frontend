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
          setError('Có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại.');
        }
      } else {
        setError('Mật khẩu hiện tại không đúng.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đổi mật khẩu</DialogTitle>
      <DialogContent>
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={!!error}
          helperText={error}
          margin="normal"
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
