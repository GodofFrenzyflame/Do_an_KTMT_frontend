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

  const token = localStorage.getItem('accessToken');

  const loadData = async () => {
    const humi_now = localStorage.getItem('humidity');
    const temp_now = localStorage.getItem('temperature');

    let humidityData = [];
    let temperatureData = [];
    const humidityDataString = localStorage.getItem('chart_humi' + time);
    const temperatureDataString = localStorage.getItem('chart_temp' + time);
    if (humidityDataString) {
      humidityData = JSON.parse(humidityDataString);
    }
    if (temperatureDataString) {
      temperatureData = JSON.parse(temperatureDataString);
    }

    if (time === 30 || time === 90) {
      const currentDate = new Date().toISOString().split('T')[0];
      humidityData.push({ date: currentDate, value: humi_now });
      temperatureData.push({ date: currentDate, value: temp_now });
    }

    const combinedData = humidityData.map((tempEntry, index) => ({
      time: tempEntry.date,
      temperature: tempEntry.value,
      humidity: temperatureData[index]?.value || 0,
    }));
    setData(combinedData);
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData();
    }, 1500);
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
          marginTop: '1%',
        }}
      >
        <button onClick={() => handleTimeChange(7)}>7 Days</button>
        <button onClick={() => handleTimeChange(30)}>30 Days</button>
        <button onClick={() => handleTimeChange(90)}>90 Days</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Temperature Chart */}
        <div style={{ width: '48%' }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayData}>
              <CartesianGrid stroke={getWordColor()} strokeDasharray="1 3" />
              <XAxis dataKey="time" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#ff0000"
                domain={temperatureDomain}
                label={{
                  value: '°C',
                  angle: 0,
                  position: 'insideLeft',
                  style: {
                    textAnchor: 'middle',
                    fill: '#ff0000',
                    fontSize: 14,
                    fontWeight: 'bold',
                  },
                  offset: 15,
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayData}>
              <CartesianGrid stroke={getWordColor()} strokeDasharray="1 3" />
              <XAxis dataKey="time" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#0000ff"
                domain={humidityDomain}
                label={{
                  value: '%',
                  angle: 0,
                  position: 'insideLeft',
                  style: {
                    textAnchor: 'middle',
                    fill: '#0000ff',
                    fontSize: 14,
                    fontWeight: 'bold',
                  },
                  offset: 15,
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
