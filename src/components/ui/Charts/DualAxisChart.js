import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const DualAxisChart = () => {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(7);

  const fetchTemperatureHumidityData = async (token) => {
    try {
      const [tempResponse, humiResponse] = await Promise.all([
        fetch('http://localhost:8080/log/temp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ time }),
        }),
        fetch('http://localhost:8080/log/humi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ time }),
        }),
      ]);

      const tempResult = await tempResponse.json();
      const humiResult = await humiResponse.json();

      if (tempResponse.ok && humiResponse.ok) {
        const combinedData = tempResult.map((tempEntry, index) => ({
          time: tempEntry.date,
          temperature: tempEntry.value,
          humidity: humiResult[index]?.value || 0,
        }));

        setData(combinedData);
      } else {
        console.error('Error:', tempResult.message || humiResult.message);
      }
    } catch (error) {
      console.error('Error fetching temperature and humidity data:', error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchTemperatureHumidityData(accessToken);
    const intervalId = setInterval(() => {
      fetchTemperatureHumidityData(accessToken);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [time]);

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  const displayData = data && data.length > 0 ? data : [{ time: 'No Data', temperature: 0, humidity: 0 }];

  // Find the maximum values for temperature and humidity
  const maxTemperature = Math.max(...displayData.map(d => d.temperature), 0);
  const maxHumidity = Math.max(...displayData.map(d => d.humidity), 0);

  // Add padding to the maximum values for better visibility
  const temperatureDomain = [0, maxTemperature + (maxTemperature * 0.1)];
  const humidityDomain = [0, maxHumidity + (maxHumidity * 0.1)];

  return (
    <div>
      <div>
        <button onClick={() => handleTimeChange(7)}>7 Days</button>
        <button onClick={() => handleTimeChange(30)}>30 Days</button>
        <button onClick={() => handleTimeChange(90)}>90 Days</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#ff0000" 
            domain={temperatureDomain} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#0000ff" 
            domain={humidityDomain} 
          />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff0000" strokeWidth={3} />
          <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#0000ff" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DualAxisChart;
