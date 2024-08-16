import React from 'react';
import { Box, IconButton } from '@mui/material';
import Sidebar from './Sidebar';

const AuthenticatedLayout = ({ isSidebarOpen, toggleSidebar, onLogout, children }) => {
  const sidebarWidth = isSidebarOpen ? '18%' : '0%';
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onLogout={onLogout}
      />
      <Box 
        sx={{ 
          flexGrow: 1, 
          paddingLeft: sidebarWidth, // Adjust main content padding based on sidebar width
          transition: 'padding-left 0.4s ease', 
          padding: '3%', 
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
      <IconButton 
        onClick={toggleSidebar} 
        sx={{ 
          position: 'fixed', 
          top: '1%', 
          left: isSidebarOpen ? sidebarWidth : '0%',
          zIndex: 1300, // Ensure the button is above the sidebar
          transition: 'left 0.3s ease' // Transition for button movement
        }}
      >
        {isSidebarOpen ? '<' : '≡'}
      </IconButton>
    </Box>
  );
};

export default AuthenticatedLayout;
