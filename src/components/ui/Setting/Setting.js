import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AppContext from './language/AppContext'; // Import context

const Settings = () => {
  const { settings, setSettings } = useContext(AppContext);
  const [mode, setMode] = useState(settings.mode || 'light');
  const [language, setLanguage] = useState(settings.language);
  const [connect, setConnect] = useState(settings.connect || 'MQTT');

  const token = localStorage.getItem('accessToken');

  const loadData = async () => {
    const storedMode = localStorage.getItem('mode');
    const storedLanguage = localStorage.getItem('language');
    const storedConnect = localStorage.getItem('connect');

    if (storedMode) setMode(storedMode);
    if (storedLanguage) setLanguage(storedLanguage);
    storedConnect === 'MQTT' ? setConnect('MQTT') : setConnect('Webserver');
  }


  useEffect(() => {
    loadData();
  }, []);

  const fetchConnect = async (connect) => {
    console.log('Connecting ...');
    try {
      const response = await fetch('http://localhost:8080/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ connect }),
      });
      if (response.ok) {
        console.log('Connected successfully');
        localStorage.setItem('connect', connect);
      } else {
        alert('Please go to profile to update your webserver IP');
      }
    } catch (error) {
      alert('Please go to profile to check your webserver IP');
    }
  };

  const handleSave = () => {
    setSettings({ mode, language, connect });
    fetchConnect(connect === 'MQTT' ? 'MQTT' : 'WSV');
  };

  return (
    <Box sx={{ p: 3, maxWidth: '500px', mx: 'auto' }}> {/* Giới hạn chiều rộng của Box */}
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2, maxWidth: '300px' }}>
          <InputLabel>Mode</InputLabel>
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            label="Mode"
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2, maxWidth: '300px' }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            label="Language"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="vi">Vietnamese</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2, maxWidth: '300px' }}>
          <InputLabel>Connect</InputLabel>
          <Select
            value={connect}
            onChange={(e) => setConnect(e.target.value)}
            label="Connect"
          >
            <MenuItem value="MQTT">MQTT</MenuItem>
            <MenuItem value="Webserver">Webserver</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            onClick={handleSave} // Đảm bảo handleSave được gọi khi nhấn nút
          >
            Save Settings
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
