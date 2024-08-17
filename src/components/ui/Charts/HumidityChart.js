import React, { useEffect, useState, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Box, Typography } from '@mui/material';
import AppContext from '../../../AppContext';

const HumidityGauge = () => {
  const { settings } = useContext(AppContext);
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userid = localStorage.getItem('userId');

      try {
        const response = await fetch(`http://localhost:8080/sensor/humi?userId=${encodeURIComponent(userid)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        
        if (response.ok) {
          setHumidity(result.data);
        } else {
          console.error('Error:', result.message);
        }
      } catch (error) {
        console.error('Error fetching humidity data:', error);
      }
    };

    fetchData();
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
        value={humidity === null ? 0 : humidity} 
        text={`${humidity === null ? 0 : humidity}%`}
        styles={buildStyles({
          textColor: getWordColor(),
          pathColor: humidity < 40 ? '#FF0000' : humidity < 70 ? '#FFFF00' : '#00FF00',
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
        💧Humidity
      </Typography>
    </Box>
  );
};

export default HumidityGauge;
