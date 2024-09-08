import React, { useEffect, useState, useContext } from 'react';
import {  ResponsiveContainer,  LineChart,  Line,
    XAxis,  YAxis,  CartesianGrid,  Tooltip,  Legend,
} from 'recharts';
import { Box, Button, } from '@mui/material';
import AppContext from '../../../Pages/Setting/language/AppContext';
import './Chart.css';
const TempChart = () => {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(7);
  const { settings } = useContext(AppContext);
  const getWordColor = () => (settings.color === 'dark' ? '#ffffff' : '#000000');

  // const token = localStorage.getItem('accessToken');

  const loadData = async () => {
    const temp_now = parseFloat(localStorage.getItem('temperature') || '0'); // Chuyển đổi thành số
  
    let temperatureData = [];
  
    const temperatureDataString = localStorage.getItem('chart_temp' + time);
  
    if (temperatureDataString) {
      temperatureData = JSON.parse(temperatureDataString);
    }
    
    const currentDate = new Date().toISOString().split('T')[0];
    temperatureData.push({ date: currentDate, value: temp_now });

    const combinedData = temperatureData.map((tempEntry, index) => ({
      time: tempEntry.date,
      temperature: parseFloat(tempEntry.value), // Đảm bảo giá trị là số
    }));
  
    setData(combinedData);
  };
  
  // Định dạng lại trục Y cho đúng với định dạng số mong muốn
  const formatYAxis = (tickItem) => {
    return tickItem.toFixed(1); // Giới hạn số chữ số thập phân
  };
  

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  const displayData =
    data && data.length > 0
      ? data
      : [{ time: 'No Data', temperature: 0, humidity: 0 }];

  const maxTemperature = Math.max(...displayData.map((d) => d.temperature), 0);

  const temperatureDomain = [0, maxTemperature + maxTemperature * 0.1];

  return (
    <div>
      <Box className="Chart-button-group">
        <Button
          variant={time === 7 ? 'contained' : 'outlined'}
          className="Chart-button"
          onClick={() => handleTimeChange(7)}
        >
          7 Days
        </Button>
        <Button
          variant={time === 30 ? 'contained' : 'outlined'}
          className="Chart-button"
          onClick={() => handleTimeChange(30)}
        >
          30 Days
        </Button>
        <Button
          variant={time === 90 ? 'contained' : 'outlined'}
          className="chart-button"
          onClick={() => handleTimeChange(90)}
        >
          90 Days
        </Button>
      </Box>


      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Temperature Chart */}
        <div style={{ width: '100%' }}>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={displayData} margin={{ top: 40, right: 30, left: 20, bottom: 0 }} >
              <CartesianGrid stroke={getWordColor()} strokeDasharray="1 3" />
              <XAxis dataKey="time" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#ff0000"
                domain={temperatureDomain}
                tickFormatter={formatYAxis} // Định dạng giá trị trục Y
                label={{
                  value: '°C',
                  angle: 0,
                  position: 'insideTopLeft',
                  
                  style: {
                    textAnchor: 'middle',
                    fill: '#ff0000',
                    fontSize: 14,
                    fontWeight: 'bold',
                  },
                  offset: -10,
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke="#ff0000"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TempChart;
