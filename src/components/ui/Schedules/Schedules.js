import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Switch, Checkbox, Tooltip, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppIcon from '@mui/icons-material/Apps';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { toast } from 'react-toastify';

const token = localStorage.getItem('accessToken');

const SchedulesCard = ({ schedule, onToggle, onEdit, onDelete, showDeleteIcons }) => (
  <Box
  className={`neon-effect ${schedule.state ? 'on' : 'off'}`}
  sx={{
    border: '4px solid transparent',
    borderRadius: '17px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    margin: '8px',
    width: '100%',
    maxWidth: '600px',
    justifyContent: 'space-between',
    boxShadow: schedule.state
      ? '0px 8px 16px rgba(0, 255, 0, 0.5)'
      : '0px 4px 8px rgba(0, 0, 0, 0.3)',
    backgroundColor: schedule.state ? '#fff' : '#f0f0f0',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: schedule.state
        ? '0px 12px 24px rgba(0, 255, 0, 0.6)'
        : '0px 8px 16px rgba(0, 0, 0, 0.4)',
    },
  }}
>
  {/* Schedule Name */}
  <Typography sx={{  fontWeight: 'bold', fontSize: '1.2rem' }}>
    {schedule.schedule_name}
  </Typography>
  {/* Edit Icon */}
  <IconButton onClick={() => onEdit(schedule.schedule_id)} >
    <EditIcon color="primary" />
  </IconButton>
  <Typography sx={{ color: '#555' }}>{`Id : ${schedule.schedule_id}`}</Typography>

  {/* day */}
<Typography sx={{ color: '#555' }}>
{schedule.day
  ? schedule.day.map(day => day.slice(0, 3)).join(', ')
  : ''}
</Typography>


  {/* Time */}
  <Typography sx={{ color: '#555' }}>
    {schedule.time}
  </Typography>
  {/* Schedule State */}
  <Typography sx={{ color: schedule.state ? 'green' : 'red', fontWeight: 'bold' }}>
    {schedule.state ? 'On' : 'Off'}
  </Typography>
  {/* Toggle Switch */}
  <Switch
    checked={schedule.state}
    onChange={() => onToggle(schedule.schedule_id)}
  />



  {/* Delete Icon */}
  {showDeleteIcons && (
    <IconButton onClick={() => onDelete(schedule.schedule_id)} sx={{ marginLeft: '16px' }}>
      <DeleteIcon color="error" />
    </IconButton>
  )}
</Box>
);

