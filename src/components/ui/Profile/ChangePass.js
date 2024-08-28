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
        const response = await fetch('http://localhost:8080/profile/change-password', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ password: currentPassword, newpassword: newPassword }),
        });

        if (response.ok) {
          console.log('Password changed successfully.');
          setError('');
          onConfirm(true); // Gọi onConfirm với giá trị true
          onClose(); // Đóng cửa sổ sau khi đổi mật khẩu thành công
        } else {
          setError('Mật khẩu hiện tại không đúng.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setError('ERROR !!!!');
      }
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" 
      fullWidth 
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column', // Đảm bảo rằng các phần tử con xếp theo chiều dọc
          width: '400px', // Căn chỉnh kích thước của hộp thoại
          height: 'auto',
        }
      }}>
        <DialogTitle>Change Password</DialogTitle>
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
    