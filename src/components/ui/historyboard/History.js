import React from 'react';
import historyData from './HistoryData';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const History = () => {
  const temperatureHistory = historyData.getTemperatureHistory();
  const humidityHistory = historyData.getHumidityHistory();

  return (
    <Box sx={{ p: 3, ml: '1.5cm', height: '80vh' }}>
      {/* Tiêu đề của trang */}
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
        History
      </Typography>

      {/* Container cho các ô lịch sử */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: 'calc(100% - 64px)' }}>
        {/* Ô Lịch sử relay on/of */}
        <Paper sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Typography variant="h4" gutterBottom>
            Relay History
          </Typography>
          <List>
            {temperatureHistory.map((record, index) => (
              <ListItem key={index}>
                <ListItemText primary={`Time: ${record.timestamp}, Temperature: ${record.temperature}°C`} />
              </ListItem>
            ))}
          </List>
        </Paper>
        {/* Ô Lịch sử Nhiệt độ */}
        <Paper sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Typography variant="h4" gutterBottom>
            Temperature History
          </Typography>
          <List>
            {temperatureHistory.map((record, index) => (
              <ListItem key={index}>
                <ListItemText primary={`Time: ${record.timestamp}, Temperature: ${record.temperature}°C`} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Ô Lịch sử Độ ẩm */}
        <Paper sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Typography variant="h4" gutterBottom>
            Humidity History
          </Typography>
          <List>
            {humidityHistory.map((record, index) => (
              <ListItem key={index}>
                <ListItemText primary={`Time: ${record.timestamp}, Humidity: ${record.humidity}%`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default History;
