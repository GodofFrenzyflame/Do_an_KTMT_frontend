import React, { useState, useContext } from 'react';
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { AppContext } from '../../../AppContext'; // Import context

const Settings = () => {
  const { settings, setSettings } = useContext(AppContext);
  const [color, setColor] = useState(settings.color);
  const [language, setLanguage] = useState(settings.language);

  const handleSave = () => {
    setSettings({ color, language });
  };

  return (
    <Box sx={{ p: 3, maxWidth: '500px', mx: 'auto' }}> {/* Giới hạn chiều rộng của Box */}
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 1, maxWidth: '300px' }}>
          <InputLabel>Color</InputLabel>
          <Select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            label="Color"
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
            <MenuItem value="es">Vietnamese</MenuItem>
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
