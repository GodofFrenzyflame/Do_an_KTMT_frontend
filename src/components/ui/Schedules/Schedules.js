// src/components/UpgradePage.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Schedules = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        paddingTop: '50px',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Need Upgrade to Open SchedulesPage
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
        Unlock premium features by upgrading to our premium plan. Enjoy exclusive content, advanced features, and more!
      </Typography>
      <Button variant="contained" color="primary" sx={{ padding: '10px 20px' }}>
        Updade to Premium now
      </Button>
    </Box>
  );
};

export default Schedules;
