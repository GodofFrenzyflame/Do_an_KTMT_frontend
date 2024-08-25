import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Typography, IconButton, Switch, Checkbox
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Biểu tượng cho Add New Relay
import HomeIcon from '@mui/icons-material/Home'; // Biểu tượng cho Add to Home
import CloseIcon from '@mui/icons-material/Close'; // Biểu tượng cho đóng

const token = localStorage.getItem('accessToken');

const RelayCard = ({ relay, onToggle, onEdit, onDelete, oncheckHome }) => (
  <Box
    sx={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      margin: '8px',
      width: '100%',
      maxWidth: '600px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
      },
    }}
  >
    <Checkbox
      checked={relay.relay_home}
      onChange={() => oncheckHome(relay.relay_id)}
      sx={{ marginRight: '16px' }}
    />

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
    <IconButton onClick={() => onDelete(relay.relay_id)} sx={{ marginLeft: '16px' }}>
      <DeleteIcon color="error" />
    </IconButton>
  </Box>
);

const RelayGrid = () => {
  const [relays, setRelays] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', relayId: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRelay, setEditRelay] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadData = () => {
    const storedRelayJSON = localStorage.getItem('relays');
    const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
    setRelays(storedRelayData);
    console.log(storedRelayData)
  };

  useEffect(() => {
    loadData();
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
        loadData();
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error adding relay:', error);
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
        loadData();
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error deleting relay:', error);
    }
  };

  const fetchStatusSet = async (relay_id, state) => {
    try {
      const response = await fetch('http://localhost:8080/relay/set-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_id, state }),
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
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error setting status:', error);
    }
  };

  const fetchRelayHomeSet = async (relay_id, relay_home) => {
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
        const storedRelayJSON = localStorage.getItem('relays');
        const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
        const updatedRelays = storedRelayData.map((relay) =>
          relay.relay_id === relay_id ? { ...relay, relay_home } : relay
        );
        localStorage.setItem('relays', JSON.stringify(updatedRelays));
        setRelays(updatedRelays);
        loadData();
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error setting relay home:', error);
    }
  };
  
  const handleCheckHome = (id) => {
    const relay = relays.find(relay => relay.relay_id === id);
    if (relay) {
      fetchRelayHomeSet(id, !relay.relay_home);
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
      setEditRelay(null);
      setEditDialogOpen(false);
    }
  };

  const handleDelete = (id) => {
    fetchRelayDelete(id);
  };

  const handleAddToHome = () => {
    alert('Add to Home action');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '16px', alignItems: 'center' }}>
      
      {relays.map((relay) => (
        <RelayCard
          key={relay.relay_id}
          relay={relay}
          onToggle={handleToggle}
          onEdit={handleEditRelay}
          onDelete={handleDelete}
          oncheckHome={handleCheckHome}
        />
      ))}

      {/* Floating Action Button */}
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
            <IconButton
              onClick={handleAddCard}
              sx={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#3f51b5',
                color: '#fff',
                mb: 1,
                '&:hover': { backgroundColor: '#303f9f' },
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton
              onClick={handleAddToHome}
              sx={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#3f51b5',
                color: '#fff',
                '&:hover': { backgroundColor: '#303f9f' },
              }}
            >
              <HomeIcon />
            </IconButton>
          </Box>
        )}

        <IconButton
          color="primary"
          onClick={toggleMenu}
          sx={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#4800ff',
            color: '#000',
            '&:hover': { backgroundColor: '#030d99' },
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease-in-out',
            transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          {menuOpen ? <CloseIcon /> : <AddIcon />}
        </IconButton>
      </Box>

      {/* Dialog thêm mới Relay */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveCard}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa Relay */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Relay</DialogTitle>
        <DialogContent>
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
              />
              <TextField
                margin="dense"
                label="New Relay ID (optional)"
                type="text"
                fullWidth
                variant="outlined"
                value={editRelay.new_relay_id || ''}
                onChange={(e) => setEditRelay({ ...editRelay, new_relay_id: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RelayGrid;
