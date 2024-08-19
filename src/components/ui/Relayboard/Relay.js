import React from "react";
import { Box, Container, Typography, Grid, Paper } from '@mui/material';


const Relay = ()=>{
    return (
    <Container maxWidth="xxl" sx={{ px: { xs: '1%', sm: '1%', md: '1%' }, py: { xs: '5%', sm: '1%' }  }}>
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
    </Container>
);

};

export default Relay;