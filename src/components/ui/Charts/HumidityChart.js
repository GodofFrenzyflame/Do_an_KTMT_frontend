import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const HumidityChart = () => {
  const [humidityData, setHumidityData] = useState([30, 40, 50, 60, 70]); // Dữ liệu giả lập
  const [timeLabels, setTimeLabels] = useState(['0s', '10s', '20s', '30s', '40s']); // Nhãn thời gian giả lập

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Humidity',
        data: humidityData,
        borderColor: 'rgba(0, 0, 255, 1)',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={data} />;
};

export default HumidityChart;
