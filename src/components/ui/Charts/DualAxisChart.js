import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import dayjs from 'dayjs';

const DualAxisChart = ({ token }) => {
  const [data, setData] = useState(null); // Set initial state to null

  useEffect(() => {
    const fetchTemperatureHumidityData = async () => {
      try {
        const [tempResponse, humiResponse] = await Promise.all([
          fetch('http://localhost:8080/sensor/temp', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:8080/sensor/humi', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        const tempResult = await tempResponse.json();
        const humiResult = await humiResponse.json();

        if (tempResponse.ok && humiResponse.ok) {
          const combinedData = tempResult.data.map((tempEntry, index) => ({
            time: tempEntry.time,
            temperature: tempEntry.value,
            humidity: humiResult.data[index]?.value || 0,
          }));

          const filteredData = combinedData.filter(entry => 
            dayjs(entry.time).isAfter(dayjs().subtract(7, 'day'))
          );

          setData(filteredData);
        } else {
          console.error('Error:', tempResult.message || humiResult.message);
        }
      } catch (error) {
        console.error('Error fetching temperature and humidity data:', error);
      }
    };

    fetchTemperatureHumidityData();
  }, [token]);

  // If data is null or empty, use default data
  const displayData = data && data.length > 0 ? data : [{ time: 'No Data', temperature: 0, humidity: 0 }];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="left" orientation="left" stroke="#f50a0a" />
        <YAxis yAxisId="right" orientation="right" stroke="#0a16f5" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="temperature" fill="#f50a0a" />
        <Bar yAxisId="right" dataKey="humidity" fill="#0a16f5" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DualAxisChart;
