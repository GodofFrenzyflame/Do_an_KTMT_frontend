import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import Sidebar from './Sidebar';
import Clock from '../Clock/Clock'; // Import Clock component
// import MiniSidebar from './MiniSidebar'

const AuthenticatedLayout = ({ onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState(true);


  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState));
      setIsMiniSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isMiniSidebarOpen));
  }, [isMiniSidebarOpen]);


  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };


  const sidebarWidth = isSidebarOpen ? '18%' : '0%';
  
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onLogout={onLogout}
      />
      
      <Clock /> 


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
          left: isSidebarOpen ? '17%' : '3%',
          zIndex: 1300, // Ensure button is on top
          transition: 'left 0s ease',
          fontSize: '2.5rem',
        }}
      >
        {isSidebarOpen ? '×' : '≡'}
      </IconButton>
    </Box>
  );
};

export default AuthenticatedLayout;
