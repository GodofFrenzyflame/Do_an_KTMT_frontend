// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
// import axios from 'axios';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// const TemperatureChart = () => {
//   const [temperatureData, setTemperatureData] = useState([]);
//   const [timeLabels, setTimeLabels] = useState([]);

//   useEffect(() => {
//     // Make API request to receive messages from MQTT broker
//     axios.get('/api/mqtt/receive')
//       .then(response => {
//         const { topic, message } = response.data;
//         if (topic === 'sensor/temperature') {
//           setTemperatureData((prevData) => [...prevData, message]);
//           setTimeLabels((prevLabels) => [...prevLabels, new Date().getTime()]);
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, [temperatureData]);

//   const data = {
//     labels: timeLabels,
//     datasets: [
//       {
//         label: 'Temperature',
//         data: temperatureData,
//         borderColor: 'rgba(255, 0, 0, 1)',
//         backgroundColor: 'rgba(255, 0, 0, 0.2)',
//         fill: true,
//       },
//     ],
//   };

//   return <Line data={data} />;
// };

// export default TemperatureChart;