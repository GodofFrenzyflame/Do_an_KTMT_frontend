import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Switch,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
  const [relays, setRelays] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', relayId: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRelay, setEditRelay] = useState(null);

  const loadRelays = () => {
    const savedRelays = localStorage.getItem('relays');
    if (savedRelays) {
      setRelays(JSON.parse(savedRelays));
    }
  };

  const saveRelays = (newRelays) => {
    localStorage.setItem('relays', JSON.stringify(newRelays));
  };

  useEffect(() => {
    loadRelays();

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchRelayGet(accessToken);

      const intervalId = setInterval(() => {
        fetchRelayGet(accessToken);
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    saveRelays(relays);
  }, [relays]);

  const fetchRelayGet = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/relay', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = await response.json();
      if (response.ok) {
        setRelays(result.relays);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }

  const fetchRelayAdd = async (token, relay_id, relay_name, state) => {
    try {
      const response = await fetch('http://localhost:8080/relay/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_id, relay_name, state }),
      });
      const result = await response.json();
      if (response.ok) {
        fetchRelayGet(token);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error adding relay:', error);
    }
  }

  const fetchRelaySet = async (token, relay_id, relay_name, new_relay_id) => {
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
        fetchRelayGet(token);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error setting relay:', error);
    }
  }

  const fetchRelayDelete = async (token, relay_id) => {
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
        fetchRelayGet(token);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error deleting relay:', error);
    }
  }

  const fetchStatusSet = async (token, relay_id, state) => {
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
        fetchRelayGet(token);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error setting status:', error);
    }
  }

  const handleToggle = (id) => {
    setRelays(relays.map((relay) =>
      relay.id === id ? { ...relay, status: !relay.status } : relay
    ));

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchStatusSet(accessToken, id, !relays.find(relay => relay.id === id).status);
    }
  };

  const handleAddCard = () => {
    setDialogOpen(true);
  };

  const handleSaveCard = () => {
    if (relays.some(relay => relay.name === newCard.name)) {
      alert('Relay with this name already exists.');
      return;
    }

    const newId = newCard.relayId ? Number(newCard.relayId) : (relays.length ? Math.max(...relays.map(relay => relay.id)) + 1 : 1);
    setRelays([...relays, { id: newId, name: newCard.name, status: false }].sort((a, b) => a.id - b.id));

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchRelayAdd(accessToken, newId, newCard.name, false);
    }

    setNewCard({ name: '', relayId: '' });
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
    ).sort((a, b) => a.id - b.id));

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchRelaySet(accessToken, editRelay.id, editRelay.name);
    }

    setEditRelay(null);
    setEditDialogOpen(false);
  };

  const handleDelete = (id) => {
    setRelays(relays.filter(relay => relay.id !== id).sort((a, b) => a.id - b.id));

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchRelayDelete(accessToken, id);
    }
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

      <Tooltip title="Add Relay" aria-label="add">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCard}
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            borderRadius: '50%',
            minWidth: '56px',
            minHeight: '56px',
            padding: 0
          }}
        >
          <AddIcon />
        </Button>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Relay</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Relay Name"
            type="text"
            fullWidth
            value={newCard.name}
            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Relay ID"
            type="number"
            fullWidth
            value={newCard.relayId}
            onChange={(e) => setNewCard({ ...newCard, relayId: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveCard} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Relay</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Relay Name"
            type="text"
            fullWidth
            value={editRelay?.name || ''}
            onChange={(e) => setEditRelay({ ...editRelay, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RelayGrid;
