// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
// /import axios from 'axios';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// const HumidityChart = () => {
//   const [humidityData, setHumidityData] = useState([]);
//   const [timeLabels, setTimeLabels] = useState([]);

//   useEffect(() => {
//     // Make API request to receive messages from MQTT broker
//     // axios.get('/api/mqtt/receive')
//       .then(response => {
//         const { topic, message } = response.data;
//         if (topic === 'sensor/humidity') {
//           setHumidityData((prevData) => [...prevData, message]);
//           setTimeLabels((prevLabels) => [...prevLabels, new Date().getTime()]);
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, [humidityData]);

//   const data = {
//     labels: timeLabels,
//     datasets: [
//       {
//         label: 'Humidity',
//         data: humidityData,
//         borderColor: 'rgba(0, 0, 255, 1)',
//         backgroundColor: 'rgba(0, 0, 255, 0.2)',
//         fill: true,
//       },
//     ],
//   };

//   return <Line data={data} />;
// };

// export default HumidityChart;