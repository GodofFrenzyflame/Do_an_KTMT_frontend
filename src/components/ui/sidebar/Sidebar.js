import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import '../../../styles/sidebar.css'; 

export default function Sidebar({ onLogout, isOpen }) {
  const location = useLocation();
  const sidebarWidth = isOpen ? '12%' : '5%';

  // Hàm để kiểm tra xem trang hiện tại có phải là trang được liên kết với đường dẫn không
  const isActive = (path) => location.pathname === path;

  return (
    <Box className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`} sx={{ width: sidebarWidth, display: 'flex', flexDirection: 'column', height: '95%' }}>

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: '20%' ,
          mt: '5%'
        }}
      >
        <img 
          src="/static/hcmut.png" 
          alt="" 
          style={{ 
            maxWidth: '15%', // Nhỏ lại kích thước hình ảnh
            height: 'auto', 
            borderRadius: '0%', // Điều chỉnh để hình tròn hơn
            marginRight: '2%', // Khoảng cách giữa ảnh và chữ
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#ffffff', 
            fontSize: '1.2vw' 
          }}
        >
          Dashboard IoT
        </Typography>


      </Box>


      <Box sx={{ width: '100%', flexGrow: 1 }}>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: isActive('/home') ? '#ff9800' : '#414a4c',
            color: '#fff',
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: '#ff9800',
            },
          }}>
            🏠Home
          </Button>
        </Link>

        <Link to="/history" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: isActive('/history') ? '#ff9800' : '#414a4c',
            color: '#fff',
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: '#ff9800',
            },
            mt: '2%'
          }}>
            🧾History
          </Button>
        </Link>

        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: isActive('/profile') ? '#ff9800' : '#414a4c',
            color: '#fff',
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: '#ff9800',
            },
            mt: '2%'
          }}>
            📑Profile
          </Button>
        </Link>
      </Box>

      {/* Nút Logout không cần thay đổi màu theo trang */}
      <Button variant="contained" fullWidth sx={{
        bgcolor: '#f44336',
        color: '#fff',
        padding: '4% 8%',
        fontSize: '1.2vw',
        height: '7%',
        width: '90%',
        marginLeft: '5%',
        borderRadius: '8px',
        '&:hover': {
          bgcolor: '#c62828',
        },
        mt: 'auto'
      }} onClick={onLogout}>
        Log out
      </Button>
      <Box sx={{ height: '2%' }} />
    </Box>
  );
}
