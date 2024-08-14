import React from 'react';
import TemperatureChart from '../Charts/TemperatureChart';
import HumidityChart from '../Charts/HumidityChart';
import Map from '../Charts/Map';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="xxl" sx={{ px: { xs: '1%', sm: '1%', md: '1%' }, py: { xs: '5%', sm: '1%' } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: '1%' }}>
        Home 
      </Typography>

      {/* Relay Status Section */}
      <Box sx={{ mb: '2%' }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((relay) => (
            <Grid item xs={12} sm={6} md={3} key={relay}> 
              <Paper elevation={3} sx={{ p: '2%', textAlign: 'center' }}>
                <Typography variant="h6">Relay {relay}</Typography>
                <Typography variant="body1">Status: OFF</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Charts and Map Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} 
            sx={{ 
              p: '2%', 
              height: '35vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' }}>
            <TemperatureChart />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} 
            sx={{ 
              p: '2%', 
              height: '35vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' }}>
            <HumidityChart />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={10} 
            sx={{ 
              p: '2%', 
              height: '35vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' }}>
            <Map />
          </Paper>
        </Grid>
      </Grid>

      {/* History Section */}
      <Box sx={{ mt: '2%' }}>
        <Paper elevation={3} sx={{ p: '2%', textAlign: 'left' }}>
          <Typography variant="h6" sx={{ mb: '1%' }}>History</Typography>
          <Typography variant="body1" sx={{ mb: '2%' }}>
            {/* Placeholder cho lịch sử thay đổi biểu đồ */}
            Here will be the history of chart changes.
          </Typography>
          <Button variant="contained" color="primary">
            Refresh History
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
