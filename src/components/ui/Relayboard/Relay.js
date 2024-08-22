// relay.js
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, Switch, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const initialRelays = [
  { id: 1, name: 'Relay 1', status: false },
];

const RelayCard = ({ relay, onToggle, onEdit, onDelete }) => (
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
    <Typography sx={{ flex: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>{relay.name}</Typography>
    <IconButton onClick={() => onEdit(relay.id)} sx={{ marginRight: '16px' }}>
      <EditIcon color="primary" />
    </IconButton>
    <Typography sx={{ flex: 3, color: '#555' }}>{`Relay ${relay.id}`}</Typography>
    <Typography sx={{ flex: 1, color: relay.status ? 'green' : 'red' }}>{relay.status ? 'On' : 'Off'}</Typography>
    <Switch
      checked={relay.status}
      onChange={() => onToggle(relay.id)}
      sx={{ marginLeft: 'auto' }}
    />
    <IconButton onClick={() => onDelete(relay.id)} sx={{ marginLeft: '16px' }}>
      <DeleteIcon color="error" />
    </IconButton>
  </Box>
);

const RelayGrid = () => {
  const [relays, setRelays] = useState(initialRelays);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', relayName: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRelay, setEditRelay] = useState(null);
  const [status, setStatus] = useState(null); // Thêm state cho status

  useEffect(() => {
    const savedRelays = JSON.parse(localStorage.getItem('relays'));
    if (savedRelays) {
      setRelays(savedRelays);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('relays', JSON.stringify(relays));
  }, [relays]);

  const fetchStatus = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/sensor/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setStatus(result.status); // Lưu giá trị trạng thái
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    const token = 'your-auth-token'; // Thay thế bằng cách lấy token thực tế
    fetchStatus(token);
  }, []);

  const handleToggle = (id) => {
    setRelays(relays.map((relay) =>
      relay.id === id ? { ...relay, status: !relay.status } : relay
    ));
  };

  const handleAddCard = () => {
    setDialogOpen(true);
  };

  const handleSaveCard = () => {
    if (relays.some(relay => relay.name === newCard.name)) {
      alert('Relay with this name already exists.');
      return;
    }
    const newId = relays.length ? Math.max(...relays.map(relay => relay.id)) + 1 : 1;
    setRelays([...relays, { id: newId, name: newCard.name, status: false }]);
    setNewCard({ name: '', relayName: '' });
    setDialogOpen(false);
  };

  const handleEditRelay = (id) => {
    const relayToEdit = relays.find(relay => relay.id === id);
    setEditRelay(relayToEdit);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setRelays(relays.map(relay =>
      relay.id === editRelay.id ? { ...relay, name: editRelay.name } : relay
    ));
    setEditRelay(null);
    setEditDialogOpen(false);
  };

  const handleDelete = (id) => {
    setRelays(relays.filter(relay => relay.id !== id));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '16px', alignItems: 'center' }}>
      {relays.map((relay) => (
        <RelayCard
          key={relay.id}
          relay={relay}
          onToggle={handleToggle}
          onEdit={handleEditRelay}
          onDelete={handleDelete}
        />
      ))}
      <Tooltip title="Add New Card">
        <IconButton
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#0056b3',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={handleAddCard}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Relay</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Card Name"
            fullWidth
            variant="standard"
            value={newCard.name}
            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Relay ID"
            fullWidth
            variant="standard"
            value={newCard.relayName}
            onChange={(e) => setNewCard({ ...newCard, relayName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveCard}>Add</Button>
        </DialogActions>
      </Dialog>
      {editRelay && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Relay</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Relay Name"
              fullWidth
              variant="standard"
              value={editRelay.name}
              onChange={(e) => setEditRelay({ ...editRelay, name: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default RelayGrid;
