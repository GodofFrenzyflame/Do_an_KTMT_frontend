import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, IconButton, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import RelayIcon from '@mui/icons-material/Power';
import ProfileIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
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
      className={`minisidebar ${isOpen ? 'minisidebar-open' : 'minisidebar-closed'}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '350px', // Đặt chiều cao của sidebar để nó chiếm toàn bộ chiều cao màn hình
        width: '60px', // Đặt chiều rộng phù hợp với kích thước của các nút
        backgroundColor: getSidebarBackgroundColor(),
        position: 'fixed',
        top: '50px',
        left: '10px',
        borderRadius: '12px 12px 12px 12px', // Làm tròn góc phải
        zIndex: 1200, // Đảm bảo nó nằm trên các thành phần khác
        padding: '10px', // Thêm khoảng trống bên trong
        boxSizing: 'border-box', // Đảm bảo padding không ảnh hưởng đến chiều rộng thực tế
        alignItems: 'center',
      }}
    >
      {/* Avatar */}
      <Avatar src={avatar} sx={{ width: 40, height: 40, mb: 2 }} />

      {/* Các nút điều hướng */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <IconButton
            sx={{
              bgcolor: getBackgroundColor(isActive('/home')),
              color: getButtonColor(),
              marginBottom: '10%',
              '&:hover': {
                bgcolor: settings.color === 'dark' ? '#2b35af' : '#2b35af',
              },
              fontSize: '1.5rem',
              width: '100%',
              height: '40px',
              justifyContent: 'center',
              zIndex: 1201, // Đảm bảo nút nằm trên cùng một lớp với sidebar
            }}
          >
            <HomeIcon />
          </IconButton>
        </Link>

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
              width: '100%',
              height: '40px',
              justifyContent: 'center',
              zIndex: 1201,
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Link>

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
              width: '100%',
              height: '40px',
              justifyContent: 'center',
              zIndex: 1201,
            }}
          >
            <RelayIcon />
          </IconButton>
        </Link>

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
              width: '100%',
              height: '40px',
              justifyContent: 'center',
              zIndex: 1201,
            }}
          >
            <ProfileIcon />
          </IconButton>
        </Link>

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
              width: '100%',
              height: '40px',
              justifyContent: 'center',
              zIndex: 1201,
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Link>

        {/* Logout Button */}
        <IconButton
          sx={{
            bgcolor: '#f44336',
            color: '#fff',
            marginBottom: '10%',
            '&:hover': {
              bgcolor: '#c62828',
            },
            mt: 'auto',
            width: '100%',
            height: '40px',
            justifyContent: 'center',
            fontSize: '1.5rem',
            zIndex: 1201,
          }}
          onClick={onLogout}
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
