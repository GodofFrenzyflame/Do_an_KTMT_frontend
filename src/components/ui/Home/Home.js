import React, { useEffect, useState, useContext } from 'react';
import DualAxisChart from '../Charts/DualAxisChart'; // Import the new chart component
import Map from '../Map/Map';
import { Box, Typography, Grid, Paper } from '@mui/material';
import AppContext from '../Setting/language/AppContext';
import TemperatureGauge from '../Charts/TemperatureGauge';
import HumidityGauge from '../Charts/HumidityGauge';
import './Home.css';

const Home = () => {

  const [relaysHome, setRelaysHome] = useState([]);

  const { settings } = useContext(AppContext);
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';


  const gridItemWidths = {
    1: 12,
    2: 6,
    3: 4,
    4: 3,
  };

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('relays_home')) || [];
    setRelaysHome(data);
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);



  return (
    <Box sx={{ paddingLeft: '2%' ,paddingTop:'2%',mb:'20%'}}>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: '1%' }}>
        {relaysHome.map((relay) => (
          <Grid item xs={12} sm={gridItemWidths[relaysHome.length]} key={relay.relay_id}>
            <Paper
              elevation={3}
              className={`neon-effect ${relay.state ? 'on' : 'off'}`}
              sx={{
                p: '2%',
                textAlign: 'center',
                color: getWordColor(), // Có thể cần cập nhật để phù hợp với màu chữ
                position: 'relative', // Đảm bảo lớp ::before được căn đúng vị trí
              }}
            >
              <Typography variant="h6">{relay.relay_name}</Typography>
              <Typography variant="body1">Status: {relay.state ? 'ON' : 'OFF'}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>


      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} className="chart-container" sx={{background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 1) 100%)`,}}>
            <TemperatureGauge />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={3} className="chart-container" sx={{ background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 1) 100%)`, }}>
            <HumidityGauge />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={10} className="chart-container" sx={{ background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 1) 100%)`,}}>
            <Map />
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: '2%', textAlign: 'center', background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 1) 100%)`, color: getWordColor(), mt: '1%' }}>
        <Typography variant="h6">Temperature & Humidity</Typography>
        <DualAxisChart /> {/* Replace History with DualAxisChart */}
      </Paper>
      
    </Box>
  );
};

export default Home;
