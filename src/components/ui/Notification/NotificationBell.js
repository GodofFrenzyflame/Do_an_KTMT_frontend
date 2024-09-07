// src/components/NotificationBell.js
import React, { useState, useRef ,useContext }  from 'react';
import { IconButton, Popper, Typography, Box, Grid ,Button} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useClickAway } from 'react-use'; // Ensure this package is installed
import { useTranslation } from 'react-i18next';
import AppContext from '../../../Pages/Setting/language/AppContext';
import { useNavigate } from 'react-router-dom'; 
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const popperRef = useRef(null);
  const { settings } = useContext(AppContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getButtonColor = () => (settings.color === 'dark' ? '#fff' : '#000');
  const handleClick = () => {
    setOpen(prev => !prev);
  };

  useClickAway(popperRef, () => {
    setOpen(false);
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        right: '20px',
        borderRadius: '50%',
        zIndex: 1100,
      }}
    >
      <IconButton
        ref={anchorRef}
        onClick={handleClick}
        sx={{
          color: '#000',
          background: `linear-gradient(to bottom, 
          rgba(255, 255, 255, 0.6) 5%, 
          rgba(255, 255, 255, 1) 100%)`,
        }}
      >
        <NotificationsIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        ref={popperRef}
        sx={{
          zIndex: 1200,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          p: 2,
          maxWidth: '200px',
        }}
      >
        <Typography variant="body2" sx={{ mb:5}}></Typography>
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
        <Box sx={{ width: '100%', textAlign: 'center', mb: 1, position: 'relative', zIndex: 1 }}>
          <Typography variant="h6" sx={{ color: getButtonColor(), fontWeight: 'bold', fontSize: '15px' }}>
            {t('You should upgrade to use this function.')}
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

      </Popper>
    </Box>
  );
};

export default NotificationBell;
