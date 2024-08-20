import React, { useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import './Relay.css'; 

const Relay = () => {
  // Quản lý trạng thái của 4 toggle
  const [toggleStates, setToggleStates] = useState([false, false, false, false]);

  // Xử lý sự kiện bật/tắt toggle
  const handleToggleChange = (index) => {
    setToggleStates(prevStates =>
      prevStates.map((state, i) => i === index ? !state : state)
    );
  };

  // Hình ảnh cho mỗi relay
  const relayImages = [
    require('./device/watepum.png'),
    require('./device/watepum.png'),
    require('./device/watepum.png'),
    require('./device/watepum.png'),
  ];

  return (
    <Box sx={{ px: '1%', py: '5%' }}>
      <Grid container spacing={2}>
        {toggleStates.map((isOn, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: '2%', textAlign: 'center', position: 'relative' }}>
              <Typography variant="h6">Relay {index + 1}</Typography>
              <Typography variant="body1">Status: {isOn ? 'ON' : 'OFF'}</Typography>
              <Box
                component="img"
                src={relayImages[index]}
                alt={`Relay ${index + 1}`}
                sx={{ width: '100%', height: 'auto', objectFit: 'cover', mb: 2 }}
              />
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => handleToggleChange(index)}
                />
                <span className="slider"></span>
              </label>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Relay;
