import React, { useEffect, useState, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Box, Typography } from '@mui/material';
import AppContext from '../Setting/language/AppContext';

const TemperatureGauge = () => {
  const { settings } = useContext(AppContext);
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';
  const [temperature, setTemperature] = useState(null);

  const fetchTemperaturData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/sensor/temp', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setTemperature(result.data);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchTemperaturData(accessToken);
    const intervalId = setInterval(() => {
      fetchTemperaturData(accessToken);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <CircularProgressbar
        value={temperature === null ? 0 : temperature}
        text={`${temperature === null ? 0 : temperature}°C`}
        styles={buildStyles({
          textColor: getWordColor(),
          pathColor: temperature < 15 ? '#00BFFF' : temperature < 80 ? '#FFD700' : '#FF4500',
          trailColor: '#eee',
        })}
        style={{
          width: '150px',
          height: '150px',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: getWordColor(),
        }}
      >
        🌡️ Temperature
      </Typography>
    </Box>
  );
};

export default TemperatureGauge;
