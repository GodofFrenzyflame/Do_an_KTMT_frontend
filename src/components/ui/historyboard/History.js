import React, { useState } from 'react';
import historyData from './HistoryData';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';

const History = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);

  const handleFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredTemp = historyData.getTemperatureHistory().filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= start && recordDate <= end;
    });

    const filteredHumidity = historyData.getHumidityHistory().filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= start && recordDate <= end;
    });

    const mergedData = filteredTemp.map(tempRecord => {
      const correspondingHumidityRecord = filteredHumidity.find(humRecord => humRecord.timestamp === tempRecord.timestamp);
      return {
        timestamp: tempRecord.timestamp,
        temperature: tempRecord.temperature,
        humidity: correspondingHumidityRecord ? correspondingHumidityRecord.humidity : null,
      };
    });

    setFilteredHistory(mergedData);
  };

  return (
    <Box sx={{ p: 3, ml: '1.5cm', height: '80vh' }}>
      {/* Tiêu đề của trang */}
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
        History
      </Typography>

      {/* Form nhập thời gian */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ width: 200 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ width: 200 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" onClick={handleFilter}>
          Lọc
        </Button>
      </Box>

      {/* Lịch sử */}
      <Paper sx={{ p: 3, height: 'calc(100% - 64px)', overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Lịch sử
        </Typography>
        <List>
          {filteredHistory.map((record, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Time: ${record.timestamp}, Temperature: ${record.temperature}°C, Humidity: ${record.humidity}%`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default History;
