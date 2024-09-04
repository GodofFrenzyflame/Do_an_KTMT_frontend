// src/components/UpgradePage.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const UpgradePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Upgrade to Premium
      </Typography>
      {/* Sử dụng đường dẫn tuyệt đối từ thư mục public */}
      <img src="/static/QR.png" alt="QR Code" />

      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
        Unlock premium features by upgrading to our premium plan. Enjoy exclusive content, advanced features, and more!
      </Typography>
      <Button variant="contained" color="primary" sx={{ padding: '10px 20px' }}>
        Learn More
      </Button>
    </Box>
  );
};

export default UpgradePage;
