import React from 'react';
import { Box, IconButton } from '@mui/material';
import Sidebar from './Sidebar';
import Clock from '../clockset/clock'; // Import Clock component

const AuthenticatedLayout = ({ isSidebarOpen, toggleSidebar, onLogout, children }) => {
  const sidebarWidth = isSidebarOpen ? '18%' : '0%';
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onLogout={onLogout}
      />
      <Clock /> {/* Add Clock component here */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          paddingLeft: sidebarWidth, // Adjust main content padding based on sidebar width
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
          top: '0%', 
          left: isSidebarOpen ? '17%' : '0%',
          zIndex: 1300, // Ensure button is on top
          transition: 'left 0.3s ease',
          fontSize: '2.5rem',
        }}
      >
        {isSidebarOpen ? '×' : '≡'}
      </IconButton>
    </Box>
  );
};

export default AuthenticatedLayout;
