import React, { useState } from 'react';
import historyData from './HistoryData';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100% - 64px)' }}>
        {/* Biểu đồ */}
        <Paper sx={{ p: 3, flex: 2 }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Humidity (%)', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Lịch sử */}
        <Paper sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
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
    </Box>
  );
};

export default History;
