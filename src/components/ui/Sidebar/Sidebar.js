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
  const [coverPhoto, setCoverPhoto] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAvatar = localStorage.getItem('avatar');
        const savedUsername = localStorage.getItem('username');
        const savedEmail = localStorage.getItem('email');
        const savedCoverPhoto = localStorage.getItem('coverPhoto');

        setAvatar(savedAvatar || '');
        setCoverPhoto(savedCoverPhoto || '');
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


  return (
    <Box
      className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`}
      sx={{
        width: sidebarWidth,
        display: 'flex',
        flexDirection: 'column',
        height: '97%',
        position: 'fixed',
        top: 10,
        left: 10,
        borderRadius: '12px',
        zIndex: 1200,
        visibility: visibility,
        overflow: 'hidden',
        transition: 'visibility 0.3s, width 0.3s',
        background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.9) 5%, 
                    rgba(255, 255, 255, 1) 100%)`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '22%',
          backgroundImage: `url(${coverPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(2px)',
          zIndex: -1,
        
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          mb: '10%',
          mt: '20%',
          visibility: visibility,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Avatar src={avatar} sx={{ width: 60, height: 60, mr: 2, ml: 4 }} />
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
              maxWidth: '160px',
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ width: '90%', margin: '0 auto', mb: 1, backgroundColor: '#bdbdbd', position: 'relative', zIndex: 1 }} />

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
          borderRadius: '12px',
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
              alignItems: 'center',
              padding: '12px 0',
              mb: 0.5,
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              animation: isActive(val.link) ? 'rainbowBorder 5s infinite linear' : 'none', // Apply rainbow animation if active
              border: isActive(val.link) ? '1.5px solid transparent' : '2px solid transparent', // Use a border and keep it transparent for animation
              borderImage: isActive(val.link) ? 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet) 1' : 'none', // Set border image for active state
              '&:hover': {
                ...(isActive(val.link)
                  ? {} // Do not apply hover styles when the item is active
                  : {
                      border: '1.5px solid gray', // Gray border on hover if not active
                    }),
              },
            }}
          >
            <Box
              sx={{
                color: getButtonColor(),
                fontSize: '1.5em',
                marginLeft: '17%',
                mr: 2,
              }}
            >
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
      <Divider sx={{ width: '90%', margin: '0 auto', mb: 4, backgroundColor: '#bdbdbd', position: 'relative', zIndex: 1 }} />

      {/* Upgrade Section */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ 
          mb: '10%',
          ml: '10%',
          width: '80%',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 2,
          position: 'relative', // Thêm position relative để các phần tử con có thể định vị chính xác
        }}
      >
        <Box
          sx={{ 
            backgroundImage: 'url("/static/CardOCB.png")',
            backgroundSize: 'cover', // Đảm bảo hình ảnh phủ toàn bộ phần tử
            backgroundPosition: 'center', // Đặt hình ảnh ở giữa phần tử
            filter: 'blur(1px)', // Làm mờ hình ảnh nền
            borderRadius: '12px',
            position: 'absolute', // Đặt hình ảnh nền ở phía dưới cùng
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0, // Đặt hình ảnh nền dưới cùng
          }}
        />       
        <Box sx={{ width: '100%', textAlign: 'center', mb: 1, position: 'relative', zIndex: 1 }}>
          <Typography variant="h6" sx={{ color: getButtonColor(), fontWeight: 'bold', fontSize: '15px' }}>
            {t('Upgrade to Premium')}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', textAlign: 'center', mb: 1, position: 'relative', zIndex: 1 }}>
          <Typography variant="body2" sx={{ color: getButtonColor(), fontSize: '10px' }}>
            {t('You can get a lot more by upgrading to premium. Get all features now.')}
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
            fontSize: '0.5em',
            position: 'relative', // Đảm bảo nút không bị ảnh hưởng bởi lớp phủ mờ
            zIndex: 1,
          }}
          onClick={() => navigate('/upgrade')}
        >
          {t('UPGRADE NOW')}
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
