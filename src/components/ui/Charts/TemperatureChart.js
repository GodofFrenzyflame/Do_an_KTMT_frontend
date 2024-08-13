import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState([20, 22, 24, 26, 28]); // Dữ liệu giả lập
  const [timeLabels, setTimeLabels] = useState(['0s', '10s', '20s', '30s', '40s']); // Nhãn thời gian giả lập

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData,
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={data} />;
};

export default TemperatureChart;
