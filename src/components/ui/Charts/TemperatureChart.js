import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box, Typography } from '@mui/material';

const TemperatureGauge = () => {
  const [temperature, setTemperature] = useState(0); // State để lưu trữ giá trị độ ẩm

  useEffect(() => {
    // Hàm để fetch dữ liệu từ backend
    const fetchData = async () => {
      try {
        const response = await fetch('/feeds/tempurature'); // URL API của backend
        const data = await response.json();
        setTemperature(data.humidity); // Cập nhật state với giá trị độ ẩm mới
      } catch (error) {
        console.error('Error fetching Tempurature data:', error);
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
        position: 'relative',
        width: '270px',
        height: '270px',
        right: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          border: '3px solid #000000',
          borderRadius: '50%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      <GaugeChart
        id="gauge-chart-temperature"
        nrOfLevels={3}
        colors={['#FFFF00', '#00FF00', '#FF0000']} 
        arcWidth={0.4} 
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
          width: '135%',
          height: '100%',
          left: '1%',
          position: 'relative',
          zIndex: 2,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          bottom: '65px',
          zIndex: 3,
        }}
      >
        - 🔥Temperature - 
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          top: '10px',
          left: '270px',
          zIndex: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '4px' }}>
          <Box sx={{ width: '15px', height: '15px', backgroundColor: '#00FF00', borderRadius: '50%', mr: '8px' }} />
          <Typography variant="caption">Safe</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '4px' }}>
          <Box sx={{ width: '15px', height: '15px', backgroundColor: '#FFFF00', borderRadius: '50%', mr: '8px' }} />
          <Typography variant="caption">Low</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '15px', height: '15px', backgroundColor: '#FF0000', borderRadius: '50%', mr: '8px' }} />
          <Typography variant="caption">High</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TemperatureGauge;
