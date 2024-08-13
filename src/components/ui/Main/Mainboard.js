import React from 'react';
import TemperatureChart from '../Charts/TemperatureChart';
import HumidityChart from '../Charts/HumidityChart';
import Map from '../Charts/Map';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="xxl" sx={{ px: { xs: '1%', sm: '10%', md: '5%' }, py: { xs: '5%', sm: '1%' } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: '2%' }}>
       Home
      </Typography>

      {/* Relay Status Section */}
      <Box sx={{ mb: '2%' }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((relay) => (
            <Grid item xs={12} sm={6} md={3} key={relay}> 
              <Paper elevation={3} sx={{ p: '2%', textAlign: 'center' }}>
                <Typography variant="h6">Relay {relay}</Typography>
                <Typography variant="body1">Status: ON/OFF</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Charts and Map Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <Paper elevation={3} 
                sx={{ 
                  p: '2%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'left', 
                  height: '40vh' 
                }}>
                <TemperatureChart />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} 
                sx={{ 
                  p: '2%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'left', 
                  height: '40vh' }}>
                <HumidityChart />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={10} 
            sx={{ 
              p: '1%', 
              height: '88.5vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'left' }}>
            <Map />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
