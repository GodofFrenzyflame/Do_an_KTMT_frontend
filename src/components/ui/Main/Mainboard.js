import React, { useContext } from 'react';
import TemperatureChart from '../Charts/TemperatureChart';
import HumidityChart from '../Charts/HumidityChart';
import Map from '../Charts/Map';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import AppContext from '../../../AppContext';
import { useTranslation } from 'react-i18next';

const Home = ({ isOpen }) => {
  const { settings } = useContext(AppContext);
  const { t } = useTranslation();

  const getBackgroundColor = (active) => settings.color === 'dark' ? (active ? '#4361ee' : '#000f1f') : (active ? '#0013ff' : '#ffffff');
  const getWordColor = () => settings.color === 'dark' ? '#fff' : '#000';
  const getBoxBackgroundColor = () => settings.color === 'dark' ? '#214770' : '#e6e6e6';

  return (
    <Box sx={{
      padding: '10%', 
      height: '100vh',
      backgroundColor: getBackgroundColor(),
      position: 'relative',
      zIndex: 1000, 
      overflow: 'hidden' /* Prevent overflow */
    }}>
      <Container maxWidth="xxl" sx={{ px: { xs: '1%', sm: '1%', md: '1%' }, py: { xs: '5%', sm: '1%' } }}>
        <Typography variant="h4" gutterBottom sx={{ mb: '1%', color: getWordColor() }}>
          {t('Home')}
        </Typography>

        <Box sx={{ mb: '2%' }}>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((relay) => (
              <Grid item xs={12} sm={6} md={3} key={relay}> 
                <Paper elevation={3} sx={{ p: '2%', textAlign: 'center', bgcolor: getBoxBackgroundColor(), color: getWordColor() }}>
                  <Typography variant="h6">Relay {relay}</Typography>
                  <Typography variant="body1">Status: OFF</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} 
              sx={{ 
                p: '2%', 
                height: '35vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: getBoxBackgroundColor(),
                overflow: 'hidden' /* Prevent chart overflow */
              }}>
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
                justifyContent: 'center',
                bgcolor: getBoxBackgroundColor(),
                overflow: 'hidden' /* Prevent chart overflow */
              }}>
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
                justifyContent: 'center',
                bgcolor: getBoxBackgroundColor(),
                overflow: 'hidden' /* Prevent chart overflow */
              }}>
              <Map />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: '2%' }}>
          <Paper elevation={3} sx={{ p: '2%', textAlign: 'left', bgcolor: getBoxBackgroundColor(), color: getWordColor() }}>
            <Typography variant="h6" sx={{ mb: '1%' }}>History</Typography>
            <Typography variant="body1" sx={{ mb: '2%' }}>
              Here will be the history of chart changes.
            </Typography>
            <Button variant="contained" color="primary">
              {t('Refresh History')}
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
