import React, { useEffect, useState , useContext } from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box, Typography } from '@mui/material';
import AppContext from '../../../AppContext';
// import { useTranslation } from 'react-i18next';


const HumidityGauge = () => {
    const { settings } = useContext(AppContext);
  // const { t } = useTranslation();


  //const getBackgroundColor = (active) => settings.color === 'dark' ? (active ? '#4361ee' : '#000f1f') : (active ? '#0013ff' : '#ffffff');
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';
  //const getboxBackgroundColor = () => settings.color === 'dark' ? '#214770' : '#e6e6e6';

  const [humidity, setHumidity] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const userid = localStorage.getItem('userId');
      console.log(userid);

      try {
        // Use query parameters for GET requests
        const response = await fetch(`http://localhost:8080/sensor/humi?userId=${encodeURIComponent(userid)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log(result);
        
        if (response.ok) {
          setHumidity(result.data);
        } else {
          console.error('Error:', result.message);
        }
      } catch (error) {
        console.error('Error fetching humidity data:', error);
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  // Đặt các giá trị ngưỡng cho từng vùng
  const lowHumidityZone = 40; // Ngưỡng độ ẩm thấp (ví dụ: dưới 40%)
  const highHumidityZone = 70; // Ngưỡng độ ẩm cao (ví dụ: trên 70%)

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
        id="gauge-chart-humidity"
        nrOfLevels={3}
        colors={['#00FF00', '#FFFF00', '#FF0000']} 
        arcWidth={0.2} 
        percent={humidity / 100} // Chuyển đổi giá trị độ ẩm thành phần trăm
        textColor="#000000"
        formatTextValue={value => `${value}%`}
        needleColor="#345243"
        arcsLength={[
          lowHumidityZone / 100,
          (highHumidityZone - lowHumidityZone) / 100,
          (100 - highHumidityZone) / 100,
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
        - 💧Humidity - 
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

export default HumidityGauge;
