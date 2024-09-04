import React, { useEffect, useState, useContext } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import AppContext from '../Setting/language/AppContext';

const DualAxisChart = () => {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(7);
  const { settings } = useContext(AppContext);
  const getWordColor = () => (settings.color === 'dark' ? '#ffffff' : '#000000');

  // const token = localStorage.getItem('accessToken');

  const loadData = async () => {
    const temp_now = parseFloat(localStorage.getItem('temperature') || '0'); // Chuyển đổi thành số
    const humi_now = parseFloat(localStorage.getItem('humidity') || '0'); // Chuyển đổi thành số
  
    let temperatureData = [];
    let humidityData = [];
  
    const temperatureDataString = localStorage.getItem('chart_temp' + time);
    const humidityDataString = localStorage.getItem('chart_humi' + time);
  
    if (temperatureDataString) {
      temperatureData = JSON.parse(temperatureDataString);
    }
    if (humidityDataString) {
      humidityData = JSON.parse(humidityDataString);
    }
  
  
    const currentDate = new Date().toISOString().split('T')[0];
    temperatureData.push({ date: currentDate, value: temp_now });
    humidityData.push({ date: currentDate, value: humi_now });
   
    // Đảm bảo dữ liệu có cùng độ dài
    if (temperatureData.length > humidityData.length) {
      while (humidityData.length < temperatureData.length) {
        humidityData.push({ date: '', value: 0 });
      }
    } else if (humidityData.length > temperatureData.length) {
      while (temperatureData.length < humidityData.length) {
        temperatureData.push({ date: '', value: 0 });
      }
    }
  
    const combinedData = temperatureData.map((tempEntry, index) => ({
      time: tempEntry.date,
      temperature: parseFloat(tempEntry.value), // Đảm bảo giá trị là số
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
      : [{ time: 'No Data', temperature: 0, humidity: 0 }];

  const maxTemperature = Math.max(...displayData.map((d) => d.temperature), 0);
  const maxHumidity = Math.max(...displayData.map((d) => d.humidity), 0);

  const temperatureDomain = [0, maxTemperature + maxTemperature * 0.1];
  const humidityDomain = [0, maxHumidity + maxHumidity * 0.1];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1%',
          marginRight: '5%',
          marginTop: '0%',
        }}
      >
        <button onClick={() => handleTimeChange(7)}>7 Days</button>
        <button onClick={() => handleTimeChange(30)}>30 Days</button>
        <button onClick={() => handleTimeChange(90)}>90 Days</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Temperature Chart */}
        <div style={{ width: '48%' }}>
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

        {/* Humidity Chart */}
        <div style={{ width: '48%' }}>
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

export default DualAxisChart;
