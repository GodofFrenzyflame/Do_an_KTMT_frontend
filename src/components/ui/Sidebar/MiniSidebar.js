import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, IconButton, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import RelayIcon from '@mui/icons-material/Power';
import ProfileIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';
import AppContext from '../Setting/language/AppContext';
import '../../../Styles/Styles.css';

export default function MiniSidebar({ onLogout, isOpen }) {
  const { settings } = useContext(AppContext);
  const location = useLocation();
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    // Lấy avatar từ localStorage khi component mount
    const savedAvatar = localStorage.getItem('avatar');
    setAvatar(savedAvatar || '');
  }, []);

  const isActive = (path) => location.pathname === path;

  const getBackgroundColor = (active) =>
    settings.color === 'dark' ? (active ? '#4361ee' : '#414a4c') : (active ? '#0013ff' : '#d6d6d6');

  const getButtonColor = () => (settings.color === 'dark' ? '#fff' : '#000');

  const getSidebarBackgroundColor = () => (settings.color === 'dark' ? '#333' : '#e6e3e3');

  return (
    <Box
      className={`minisidebar ${isOpen ? '' : 'minisidebar-closed'}`}
      sx={{
        display: isOpen ? 'flex' : 'none', // Chỉ hiện khi isOpen là true
        flexDirection: 'column',
        height: '30%',
        width: '3%', // Đặt chiều rộng của MiniSidebar là 3%
        backgroundColor: getSidebarBackgroundColor(),
        position: 'fixed',
        top: '6%',
        left: 10, // Điều chỉnh để sát cạnh trái màn hình
        borderRadius: '12px 12px 12px 12px', // Làm tròn góc phải
        zIndex: 1200, // Đảm bảo nó nằm trên các thành phần khác
        padding: '0.5%', // Thêm khoảng trống nhỏ bên trong
        boxSizing: 'border-box', // Đảm bảo padding không ảnh hưởng đến chiều rộng thực tế
        alignItems: 'center', // Canh giữa các nút icon theo chiều ngang
      }}
    >
      {/* Điều chỉnh kích cỡ avatar sao cho đồng nhất với icon */}
      <Avatar src={avatar} sx={{ width: 40, height: 40, mb: 2 }} />

      {/* Icon cho Home */}
      <Link to="/home" style={{ textDecoration: 'none' }}>
        <IconButton
          sx={{
            bgcolor: getBackgroundColor(isActive('/home')),
            color: getButtonColor(),
            marginBottom: '10%', // Khoảng cách giữa các nút
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            fontSize: '1.5rem', // Kích thước icon
          }}
        >
          <HomeIcon />
        </IconButton>
      </Link>

      {/* Icon cho History */}
      <Link to="/history" style={{ textDecoration: 'none' }}>
        <IconButton
          sx={{
            bgcolor: getBackgroundColor(isActive('/history')),
            color: getButtonColor(),
            marginBottom: '10%',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            fontSize: '1.5rem',
          }}
        >
          <HistoryIcon />
        </IconButton>
      </Link>

      {/* Icon cho Relay */}
      <Link to="/relay" style={{ textDecoration: 'none' }}>
        <IconButton
          sx={{
            bgcolor: getBackgroundColor(isActive('/relay')),
            color: getButtonColor(),
            marginBottom: '10%',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            fontSize: '1.5rem',
          }}
        >
          <RelayIcon />
        </IconButton>
      </Link>

      {/* Icon cho Profile */}
      <Link to="/profile" style={{ textDecoration: 'none' }}>
        <IconButton
          sx={{
            bgcolor: getBackgroundColor(isActive('/profile')),
            color: getButtonColor(),
            marginBottom: '10%',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            fontSize: '1.5rem',
          }}
        >
          <ProfileIcon />
        </IconButton>
      </Link>

      {/* Icon cho Settings */}
      <Link to="/setting" style={{ textDecoration: 'none' }}>
        <IconButton
          sx={{
            bgcolor: getBackgroundColor(isActive('/setting')),
            color: getButtonColor(),
            marginBottom: '10%',
            '&:hover': {
              bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
            },
            fontSize: '1.5rem',
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Link>

      {/* Icon cho Logout */}
      {/* <IconButton
        sx={{
          bgcolor: '#f44336',
          color: '#fff',
          marginBottom: '10%',
          '&:hover': {
            bgcolor: '#c62828',
          },
          mt: 'auto',
          fontSize: '1.5rem', // Kích thước icon
        }}
        onClick={onLogout}
      >
        <LogoutIcon /> */}
      {/* </IconButton> */}
    </Box>
  );
}
