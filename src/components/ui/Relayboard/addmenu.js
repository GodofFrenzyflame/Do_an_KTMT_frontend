// AddRelayMenu.js
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddRelayMenu = ({ onAddRelay, onAddRelayToHome }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddRelay = () => {
    handleClose();
    onAddRelay();
  };

  const handleAddRelayToHome = () => {
    handleClose();
    onAddRelayToHome();
  };

  return (
    <>
      <Tooltip title="Add Relay">
        <IconButton
          color="primary"
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            backgroundColor: '#3f51b5',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#303f9f',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleAddRelay}>Add Relay</MenuItem>
        <MenuItem onClick={handleAddRelayToHome}>Add Relay to Home</MenuItem>
      </Menu>
    </>
  );
};

export default AddRelayMenu;
