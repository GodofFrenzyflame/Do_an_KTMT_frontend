import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography, Avatar, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; 
import AppContext from '../Setting/language/AppContext';
import '../../../Styles/Styles.css';
import { useTranslation } from 'react-i18next';
import { SidebarData } from './Sidebardata';

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

  const loadData = async () => {
    const savedAvatar = localStorage.getItem('avatar');
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('email');

    setAvatar(savedAvatar || '');
    setUsername(savedUsername || 'User');
    setEmail(savedEmail || 'user@example.com');
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData();
    }, 1000);
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
        background: `linear-gradient(to bottom, rgb(144, 238, 144) 0%, rgb(144, 238, 144) 10%, ${getSidebarBackgroundColor()} 17%, ${getSidebarBackgroundColor()} 100%)`,
      }}
    >
      {/* Box chứa Avatar và thông tin người dùng */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          mb: '5%',
          mt: '7%',
          visibility: visibility,
        }}
      >
        <Avatar src={avatar} sx={{ width: 60, height: 60, mr: 2, ml: 4, mb: 4 }} />
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
              mb: 4,
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>

      {/* Divider line */}
      <Divider sx={{ width: '90%', margin: '0 auto', mb: 2, backgroundColor: '#bdbdbd' }} />

      {/* Bottom Section for Sidebar Menu Items */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 'auto',
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
              borderRadius: '8px',
              backgroundColor: getSidebarBackgroundColor(),
              cursor: 'pointer',
              transition: 'border 0.3s',
              border: isActive(val.link) ? '2px solid #9e9e9e' : '2px solid transparent',
              marginLeft: '1px',
              boxSizing: 'border-box',
              '&:hover': {
                borderColor: '#9e9e9e',
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
