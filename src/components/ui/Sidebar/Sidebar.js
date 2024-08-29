import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Typography, Avatar } from '@mui/material';
import AppContext from '../Setting/language/AppContext';
import '../../../Styles/Styles.css';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ onLogout, isOpen }) {
  const { settings } = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const sidebarWidth = isOpen ? '19%' : '0%';
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
  }

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
      zIndex: 1200, // Ensure it is above other content
      visibility: visibility, // Điều chỉnh hiển thị khi ẩn sidebar
      overflow: 'hidden', // Ẩn nội dung tràn ra ngoài
      transition: 'visibility 0.3s, width 0.3s' // Hiệu ứng chuyển tiếp cho việc ẩn/hiện
    }}>
      {/* Box chứa Avatar và thông tin người dùng */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', mb: '20%', mt: '5%', visibility: visibility }}>
        <Avatar src={avatar} sx={{ width: 60, height: 60, mr: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ color: getButtonColor() }}>
            {username}
          </Typography>
          <Typography variant="body2" sx={{ color: getButtonColor() }}>
            {email}
          </Typography>
        </Box>
      </Box>

      {/* Các nút điều hướng */}
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
            {t('Home')}
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
            {t('History')}
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
            {t('Relay')}
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
            {t('Profile')}
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
            {t('Settings')}
          </Button>
        </Link>
      </Box>

      {/* Nút đăng xuất */}
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
