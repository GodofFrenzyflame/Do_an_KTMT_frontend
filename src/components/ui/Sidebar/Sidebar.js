import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography, Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import AppContext from '../Setting/language/AppContext';
import '../../../Styles/Styles.css';
import { useTranslation } from 'react-i18next';
import { SidebarData } from './Sidebardata';

export default function Sidebar({ onLogout, isOpen }) {
  const { settings } = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
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

  const getBackgroundColor = (active) =>
    settings.color === 'dark' ? (active ? '#4361ee' : '#414a4c') : (active ? '#0013ff' : '#d6d6d6');

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
        backgroundColor: getSidebarBackgroundColor(),
        position: 'fixed',
        top: 10,
        left: 10,
        borderRadius: '12px',
        zIndex: 1200,
        visibility: visibility,
        overflow: 'hidden',
        transition: 'visibility 0.3s, width 0.3s',
      }}
    >
      {/* Box chứa Avatar và thông tin người dùng */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          mb: '20%',
          mt: '5%',
          visibility: visibility,
        }}
      >
        <Avatar src={avatar} sx={{ width: 60, height: 60, mr: 2 }} />
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
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>

      {/* Sidebar Menu Items */}
      <ul className="sidebar-menu">
        {SidebarData.map((val, index) => (
          <li
            key={index}
            className={`row ${isActive(val.link) ? 'active' : ''}`}
            onClick={() => navigate(val.link)}
          >
            <div className="icon">{val.icon}</div> {/* Placeholder for the icon */}
            <div className="sidebar-title">{val.title}</div>
          </li>
        ))}
      </ul>


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
