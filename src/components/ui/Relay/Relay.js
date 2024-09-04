import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Typography, IconButton, Switch, Checkbox, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppIcon from '@mui/icons-material/Apps';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Biểu tượng cho Add New Relay
import HomeIcon from '@mui/icons-material/Home'; // Biểu tượng cho Add to Home
import CloseIcon from '@mui/icons-material/Close'; // Biểu tượng cho đóng
import './Relay.css'
import { toast } from 'react-toastify';

const token = localStorage.getItem('accessToken');

const RelayCard = ({ relay,  onToggle,  onEdit,  onDelete,  oncheckHome,  showCheckboxes,  showDeleteIcons}) => (
  <Box
    className={`neon-effect ${relay.state ? 'on' : 'off'}`}
    sx={{

      border: '4px solid transparent',
      borderRadius: '17px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      margin: '8px',
      width: '100%',
      maxWidth: '600px',
      boxShadow: relay.state
        ? '0px 8px 16px rgba(0, 255, 0, 0.5)' // Tươi sáng khi bật
        : '0px 4px 8px rgba(0, 0, 0, 0.3)',   // Sậm màu khi tắt
      backgroundColor: relay.state
        ? '#fff'                               // Tươi sáng khi bật
        : '#f0f0f0',                           // Sậm màu khi tắt
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: relay.state
          ? '0px 12px 24px rgba(0, 255, 0, 0.6)' // Tươi sáng hơn khi hover và bật
          : '0px 8px 16px rgba(0, 0, 0, 0.4)',   // Sậm màu hơn khi hover và tắt
      },
    }}
  >
    {showCheckboxes && (
      <Checkbox
        checked={relay.relay_home}
        onChange={(e) => oncheckHome(relay.relay_id, e.target.checked)}
        sx={{ marginRight: '16px' }}
      />
    )}
    <Typography sx={{ flex: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>{relay.relay_name}</Typography>
    <IconButton onClick={() => onEdit(relay.relay_id)} sx={{ marginRight: '16px' }}>
      <EditIcon color="primary" />
    </IconButton>
    <Typography sx={{ flex: 2, color: '#555' }}>{`Relay ${relay.relay_id}`}</Typography>
    <Typography sx={{ flex: 1, color: relay.state ? 'green' : 'red', fontWeight: 'bold' }}>
      {relay.state ? 'On' : 'Off'}
    </Typography>
    <Switch
      checked={relay.state}
      onChange={() => onToggle(relay.relay_id)}
      sx={{ marginLeft: 'auto' }}
    />
    {showDeleteIcons && (
      <IconButton onClick={() => onDelete(relay.relay_id)} sx={{ marginLeft: '16px' }}>
        <DeleteIcon color="error" />
      </IconButton>
    )}
  </Box>
);

const RelayGrid = () => {
  const [relays, setRelays] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', relayId: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRelay, setEditRelay] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false); // State để quản lý hiển thị của checkbox
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);

  const handleKeyDown = (e, saveFunction) => {
    if (e.key === 'Enter') {
      saveFunction();
    }
  };

  const loadData = () => {
    const storedRelayJSON = localStorage.getItem('relays');
    const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
    setRelays(storedRelayData);
    let relaysHome = JSON.parse(localStorage.getItem('relays_home'));
    if (localStorage.getItem('relays_home_add')) {
      localStorage.removeItem('relays_home_add');
    }
    if (relaysHome) {
      let updatedRelaysHome = relaysHome.map(relay => {
        relay.relay_home = true;
        return relay;
      });
      localStorage.setItem('relays_home_add', JSON.stringify(updatedRelaysHome));
    } else {
      console.log('No relays_home data found in localStorage');
    }
  };

  useEffect(() => {
    loadData();
    if (localStorage.getItem('connect') === 'WSV') {
      const url = "ws://" + localStorage.getItem('webServerIp') + "/ws";
      const websocket = new WebSocket(url);

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.index !== undefined && data.state !== undefined) {
          setRelays((prevRelays) =>
            prevRelays.map((relay) =>
              relay.relay_id === data.index ? { ...relay, state: data.state === 'ON' } : relay
            )
          );
        }
      };
      return () => {
        websocket.close();
      };
    }
  }, []);

  const fetchRelayAdd = async (relay_id, relay_name, state) => {
    try {
      const finalRelayName = relay_name || `Relay ${relay_id}`;
      const response = await fetch('http://localhost:8080/relay/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_id, relay_name: finalRelayName, state }),
      });
      const result = await response.json();
      if (response.ok) {
        const storedRelayJSON = localStorage.getItem('relays');
        const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
        storedRelayData.push({ relay_id, relay_name: finalRelayName, state });
        localStorage.setItem('relays', JSON.stringify(storedRelayData));
        toast.success('Add successfully.');
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchRelaySet = async (relay_id, relay_name, new_relay_id) => {
    try {
      const response = await fetch('http://localhost:8080/relay/set', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_id, relay_name, new_relay_id }),
      });
      const result = await response.json();
      if (response.ok) {
        const storedRelayJSON = localStorage.getItem('relays');
        const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];

        const updatedRelays = storedRelayData.map((relay) => {
          if (relay.relay_id === relay_id) {
            return {
              ...relay,
              relay_name: relay_name || relay.relay_name,
              relay_id: new_relay_id || relay.relay_id,
            };
          }
          return relay;
        });
        localStorage.setItem('relays', JSON.stringify(updatedRelays));
        setRelays(updatedRelays);
        loadData();
        setEditRelay(null);
        setEditDialogOpen(false);
      } else {
        alert(result.error);
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error setting relay:', error);
    }
  };

  const fetchRelayDelete = async (relay_id) => {
    try {
      const response = await fetch('http://localhost:8080/relay/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_id }),
      });
      const result = await response.json();
      if (response.ok) {
        const storedRelayJSON = localStorage.getItem('relays');
        let storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
        storedRelayData = storedRelayData.filter(relay => relay.relay_id !== relay_id);
        localStorage.setItem('relays', JSON.stringify(storedRelayData));
        toast.success('Delete successfully.');
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchStatusSet = async (relay_id, state) => {
    const connect = localStorage.getItem('connect');
    try {
      const response = await fetch('http://localhost:8080/relay/set-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_id, state, connect }),
      });
      const result = await response.json();
      if (response.ok) {
        const storedRelayJSON = localStorage.getItem('relays');
        const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
        const updatedRelays = storedRelayData.map((relay) =>
          relay.relay_id === relay_id ? { ...relay, state } : relay
        );
        localStorage.setItem('relays', JSON.stringify(updatedRelays));
        setRelays(updatedRelays);
        loadData();
      } else {
        toast.error(result.error);
        console.error('Error:', result.message);
      }
    } catch (error) {
      toast.error(error);
      console.error('Error setting status:', error);
    }
  };

  const fetchRelayHomeSet = async (relay_id, relay_home, relay_name, state) => {
    try {
      const response = await fetch('http://localhost:8080/relay/set-home', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_id, relay_home }),
      });
      const result = await response.json();
      if (response.ok) {
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error setting home:', error);
    }
  };

  const handleCheckHome = (id, checked) => {
    const relay = relays.find((relay) => relay.relay_id === id);
    const storedRelayJSON = localStorage.getItem('relays_home_add');
    const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];

    if (relay) {
      const existingRelay = storedRelayData.find((storedRelay) => storedRelay.relay_id === id);

      if (checked) {
        if (existingRelay) {
          existingRelay.relay_home = true;
        } else {
          storedRelayData.push({
            relay_id: relay.relay_id,
            relay_name: relay.relay_name,
            state: relay.state,
            relay_home: true,
          });
        }
      } else {
        if (existingRelay) {
          existingRelay.relay_home = false;
        }
      }
      const updatedRelays = relays.map((relay) =>
        relay.relay_id === id ? { ...relay, relay_home: checked } : relay
      );
      localStorage.setItem('relays_home_add', JSON.stringify(storedRelayData));
      setRelays(updatedRelays);
    } else {
      console.error('Relay not found:', id);
    }
  };

  const handleToggle = (id) => {
    const relay = relays.find(relay => relay.relay_id === id);
    if (relay) {
      fetchStatusSet(id, !relay.state);
    } else {
      console.error('Relay not found:', id);
    }
  };

  const handleAddCard = () => {
    setDialogOpen(true);
    setMenuOpen(false);
  };

  const handleSaveCard = () => {
    if (!newCard.relayId) {
      alert('Relay ID is required.');
      return;
    }
    fetchRelayAdd(newCard.relayId, newCard.name, false);
    setNewCard({ name: '', relayId: '' });
    setDialogOpen(false);
  };

  const handleEditRelay = (id) => {
    const relayToEdit = relays.find(relay => relay.relay_id === id);
    setEditRelay(relayToEdit);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editRelay) {
      fetchRelaySet(editRelay.relay_id, editRelay.name, editRelay.new_relay_id);
    }
  };

  const handleDelete = (id) => {
    fetchRelayDelete(id);
  };

  const handleAddToHome = () => {
    const storedRelayJSON = localStorage.getItem('relays_home_add');
    const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
    const updatedRelays = relays.map((relay) => {
      const isRelayInHome = storedRelayData.some(
        (storedRelay) => storedRelay.relay_id === relay.relay_id && storedRelay.relay_home === true
      );
      return { ...relay, relay_home: isRelayInHome };
    });
    setRelays(updatedRelays);
    setShowCheckboxes(true);
    setShowDeleteIcons(false);
    setMenuOpen(false);
  };

  const handleDeleteMode = () => {
    setShowCheckboxes(false);
    setShowDeleteIcons(true);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAccpet = async () => {
    const storedRelayJSON = localStorage.getItem('relays_home_add');
    const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
    const relayHomeCount = storedRelayData.filter(relay => relay.relay_home === true).length;
    if (relayHomeCount > 4) {
      alert('You cannot add more than 4 relays to home.');
      return;
    }
    try {
      await Promise.all(storedRelayData.map(relay =>
        fetchRelayHomeSet(relay.relay_id, relay.relay_home, relay.relay_name, relay.state)
      ));
      const filteredRelays = storedRelayData.filter(relay => relay.relay_home === true);
      localStorage.setItem('relays_home', JSON.stringify(filteredRelays));
      localStorage.removeItem('relays_home_add');
      toast.success('Add to home successfully.');
      handleCancel();
    } catch (error) {
      toast.error(error)
      console.error('Error in handleAccept:', error);
    }
  }

  const handleCancel = async () => {
    loadData();
    setShowCheckboxes(false);
    setShowDeleteIcons(false);
    setMenuOpen(false);
  }

  const [position, setPosition] = useState('center');
  const [color, setColor] = useState('center');
  const [animating, setAnimating] = useState(false);

  const handleClick = (event) => {
    if (animating) return; // Không cho phép nhấp khi đang hoạt động

    setAnimating(true);

    const toggleWidth = event.currentTarget.offsetWidth;
    const clickX = event.clientX - event.currentTarget.getBoundingClientRect().left;

    if (clickX < toggleWidth / 3) {
      setPosition('left');
      setColor('left');
      handleCancel();
    } else if (clickX > (toggleWidth * 2) / 3) {
      setPosition('right');
      setColor('right');
      handleAccpet();
    } else {
      setPosition('center');
      setColor('center');
    }
    setTimeout(() => {
      setPosition('center');
      setColor('center');
      setAnimating(false);
    }, 400);
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflow: 'hidden', marginTop: '5%' }}>
      {showCheckboxes && (
        <div className="twin-toggle-container">
          <div className={`twin-toggle ${position} ${color}`} onClick={handleClick} >
            <div className="twin-toggle-knob"></div>
            <div className="twin-toggle-labels">
              <span>Cancel</span>
              <span>Accept</span>
            </div>
          </div>
        </div>
      )}

      {showDeleteIcons && (
        <div>
          <IconButton
            onClick={handleCancel}
            sx={{
              position: 'absolute', // Thêm position để z-index có hiệu lực
              zIndex: 2, // Đặt layer cao hơn cho IconButton
              top: '97px',
              right: '437px',
              height: '30px',
              backgroundColor: '#f44336',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
              borderRadius: '8px',
              boxShadow: 2,
              transition: 'background-color 0.3s ease',
              fontSize: '16px',
            }}

          >
            Cancel
          </IconButton>
        </div>
      )}

      {relays.map((relay, index) => {
        if (index % 2 === 0) {
          return (
            <Box key={relay.relay_id} sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              {/* First Relay in the pair */}
              <RelayCard
                key={relay.relay_id}
                relay={relay}
                onToggle={handleToggle}
                onEdit={handleEditRelay}
                onDelete={handleDelete}
                oncheckHome={handleCheckHome}
                showCheckboxes={showCheckboxes}
                showDeleteIcons={showDeleteIcons}
              />

              {/* Second Relay in the pair (if exists) */}
              {relays[index + 1] && (
                <RelayCard
                  key={relays[index + 1].relay_id}
                  relay={relays[index + 1]}
                  onToggle={handleToggle}
                  onEdit={handleEditRelay}
                  onDelete={handleDelete}
                  oncheckHome={handleCheckHome}
                  showCheckboxes={showCheckboxes}
                  showDeleteIcons={showDeleteIcons}
                />
              )}
            </Box>
          );
        }
        return null; // Skip rendering the second relay individually
      })}

      <Box
        sx={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

        }}
      >
        {menuOpen && (
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Nút Add New Card */}
            <Tooltip title="Add new Relay" placement="left">
              <IconButton
                onClick={handleAddCard}
                sx={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#4caf50', // Xanh lá cây
                  color: '#fff',
                  mb: 1,
                  '&:hover': { backgroundColor: '#388e3c' }, // Xanh lá cây đậm hơn
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>

            {/* Nút Add to Home */}
            <Tooltip title="Add Relay to Home" placement="left">
              <IconButton
                onClick={handleAddToHome}
                sx={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#2196f3', // Xanh dương
                  color: '#fff',
                  mb: 1,
                  '&:hover': { backgroundColor: '#1976d2' }, // Xanh dương đậm hơn
                }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>

            {/* Nút Delete */}
            <Tooltip title="Delete Relay" placement="left">
              <IconButton
                onClick={handleDeleteMode}
                sx={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#f76ae7',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#a30091' },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Nút Menu */}
        <IconButton
          color="primary"
          onClick={toggleMenu}
          sx={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: menuOpen ? '#f44336' : '#4800ff',
            color: '#fff',
            '&:hover': { backgroundColor: menuOpen ? '#f44336' : '#4800ff' },
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease-in-out',
            transform: menuOpen ? 'rotate(89deg)' : 'rotate(0deg)',
          }}
        >
          {menuOpen ? <CloseIcon /> : <AppIcon />}
        </IconButton>
      </Box>


      {/* Dialog thêm mới Relay */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '17px',
          },
        }}
      >
        <DialogTitle>Add New Relay</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Relay Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCard.name}
            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Relay ID"
            type="text"
            fullWidth
            variant="outlined"
            value={newCard.relayId}
            onChange={(e) => setNewCard({ ...newCard, relayId: e.target.value })}
            onKeyDown={(e) => handleKeyDown(e, handleSaveCard)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ 
            color: '#ff0000',
            '&:hover': {
                 bgcolor: '#ff0000' ,
                 color: '#fff'
            },
          }}>Cancel</Button>
          <Button onClick={handleSaveCard}  sx={{ 
            color: '#0004ff',
            bgcolor: '#fff',
            '&:hover': {
                 bgcolor: '#0004ff' ,
                 color: '#fff'
            },
          }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa Relay */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '17px',
          },
        }}
      >
        <DialogTitle>Edit Relay</DialogTitle>
        <DialogContent >
          {editRelay && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Relay Name"
                type="text"
                fullWidth
                variant="outlined"
                value={editRelay.name}
                onChange={(e) => setEditRelay({ ...editRelay, name: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
              />
              <TextField
                margin="dense"
                label="New Relay ID (optional)"
                type="text"
                fullWidth
                variant="outlined"
                value={editRelay.new_relay_id || ''}
                onChange={(e) => setEditRelay({ ...editRelay, new_relay_id: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ 
            color: '#ff0000',
            '&:hover': {
                 bgcolor: '#ff0000' ,
                 color: '#fff'
            },
          }}>Cancel</Button>
          <Button onClick={handleSaveEdit}  sx={{ 
            color: '#0004ff',
            bgcolor: '#fff',
            '&:hover': {
                 bgcolor: '#0004ff' ,
                 color: '#fff'
            },
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RelayGrid;
