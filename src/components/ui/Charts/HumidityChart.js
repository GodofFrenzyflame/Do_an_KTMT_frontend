import React, { useEffect, useState, useContext } from 'react';
import {  ResponsiveContainer,  LineChart,  Line,
  XAxis,  YAxis,  CartesianGrid,  Tooltip,  Legend,
} from 'recharts';
import './Chart.css';
import AppContext from '../../../Pages/Setting/language/AppContext';
import { Box, Button, } from '@mui/material';
const HumiChart = () => {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(7);
  const { settings } = useContext(AppContext);
  const getWordColor = () => (settings.color === 'dark' ? '#ffffff' : '#000000');

  // const token = localStorage.getItem('accessToken');

  const loadData = async () => {
    const humi_now = parseFloat(localStorage.getItem('humidity') || '0'); // Chuyển đổi thành số
  
    let humidityData = [];
  
    const humidityDataString = localStorage.getItem('chart_humi' + time);
   
    if (humidityDataString) {
      humidityData = JSON.parse(humidityDataString);
    }
  
    const currentDate = new Date().toISOString().split('T')[0];
    
    humidityData.push({ date: currentDate, value: humi_now });
    const combinedData = humidityData.map((humiEntry, index) => ({
        time: humiEntry.date,
        humidity: parseFloat(humidityData[index]?.value || 0), // Đảm bảo giá trị là số
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
      : [{ time: 'No Data', humidity: 0 }];

  const maxHumidity = Math.max(...displayData.map((d) => d.humidity), 0);
  const humidityDomain = [0, maxHumidity + maxHumidity * 0.1];

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
          className="Chart-button"
          onClick={() => handleTimeChange(90)}
        >
          90 Days
        </Button>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

        {/* Humidity Chart */}
        <div style={{ width: '100%' }}>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={displayData} margin={{ top: 40, right: 30, left: 20, bottom: 0 }} >
              <CartesianGrid stroke={getWordColor()} strokeDasharray="1 3" />
              <XAxis dataKey="time" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#0000ff"
                domain={humidityDomain}
                tickFormatter={formatYAxis} // Định dạng giá trị trục Y
                label={{
                  value: '%',
                  angle: 0,
                  position: 'insideTopLeft',
                  
                  style: {
                    textAnchor: 'middle',
                    fill: '#0000ff',
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
                dataKey="humidity"
                stroke="#0000ff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>
    </div>
  );
};

export default HumiChart;
