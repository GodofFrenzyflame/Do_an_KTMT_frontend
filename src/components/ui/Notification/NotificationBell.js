// src/components/NotificationBell.js
import React, { useState, useRef } from 'react';
import { IconButton, Popper, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useClickAway } from 'react-use'; // Ensure this package is installed

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const popperRef = useRef(null);

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  useClickAway(popperRef, () => {
    setOpen(false);
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1100,
      }}
    >
      <IconButton
        ref={anchorRef}
        onClick={handleClick}
        sx={{
          color: '#000',
          backgroundColor: 'transparent',
        }}
      >
        <NotificationsIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        ref={popperRef}
        sx={{
          zIndex: 1200,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px',
          p: 2,
          maxWidth: '200px',
        }}
      >
        <Typography variant="body2">You have new notifications</Typography>
        {/* Add more content here as needed */}
      </Popper>
    </Box>
  );
};

export default NotificationBell;
