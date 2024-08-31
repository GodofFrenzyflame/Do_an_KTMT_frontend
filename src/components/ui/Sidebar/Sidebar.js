import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography, Avatar, Divider, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; 
import AppContext from '../Setting/language/AppContext';
import '../../../Styles/Styles.css';
import { useTranslation } from 'react-i18next';
import { SidebarData } from './Sidebardata';
import './Sidebar.css';

export default function Sidebar({ onLogout, isOpen }) {
  const { settings } = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); 
  const sidebarWidth = isOpen ? '19%' : '0';
  const visibility = isOpen ? 'visible' : 'hidden';

  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAvatar = localStorage.getItem('avatar');
        const savedUsername = localStorage.getItem('username');
        const savedEmail = localStorage.getItem('email');

        setAvatar(savedAvatar || '');
        setUsername(savedUsername || 'User');
        setEmail(savedEmail || 'user@example.com');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    const intervalId = setInterval(loadData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isActive = (path) => location.pathname === path;

  const getButtonColor = () => (settings.color === 'dark' ? '#fff' : '#000');

  const getSidebarBackgroundColor = () => (settings.color === 'dark' ? '#333' : '#e6e3e3');

  return (
    <Box
      className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`}
      sx={{
        width: sidebarWidth,
        display: 'flex',
        flexDirection: 'column',
        height: '97vh',
        position: 'fixed',
        top: 10,
        left: 10,
        borderRadius: '12px',
        zIndex: 1200,
        visibility: visibility,
        overflow: 'hidden',
        transition: 'visibility 0.3s, width 0.3s',
        background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 0.6) 20%, 
                    ${getSidebarBackgroundColor()} 20%, 
                    ${getSidebarBackgroundColor()} 100%)`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '22%',
          backgroundImage: `url(${avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(3px)',
          zIndex: -1,
        
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          mb: '20%',
          mt: '20%',
          visibility: visibility,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Avatar src={avatar} sx={{ width: 60, height: 60, mr: 2, ml: 4, mb: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ color: getButtonColor() }}>
            {username}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#000',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '180px',
              mb: 1,
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ width: '90%', margin: '0 auto', mb: 4, backgroundColor: '#bdbdbd', position: 'relative', zIndex: 1 }} />

      {/* Sidebar Links */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {SidebarData.map((val, index) => (
          <Box
          key={index}
          onClick={() => navigate(val.link)}
          sx={{
            width: '90%',
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '12px 0',
            mb: 1,
            borderRadius: '12px',
            position: 'relative',
            backgroundColor: getSidebarBackgroundColor(),
            cursor: 'pointer',
            transition: 'border 0.3s, border-image 0.3s',
            zIndex: 0,
            overflow: 'hidden',
            
            // Ensuring the border color remains consistent
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              border: isActive(val.link) ? '2px solid transparent' : 'none',
              borderImage: isActive(val.link) ? 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)' : 'none',
              borderImageSlice: '1',
              animation: isActive(val.link) ? 'rainbowBorder 5s infinite linear' : 'none',
              zIndex: 0,
              boxSizing: 'border-box',
              pointerEvents: 'none',
            },
        
            // Hover styles
            '&:hover': {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid gray', // Gray border on hover
                borderImage: 'none',
                zIndex: -1,
              },
            },
          }}
        >
          <Box sx={{ color: getButtonColor(), fontSize: '1.5em', mr: 2, marginLeft: '17%' }}>
            {val.icon}
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: getButtonColor(),
              fontWeight: isActive(val.link) ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'left',
              marginLeft: '10%',
            }}
          >
            {val.title}
          </Typography>
        </Box>
        
        ))}
      </Box>

      {/* Upgrade Section */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ 
          mb: '10%',
          ml: '10%',
          width: '80%',
          bgcolor: '#fc03f8', 
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: getButtonColor(), fontWeight: 'bold' }}>
            Upgrade to Premium
          </Typography>
        </Box>
        <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ color: getButtonColor() }}>
            You can get a lot more by upgrading to premium. Get all features now.
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#1976d2',
            color: '#fff',
            '&:hover': {
              bgcolor: '#1565c0',
            },
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '0.9em',
          }}
          onClick={() => navigate('/upgrade')}
        >
          UPGRADE NOW
        </Button>
      </Grid>

      {/* Logout Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          bgcolor: '#f44336',
          color: '#fff',
          padding: '4% 8%',
          fontSize: '1vw',
          height: '4%',
          width: '90%',
          marginLeft: '5%',
          borderRadius: '8px',
          '&:hover': { 
            bgcolor: '#c62828',
          },
          mt: 'auto',
        }}
        onClick={onLogout}
      >
        {t('Log out')}
      </Button>

      <Box sx={{ height: '2%' }} />
    </Box>
  );
}