const ScheduleGrid = () => {
  const [schedules, setSchedules] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ schedule_name: '', schedule_id: '', day: [], time: '', actions: [{ relayId: '', action: '' }] });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);
  const [relays, setRelays] = useState([]);
  const [mode, setMode] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedSchedulesJSON = localStorage.getItem('schedule');
    const storedSchedulesData = storedSchedulesJSON ? JSON.parse(storedSchedulesJSON) : [];
    setSchedules(storedSchedulesData);
    const storedRelaysJSON = localStorage.getItem('relays');
    const storedRelaysData = storedRelaysJSON ? JSON.parse(storedRelaysJSON) : [];
    const relays_schedule_add = storedRelaysData.map(relay => ({
      ...relay,
      state: false,
      relay_schedule: false
    }));
    setRelays(relays_schedule_add);
    localStorage.setItem('relays_schedule_add', JSON.stringify(relays_schedule_add));
  };

  useEffect(() => {
    loadData();
    if (localStorage.getItem('connect') === 'WSV') {
      const url = "ws://" + localStorage.getItem('webServerIp') + "/ws";
      const websocket = new WebSocket(url);

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.index !== undefined && data.state !== undefined) {
          setSchedules((prevSchedules) =>
            prevSchedules.map((schedule) =>
              schedule.schedule_id === data.index ? { ...schedule, state: data.state === 'ON' } : schedule
            )
          );
        }
      };
      return () => {
        websocket.close();
      };
    }
  }, []);

  const fetchScheduleAdd = async (schedule_name, day, time, actions) => {
    try {
      const response = await fetch('http://localhost:8080/schedule/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ schedule_name, day, time, actions }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('result', result);
        const scheduleId = result.id;
        const storedScheduleJSON = localStorage.getItem('schedule');
        const storedScheduleData = storedScheduleJSON ? JSON.parse(storedScheduleJSON) : [];
        storedScheduleData.push({ schedule_id: scheduleId, schedule_name, day, time, schedule_actions: actions });
        localStorage.setItem('schedule', JSON.stringify(storedScheduleData));
        setNewCard({ schedule_name: '', day: [], time: '', actions: [] });
        setDialogOpen(false);
        toast.success('Add successfully.');
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchScheduleSet = async (schedule_id, schedule_name, day, time, actions) => {
    try {
      const response = await fetch('http://localhost:8080/schedule/set', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          schedule_id: schedule_id,
          new_schedule_name: schedule_name,
          new_day: day,
          new_time: time,
          new_actions: actions
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Edit successfully.');

        const storedScheduleJSON = localStorage.getItem('schedule');
        const storedScheduleData = storedScheduleJSON ? JSON.parse(storedScheduleJSON) : [];
        const updatedSchedules = storedScheduleData.map((schedule) => {
          if (schedule.schedule_id === schedule_id) {
            return {
              ...schedule,
              schedule_name: schedule_name,
              day: day,
              time: time,
              actions: actions,
            };
          }
          return schedule;
        });
        localStorage.setItem('schedule', JSON.stringify(updatedSchedules));
        setNewCard({ schedule_name: '', day: [], time: '', actions: [] });
        setDialogOpen(false);
        loadData();
      }
      else {
        alert(result.error);
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error setting relay:', error);
    }
  };

  const fetchStatusSet = async (schedule_id, state) => {
    const connect = localStorage.getItem('connect');
    try {
      const response = await fetch('http://localhost:8080/schedule/set-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ schedule_id, state, connect }),
      });
      const result = await response.json();
      if (response.ok) {
        const storedScheduleJSON = localStorage.getItem('schedule');
        const storedScheduleData = storedScheduleJSON ? JSON.parse(storedScheduleJSON) : [];
        const updatedSchedules = storedScheduleData.map((schedule) =>
          schedule.schedule_id === schedule_id ? { ...schedule, state } : schedule
        );
        localStorage.setItem('schedule', JSON.stringify(updatedSchedules));
        setSchedules(updatedSchedules);
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

  const fetchScheduleDelete = async (schedule_id) => {
    try {
      const response = await fetch('http://localhost:8080/schedule/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ schedule_id }),
      });
      const result = await response.json();
      if (response.ok) {
        const storedScheduleJSON = localStorage.getItem('schedule');
        let storedScheduleData = storedScheduleJSON ? JSON.parse(storedScheduleJSON) : [];
        storedScheduleData = storedScheduleData.filter(schedule => schedule.schedule_id !== schedule_id);
        localStorage.setItem('schedule', JSON.stringify(storedScheduleData));
        toast.success('Delete successfully.');
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAddCard = () => {
    setDialogOpen(true);
    setMenuOpen(false);
    setMode('add');
  };

  const handleSaveCard = () => {
    const scheduledRelays = relays.filter(relay => relay.relay_schedule === true)
      .map(relay => ({
        relayId: relay.relay_id,
        action: relay.state ? 'ON' : 'OFF'
      }));
    const editCard = {
      ...newCard,
      actions: scheduledRelays
    };

    if (!editCard.schedule_name) {
      toast.error('Schedule name is required.');
      return;
    }
    if (editCard.day.length === 0) {
      toast.error('Select at least one day.');
      return;
    }
    if (!editCard.time) {
      toast.error('Time is required.');
      return;
    }
    if (editCard.actions.length === 0) {
      toast.error('Select at least one actions.');
      return;
    }
    if (mode === 'add') {
      fetchScheduleAdd(editCard.schedule_name, editCard.day, editCard.time, editCard.actions);
    }
    else if (mode === 'edit') {
      fetchScheduleSet(editCard.schedule_id, editCard.schedule_name, editCard.day, editCard.time, editCard.actions);
    }
  };

  const handleCheckSchedule = (id, checked, state) => {
    const storedRelayJSON = localStorage.getItem('relays_schedule_add');
    const storedRelayData = storedRelayJSON ? JSON.parse(storedRelayJSON) : [];
    const relay = storedRelayData.find((relay) => relay.relay_id === id);
    if (relay) {
      const finalChecked = checked === undefined ? relay.relay_schedule : checked;
      const finalState = state === undefined ? relay.state : state;
      relay.relay_schedule = finalChecked;
      relay.state = finalState;
      localStorage.setItem('relays_schedule_add', JSON.stringify(storedRelayData));
      setRelays(storedRelayData);
    } else {
      console.error('Relay not found:', id);
    }
  };

  const handleToggle = (id) => {
    const schedule = schedules.find(schedule => schedule.schedule_id === id);
    if (schedule) {
      fetchStatusSet(id, !schedule.state);
    } else {
      toast.error('Schedule not found:', id);
    }
  };

  const handleEditSchedule = (id) => {
    setMode('edit');
    const schedule = schedules.find(schedule => schedule.schedule_id === id);
    const relays = JSON.parse(localStorage.getItem('relays_schedule_add'));
    if (schedule && schedule.schedule_actions) {
      schedule.schedule_actions.forEach(item => {
        relays.forEach(relay => {
          if (relay.relay_id === item.relayId) {
            relay.state = item.action === 'ON';
            relay.relay_schedule = true;
          }
        });
      });
    }
    setNewCard({
      schedule_name: schedule.schedule_name,
      schedule_id: schedule.schedule_id,
      day: schedule.day,
      time: schedule.time,
      actions: schedule.schedule_actions
    });
    localStorage.setItem('relays_schedule_add', JSON.stringify(relays));
    setRelays(relays);
    setDialogOpen(true);
    setMenuOpen(false);
  };

  const handleDelete = (id) => {
    fetchScheduleDelete(id);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDeleteMode = () => {
    setShowDeleteIcons(!showDeleteIcons);
  };

  const handleCancel = () => {
    setNewCard({ schedule_name: '', schedule_id: '', day: [], time: '', actions: [] });
    setShowDeleteIcons(false);
    setDialogOpen(false)
    setMode('');
    loadData();
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflow: 'hidden', marginTop: '5%' ,mb:'50%'}}>
      {showDeleteIcons && (
        <div>
          <IconButton
            onClick={handleCancel}
            sx={{
              position: 'absolute',
              zIndex: 2,
              top: '80px',
              right: '437px',
              height: '30px',
              backgroundColor: '#f44336',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#d32f2f' },
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

      {schedules.map((schedule, index) => {
        if (index % 2 === 0) {
          return (
            <Box key={schedule.schedule_id} sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <SchedulesCard
                key={schedule.schedule_id}
                schedule={schedule}
                onToggle={handleToggle}
                onEdit={handleEditSchedule}
                onDelete={handleDelete}
                showDeleteIcons={showDeleteIcons}
              />
              {schedules[index + 1] && (
                <SchedulesCard
                  key={schedules[index + 1].schedule_id}
                  schedule={schedules[index + 1]}
                  onToggle={handleToggle}
                  onEdit={handleEditSchedule}
                  onDelete={handleDelete}
                  showDeleteIcons={showDeleteIcons}
                />
              )}
            </Box>
          );
        }
        return null;
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
            <Tooltip title="Add new schedule" placement="left">
              <IconButton
                onClick={handleAddCard}
                sx={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  mb: 1,
                  '&:hover': { backgroundColor: '#388e3c' },
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Mode" placement="left">
              <IconButton
                onClick={handleDeleteMode}
                sx={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  mb: 1,
                  '&:hover': { backgroundColor: '#d32f2f' },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <IconButton
          onClick={toggleMenu}
          sx={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          <AppIcon />
        </IconButton>
      </Box>

      {/* Add New Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{mode === 'add' ? 'Add Schedule' : 'Edit Schedule'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Schedule Name"
            value={newCard.schedule_name}
            onChange={(e) => setNewCard({ ...newCard, schedule_name: e.target.value })}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }} // Label always on top
          />

          <TextField
            margin="dense"
            label="Schedule ID"
            value={newCard.schedule_id}
            onChange={(e) => setNewCard({ ...newCard, schedule_id: e.target.value })}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true, // Read-only field
            }}
            InputLabelProps={{ shrink: true }} // Label always on top
          />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Select day</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {[
                  { day: 'Monday', abbrev: 'Mon' },
                  { day: 'Tuesday', abbrev: 'Tue' },
                  { day: 'Wednesday', abbrev: 'Wed' },
                  { day: 'Thursday', abbrev: 'Thu' },
                  { day: 'Friday', abbrev: 'Fri' },
                  { day: 'Saturday', abbrev: 'Sat' },
                  { day: 'Sunday', abbrev: 'Sun' }
                ].map(({ day, abbrev }) => (
                  <Button
                    key={day}
                    variant={newCard.day.includes(day) ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => {
                      setNewCard(prev => ({
                        ...prev,
                        day: prev.day.includes(day)
                          ? prev.day.filter(d => d !== day)
                          : [...prev.day, day]
                      }));
                    }}
                    sx={{
                      fontSize: '0.75rem',
                      borderRadius: '50%',
                      minWidth: '60px',
                      minHeight: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {abbrev}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <TextField
                  label="Time"
                  type="time"
                  variant="outlined"
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  sx={{ width: '150px' }}
                  value={newCard.time} // Synchronize with state
                  onChange={(e) => setNewCard(prev => ({ ...prev, time: e.target.value }))} // Update time in state
                />
              </Box>
            </Grid>
          </Grid>


          {/* Relay Selection Table */}
          <Box sx={{ position: 'relative' }}>
            <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Relay Name</TableCell>
                    <TableCell> State</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relays.map((relay) => (
                    <TableRow key={relay.relay_id}>
                      <TableCell>
                        <Checkbox
                          checked={relay.relay_schedule}
                          onChange={(e) => handleCheckSchedule(relay.relay_id, e.target.checked, relay.state)}
                        />
                      </TableCell>
                      <TableCell>{relay.relay_name}</TableCell>
                      <TableCell>
                        <Switch
                          checked={relay.state}
                          onChange={(e) => {
                            const newState = e.target.checked;
                            const updatedRelays = relays.map((r) =>
                              r.relay_id === relay.relay_id ? { ...r, state: newState } : r
                            );
                            setRelays(updatedRelays);
                            handleCheckSchedule(relay.relay_id, relay.relay_schedule, newState);
                          }}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>


              </Table>
            </TableContainer>

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSaveCard} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default ScheduleGrid;

