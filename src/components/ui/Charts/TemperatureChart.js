import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box, Typography } from '@mui/material';

const TemperatureGauge = () => {
  const temperature = 22; // Giá trị nhiệt độ hiện tại

  // Đặt các giá trị ngưỡng cho từng vùng
  const lowTemperatureZone = 10; // Ngưỡng nhiệt độ thấp (ví dụ: dưới 10°C)
  const highTemperatureZone = 50; // Ngưỡng nhiệt độ cao (ví dụ: trên 30°C)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '300px', // Kích thước chiều rộng của vòng tròn bên ngoài
        height: '300px', // Kích thước chiều cao của vòng tròn bên ngoài
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          border: '3px solid #000000', // Đường viền bao quanh hình tròn
          borderRadius: '50%', // Tạo hình tròn
          position: 'absolute', // Đặt vòng tròn bao quanh biểu đồ
          top: 0,
          left: 0,
          zIndex: 1, // Đảm bảo vòng tròn nằm trên đồng hồ đo
        }}
      />
      <GaugeChart
        id="gauge-chart-temperature"
        nrOfLevels={3}
        colors={['#FFFF00','#00FF00' , '#FF0000']} // Màu sắc cho các vùng (an toàn, nhiệt độ thấp, nhiệt độ cao)
        arcWidth={0.4} // Đặt độ rộng của cung lớn hơn
        percent={temperature / 100} // Chuyển đổi giá trị nhiệt độ thành phần trăm
        textColor="#000000"
        formatTextValue={value => `${value}°C`}
        needleColor="#345243"
        arcsLength={[
          lowTemperatureZone / 100,
          (highTemperatureZone - lowTemperatureZone) / 100,
          (100 - highTemperatureZone) / 100
        ]}
        style={{
          width: '135%', // Đặt kích thước đồng hồ đo bằng 135% của vòng tròn
          height: '100%', // Đặt kích thước đồng hồ đo bằng 100% của vòng tròn
          left: '1%', // Căn chỉnh đồng hồ đo để vừa khít với vòng tròn
          position: 'relative',
          zIndex: 2
        }}
      />
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          bottom: '65px', // Đặt vị trí tên biểu đồ cao hơn
          zIndex: 3, // Đảm bảo tên biểu đồ nằm trên đồng hồ đo và vòng tròn
        }}
      >
        - Temperature - 
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column', // Xếp các chú thích thành cột
          alignItems: 'flex-start', // Căn chỉnh các chú thích sang bên trái
          top: '10px', // Đặt khoảng cách từ góc trên của vòng tròn
          right: '-80px', // Đặt khoảng cách từ bên phải của vòng tròn
          zIndex: 3, // Đảm bảo các chú thích nằm trên đồng hồ đo và vòng tròn
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
