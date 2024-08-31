import React, { useEffect, useState, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Box, Typography } from '@mui/material';
import AppContext from '../Setting/language/AppContext';

const HumidityGauge = () => {
  const { settings } = useContext(AppContext);
  const getWordColor = () => (settings.color === 'dark' ? '#fff' : '#000');
  const [humidity, setHumidity] = useState(null);

  const loadData = () => {
    setHumidity(localStorage.getItem('humidity'));
  };



  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData();
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
