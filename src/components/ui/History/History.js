import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem } from '@mui/material';
import AppContext from '../Setting/language/AppContext';
import { useLocation } from 'react-router-dom';

const History = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const location = useLocation();
  const { settings } = useContext(AppContext);

  const getBoxBackgroundColor = () => settings.color === 'dark' ? '#212121' : '#ffffff'; // Fixed color code
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';

  useEffect(() => {
    const saveHistory = JSON.parse(localStorage.getItem('filteredHistory'));
    if (saveHistory) {
      setFilteredHistory(saveHistory);
    }
  }, []); // Added dependency array

  const handleFilter = () => {
    fetchLogGet(localStorage.getItem('accessToken'));
  };

  const fetchLogGet = async (token) => {
    if (!token) {
      console.error('No token available');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/log/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });

      const result = await response.json();

      if (response.ok) {
        setFilteredHistory(result);
        localStorage.setItem('filteredHistory', JSON.stringify(result)); // Save to localStorage
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  return (
    <Box sx={{ p: 3, ml: '1.5cm', height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Page title */}
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>History</Typography>

      {/* Time input form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>
        <Button variant="contained" onClick={handleFilter}>
          Filter
        </Button>
      </Box>

      <Paper sx={{
        p: 3, height: 'calc(100% - 64px)',
        overflowY: 'auto', width: '75%', mx: 'auto', mt: 3, border: '2px solid #ccc',
        bgcolor: getBoxBackgroundColor(),
        color: getWordColor(),
        borderRadius: '16px',
      }}>
        <List>
          {filteredHistory.map((record, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
              <Box sx={{ flexBasis: '40%', textAlign: 'center' }}>
                {new Date(record.Date).toLocaleString()}
              </Box>
              <Box sx={{ flexBasis: '1px', backgroundColor: '#ccc', height: '100%' }} />
              <Box sx={{ flexBasis: '60%', textAlign: 'left' }}>
                {record.activity}
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default History;
