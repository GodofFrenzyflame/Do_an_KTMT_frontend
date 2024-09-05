// src/components/Clock.js
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${weekday}, ${day}/${month}/${year}`;
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        right: '70px', // Adjusted to make space for the notification bell
        padding: '5px 15px',
        color: '#000', // Black text
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderRadius: '20px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        background: `linear-gradient(to bottom, 
          rgba(255, 255, 255, 0.6) 5%, 
          rgba(255, 255, 255, 1) 100%)`,
      }}
    >
      <Typography variant="h6">{formatDate(time)}</Typography>
      <Typography variant="h6">|</Typography>
      <Typography variant="h6">{formatTime(time)}</Typography>
    </Box>
  );
};

export default Clock;
