import React, { useEffect, useState, useContext  } from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box, Typography } from '@mui/material';
import AppContext from '../../../AppContext';
//import { useTranslation } from 'react-i18next';


const TemperatureGauge = () => {
  const [temperature, setTemperature] = useState(0); // State để lưu trữ giá trị độ ẩm
  const { settings } = useContext(AppContext);
  // const { t } = useTranslation();


  //const getBackgroundColor = (active) => settings.color === 'dark' ? (active ? '#4361ee' : '#000f1f') : (active ? '#0013ff' : '#ffffff');
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';
  //const getboxBackgroundColor = () => settings.color === 'dark' ? '#214770' : '#e6e6e6';


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
      <Box/>
      <GaugeChart
        id="gauge-chart-temperature"
        nrOfLevels={3}
        colors={['#FFFF00', '#00FF00', '#FF0000']} 
        arcWidth={0.2} 
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
          zIndex: 1000
          }}
      />
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          bottom: '65px',
          zIndex: 1000,
          color: getWordColor ()
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
          zIndex: 1000
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '4px' }}>
          <Box sx={{ width: '15px', height: '15px', backgroundColor: '#00FF00', borderRadius: '50%', mr: '8px' }} />
          <Typography variant="caption" sx={{color: getWordColor ()}}>Safe</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '4px' }}>
          <Box sx={{ width: '15px', height: '15px', backgroundColor: '#FFFF00', borderRadius: '50%', mr: '8px' }} />
          <Typography variant="caption" sx={{color: getWordColor ()}}>Low</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '15px', height: '15px', backgroundColor: '#FF0000', borderRadius: '50%', mr: '8px' }} />
          <Typography variant="caption" sx={{color: getWordColor ()}}>High</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TemperatureGauge;
