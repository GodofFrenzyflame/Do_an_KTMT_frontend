import React from 'react';
import { Box, IconButton } from '@mui/material';
import Sidebar from './Sidebar';

const AuthenticatedLayout = ({ isSidebarOpen, toggleSidebar, onLogout, children }) => {
  const sidebarWidth = isSidebarOpen ? '12.2%' : '0'; 
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onLogout={onLogout}
        sx={{ width: sidebarWidth }} // Đảm bảo Sidebar điều chỉnh theo % width
      />
      <IconButton 
        onClick={toggleSidebar} 
        sx={{ 
          position: 'fixed', 
          top: '1%', // Đổi top thành %
          left: sidebarWidth, 
          zIndex: 1201,
          // borderRadius: '100%'
        }}
      >
        {isSidebarOpen ? '‖' : '≡'}
      </IconButton>
      <Box 
        sx={{ 
          flexGrow: 1, 
          marginLeft: sidebarWidth, 
          transition: 'margin-left 0.3s ease', 
          padding: '3%', // Chuyển padding thành %
          height: '100%',
          width: isSidebarOpen ? '95%' : '100%', // Đảm bảo chiếm toàn bộ chiều rộng dựa trên trạng thái của sidebar
          boxSizing: 'border-box'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;
