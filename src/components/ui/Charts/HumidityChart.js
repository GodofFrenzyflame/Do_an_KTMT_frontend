import React, { useEffect, useState, useContext } from 'react';
import GaugeChart from 'react-gauge-chart';
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

  const lowHumidityZone = 40; // Ngưỡng độ ẩm thấp
  const highHumidityZone = 70; // Ngưỡng độ ẩm cao

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
      <GaugeChart
        id="gauge-chart-humidity"
        nrOfLevels={3}
        colors={['#00FF00', '#FFFF00', '#FF0000']}
        arcWidth={0.1}
        percent={humidity / 100}
        textColor="#000000"
        formatTextValue={value => `${value}%`}
        needleColor="#345243"
        arcsLength={[
          lowHumidityZone / 100,
          (highHumidityZone - lowHumidityZone) / 100,
          (100 - highHumidityZone) / 100,
        ]}
        style={{
          width: '100%', // Giảm kích thước để vừa với container
          height: 'auto',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: getWordColor()
        }}
      >
        💧Humidity 
      </Typography>
    </Box>
  );
};

export default HumidityGauge;
