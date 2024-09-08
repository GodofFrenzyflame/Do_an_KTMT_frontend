import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AppContext from './language/AppContext'; // Import context
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/ui/Loading/LoadingSpinner';

const Settings = () => {
  const { settings, setSettings } = useContext(AppContext);
  const [mode, setMode] = useState(settings.mode || 'light');
  const [language, setLanguage] = useState(settings.language);
  const [connect, setConnect] = useState(settings.connect || 'MQTT');
  const [loading, setLoading] = useState(false); 
  const token = localStorage.getItem('accessToken');

  const loadData = async () => {
    const storedMode = localStorage.getItem('mode');
    const storedLanguage = localStorage.getItem('language');
    const storedConnect = localStorage.getItem('connect');

    if (storedMode) setMode(storedMode);
    if (storedLanguage) setLanguage(storedLanguage);
    if (storedConnect) setConnect(storedConnect);
  };

  useEffect(() => {
    loadData();
  }, []);

  const fetchConnect = async (newConnect) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ connect: newConnect }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('connect', newConnect);
        toast.success(`Connected to ${newConnect} successfully`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Lưu `mode` và `language` ngay lập tức
    setSettings({ mode, language, connect });
    localStorage.setItem('mode', mode);
    localStorage.setItem('language', language);

    const storedConnect = localStorage.getItem('connect');

    // Chỉ gọi fetchConnect nếu kết nối thay đổi
    if (storedConnect !== connect) {
      fetchConnect(connect);
    } else {
      toast.info('No changes in connection settings');
    }
  };

  return (
    <Box
      sx={{
        p: 3, maxWidth: '500px', mx: 'auto',
        background: `linear-gradient(to bottom, 
          rgba(255, 255, 255, 0.4) 5%, 
          rgba(255, 255, 255, 0.7) 100%)`,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb:'50%'
      }}
    >
          
      
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2, maxWidth: '300px' }}>
          <InputLabel>Theme</InputLabel>
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

        <Box sx={{ mt: 2, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* Spinner aligned with the button */}
          {loading && (
            <Typography sx={{ mr: 7 }}>
              <LoadingSpinner />
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export default Settings;
