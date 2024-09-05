import React, { useEffect, useState, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Box, Typography } from '@mui/material';
import AppContext from '../Setting/language/AppContext';
import LoadingSpinner from '../Loading/LoadingSpinner'; // Import component LoadingSpinner

const HumidityGauge = () => {
  const { settings } = useContext(AppContext);
  const getWordColor = () => (settings.color === 'dark' ? '#fff' : '#000');
  const [humidity, setHumidity] = useState(null);
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const loadData = () => {
    setLoading(true); // Bắt đầu loading
    try {
      const humidityData = localStorage.getItem('humidity');
      setHumidity(humidityData !== null ? Number(humidityData) : null);
    } finally {
      setLoading(false); // Kết thúc loading
    }
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
      {loading ? (
        <LoadingSpinner /> // Hiển thị LoadingSpinner khi đang tải
      ) : (
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
      )}
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
