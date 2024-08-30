import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography, Avatar, Divider } from '@mui/material';
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
        background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 0.6) 20%, 
                    ${getSidebarBackgroundColor()} 20%, 
                    ${getSidebarBackgroundColor()} 100%)`,
      }}
    >
      {/* Pseudo-element for blurred background image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '22%', // Adjust this to control the height of the blurred section
          backgroundImage: `url(${avatar})`,
          backgroundSize: 'cover', // 'cover' ensures the image covers the entire area while maintaining its aspect ratio
          backgroundPosition: 'center', // Centers the image in the blurred section
          backgroundRepeat: 'no-repeat',
          filter: 'blur(4px)', // Blur effect only on the background image
          zIndex: -1, // Ensure the blur effect is behind all content
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }}
      />

      {/* Box chứa Avatar và thông tin người dùng */}
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

      {/* Divider line */}
      <Divider sx={{ width: '90%', margin: '0 auto', mb: 4, backgroundColor: '#bdbdbd', position: 'relative', zIndex: 1  }} />

      {/* Bottom Section for Sidebar Menu Items */}
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
          backgroundColor: getSidebarBackgroundColor(), 
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
    borderRadius: '8px', // Bo góc cho viền
    backgroundColor: getSidebarBackgroundColor(), // Cùng màu với nền của sidebar
    cursor: 'pointer',
    transition: 'border 0.3s',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderImageSlice: 1,
    borderImageSource: isActive(val.link)
      ? 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)'
      : 'none', // Hiệu ứng cầu vồng khi được chọn
    animation: isActive(val.link)
      ? 'rainbowBorder 1s infinite linear'
      : 'none', // Chuyển động cầu vồng liên tục khi được chọn
    borderColor: isActive(val.link)
      ? 'transparent'
      : getSidebarBackgroundColor(), // Cùng màu với sidebar khi không được chọn
    '&:hover': {
      borderColor: isActive(val.link)
        ? 'transparent'
        : '#9e9e9e', // Màu xám đơn sắc khi hover
    },
    marginLeft: '1px',
    boxSizing: 'border-box',
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
