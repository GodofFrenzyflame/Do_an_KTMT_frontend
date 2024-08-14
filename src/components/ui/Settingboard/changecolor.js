import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppContext } from '../../../AppContext';

const App = () => {
  const { settings } = useContext(AppContext);

  const theme = createTheme({
    palette: {
      mode: settings.color === 'light' ? 'light' : 'dark',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* Các thành phần khác */}
    </ThemeProvider>
  );
};

export default App;
