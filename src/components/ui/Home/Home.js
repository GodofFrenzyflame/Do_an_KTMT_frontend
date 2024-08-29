import React, { useEffect, useState, useContext } from 'react';
import DualAxisChart from '../Charts/DualAxisChart'; // Import the new chart component
import Map from '../Map/Map';
import { Box, Typography, Grid, Paper } from '@mui/material';
import AppContext from '../Setting/language/AppContext';
import TemperatureGauge from '../Charts/TemperatureGauge';
import HumidityGauge from '../Charts/HumidityGauge';

const Home = () => {

  const [relaysHome, setRelaysHome] = useState([]);

  const { settings } = useContext(AppContext);
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';
  const getBoxBackgroundColor = () => settings.color === 'dark' ? '#212121' : '#caccca';

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
    <Box sx={{ paddingLeft: '2%' }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: '1%' }}>
        {relaysHome.map((relay) => (
          <Grid item xs={12} sm={gridItemWidths[relaysHome.length]} key={relay.relay_id}>
            <Paper
              elevation={3}
              sx={{
                p: '2%',
                textAlign: 'center',
                bgcolor: getBoxBackgroundColor(relay.state),
                color: getWordColor(),
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
          <Paper elevation={3} className="chart-container" sx={{ bgcolor: getBoxBackgroundColor() }}>
            <TemperatureGauge />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={3} className="chart-container" sx={{ bgcolor: getBoxBackgroundColor() }}>
            <HumidityGauge />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={10} className="chart-container" sx={{ bgcolor: getBoxBackgroundColor() }}>
            <Map />
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: '2%', textAlign: 'left', bgcolor: getBoxBackgroundColor(), color: getWordColor(), mt: '1%' }}>
        <Typography variant="h6">Temperature & Humidity</Typography>
        <DualAxisChart /> {/* Replace History with DualAxisChart */}
      </Paper>
    </Box>
  );
};

export default Home;
