import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import AppContext from '../../../AppContext';
import '../../../styles/globalStyles.css';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ onLogout, isOpen }) {
  const { settings } = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const sidebarWidth = isOpen ? '19%' : '0%';

  const isActive = (path) => location.pathname === path;

  const getBackgroundColor = (active) => settings.color === 'dark' ? (active ? '#4361ee' : '#414a4c') : (active ? '#0013ff' : '#d6d6d6');
  const getButtonColor = () => settings.color === 'dark' ? '#fff' : '#000';
  const getSidebarBackgroundColor = () => settings.color === 'dark' ? '#333' : '#e6e3e3';

  return (
    <Box className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`} sx={{
      width: sidebarWidth, 
      display: 'flex', 
      flexDirection: 'column', 
      height: '97vh',
      backgroundColor: getSidebarBackgroundColor(),
      position: 'fixed',
      top: 10,
      left: 10,
      borderRadius: '12px',
      zIndex: 1200 // Ensure it is above other content
      
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '20%', mt: '5%' }}>
        <img 
          src="/static/Bku.ico" 
          alt="" 
          style={{ 
            maxWidth: '15%',
            height: 'auto',
            borderRadius: '0%',
            marginRight: '0%'
          }} 
        />
        <Typography variant="h6" sx={{ color: getButtonColor(), fontSize: '1.2vw' }}>
          Dashboard IoT
        </Typography>
      </Box>
      <Box sx={{ width: '100%', flexGrow: 1 }}>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: getBackgroundColor(isActive('/home')),
            color: getButtonColor(),
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
          }}>
            🏠{t('Home')}
          </Button>
        </Link>
        <Link to="/history" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: getBackgroundColor(isActive('/history')),
            color: getButtonColor(),
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            mt: '2%'
          }}>
            🧾{t('History')}
          </Button>
        </Link>
        <Link to="/relay" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: getBackgroundColor(isActive('/relay')),
            color: getButtonColor(),
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            mt: '2%'
          }}>
            🔘 {t('Relay')}
          </Button>
        </Link>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: getBackgroundColor(isActive('/profile')),
            color: getButtonColor(),
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            mt: '2%'
          }}>
            📑{t('Profile')}
          </Button>
        </Link>
        <Link to="/setting" style={{ textDecoration: 'none' }}>
          <Button variant="contained" fullWidth sx={{
            bgcolor: getBackgroundColor(isActive('/setting')),
            color: getButtonColor(),
            padding: '4% 8%',
            fontSize: '1.2vw',
            height: '7%',
            width: '90%',
            marginLeft: '5%',
            borderRadius: '8px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            mt: '2%'
          }}>
            📐{t('Settings')}
          </Button>
        </Link>
      </Box>
      <Button variant="contained" fullWidth sx={{
        bgcolor: '#f44336',
        color: '#fff',
        padding: '4% 8%',
        fontSize: '1.2vw',
        height: '7%',
        width: '90%',
        marginLeft: '5%',
        borderRadius: '8px',
        '&:hover': {
          bgcolor: '#c62828',
        },
        mt: 'auto'
      }} onClick={onLogout}>
        {t('Log out')}
      </Button>
      <Box sx={{ height: '2%' }} />
    </Box>
  );
}
