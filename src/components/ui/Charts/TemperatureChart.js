import React, { useEffect, useState, useContext } from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box, Typography } from '@mui/material';
import AppContext from '../../../AppContext';

const TemperatureGauge = () => {
  const [temperature, setTemperature] = useState(0); // State để lưu trữ giá trị nhiệt độ
  const { settings } = useContext(AppContext);
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';

  useEffect(() => {
    // Hàm để fetch dữ liệu từ backend
    const fetchData = async () => {
      try {
        const response = await fetch('/feeds/temperature'); // URL API của backend
        const data = await response.json();
        setTemperature(data.temperature); // Cập nhật state với giá trị nhiệt độ mới
      } catch (error) {
        console.error('Error fetching Temperature data:', error);
      }
    };

    fetchData(); // Gọi hàm fetch dữ liệu
  }, []);

  // Đặt các giá trị ngưỡng cho từng vùng
  const lowTemperatureZone = 10; // Ngưỡng nhiệt độ thấp (ví dụ: dưới 10°C)
  const highTemperatureZone = 50; // Ngưỡng nhiệt độ cao (ví dụ: trên 50°C)

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
        id="gauge-chart-temperature"
        nrOfLevels={3}
        colors={['#FFFF00', '#00FF00', '#FF0000']} 
        arcWidth={0.1} 
        percent={temperature / 100} // Chuyển đổi giá trị nhiệt độ thành phần trăm
        textColor="#000000"
        formatTextValue={value => `${value}°C`}
        needleColor="#345243"
        arcsLength={[
          lowTemperatureZone / 100,
          (highTemperatureZone - lowTemperatureZone) / 100,
          (100 - highTemperatureZone) / 100,
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
        🔥Temperature 
      </Typography>
    </Box>
  );
};

export default TemperatureGauge;
