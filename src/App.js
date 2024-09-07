import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';


import Login from './Pages/Login/Login';
import Signup from './components/auth/Signup';


import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import History from './Pages/History/History';
import SidebarLayout from './Pages/Sidebar/Sidebarlayout';
import Relay from './Pages/Relay/Relay';
import Setting from './Pages/Setting/Setting';
import UpgradeSide from './components/ui/Upgrade/upgrade';
import AppContext from './Pages/Setting/language/AppContext';
import Schedules from './Pages/Schedules/Schedules';
import Footer from './components/ui/Footer/Footer';

function App() {
  const { settings } = useContext(AppContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

  const refreshAccessToken = async (state) => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await fetch('http://localhost:8080/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (response.ok) {
        const { accessToken } = result;
        localStorage.setItem('accessToken', accessToken);
        if (state === 'connect') await fetchConnect(accessToken, localStorage.getItem('connect'));
        else if (state === 'disconnect') await fetchDisconnect(accessToken);
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error during access token refresh:', error);
    }
  };

  const fetchConnect = async (token, connect) => {
    try {
      const response = await fetch('http://localhost:8080/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ connect }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('connected', 'true');
        localStorage.setItem('connect', connect);
        toast.success(`Connected to ${connect} successfully`);
      } else {
        console.error(result.error);
        if (response.status === 403) {
          await refreshAccessToken('connect');
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchDisconnect = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/connect/disconnect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
      } else {
        console.error(result.error);
        if (response.status === 403) {
          await refreshAccessToken('disconnect');
        }
      }
    } catch (error) {
      console.error('Error disconnecting from MQTT:', error);
    }
  };

  const fechLogout = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        fetchDisconnect(token);
        setIsLoggedIn(false);
        localStorage.clear();
        setSidebarOpen(false);
        console.log('Logged out successfully');
      } else {
        console.error(result.error);
        if (response.status === 403) {
          await refreshAccessToken('disconnect');
        }
      }
    } catch (error) {
      console.error('Error disconnecting from server:', error);
    }
  }

  const fetchRelayGet = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/relay/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const result = await response.json();
      if (response.ok) {
        const relayToStore = result.map(relay => ({
          relay_id: relay.relay_id,
          relay_name: relay.relay_name,
          state: relay.state
        }));

        const relayJSON = JSON.stringify(relayToStore);
        localStorage.setItem('relays', relayJSON);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }

  const fetchRelayGetHome = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/relay/get-home', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const result = await response.json();
      if (response.ok) {
        const relayToStore = result.map(relay => ({
          relay_id: relay.relay_id,
          relay_name: relay.relay_name,
          state: relay.state,
          relay_home: true,
        }));
        const relayJSON = JSON.stringify(relayToStore);
        localStorage.setItem('relays_home', relayJSON);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }

  const fetchProfileData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('username', result.data.username !== undefined ? result.data.username : '');
        localStorage.setItem('fullname', result.data.fullname !== undefined ? result.data.fullname : '');
        localStorage.setItem('email', result.data.email !== undefined ? result.data.email : '');
        localStorage.setItem('phone_number', result.data.phone_number !== undefined ? result.data.phone_number : '');
        localStorage.setItem('AIO_USERNAME', result.data.AIO_USERNAME !== undefined ? result.data.AIO_USERNAME : '');
        localStorage.setItem('AIO_KEY', result.data.AIO_KEY !== undefined ? result.data.AIO_KEY : '');
        localStorage.setItem('webServerIp', result.data.webServerIp !== undefined ? result.data.webServerIp : '');
        setImageInLocalStorage('avatar', result.data.avatar);
        setImageInLocalStorage('coverPhoto', result.data.coverPhoto);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchHumidityData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/sensor/humi', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('humidity', result.data);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching humidity data:', error);
    }
  };

  const fetchTemperaturData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/sensor/temp', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('temperature', result.data);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
  };

  const fetchTemperatureHumidityData = async (token, time) => {
    try {
      const tempResponse = await fetch('http://localhost:8080/log/temp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ time }),
      });
      if (!tempResponse.ok) {
        throw new Error('Failed to fetch temperature data');
      }
      const humiResponse = await fetch('http://localhost:8080/log/humi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ time }),
      });

      if (!humiResponse.ok) {
        throw new Error('Failed to fetch humidity data');
      }

      const tempResult = await tempResponse.json();
      const humiResult = await humiResponse.json();
      const humidityDataString = JSON.stringify(humiResult);
      const temperatureDataString = JSON.stringify(tempResult);

      localStorage.setItem('chart_humi' + time, humidityDataString);
      localStorage.setItem('chart_temp' + time, temperatureDataString);

    } catch (error) {
      console.error('Error fetching temperature and humidity data:', error);
    }
  };

  const fetchScheduleGet = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/schedule/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = await response.json();
      if (response.ok) {
        const scheduleToStore = result.map(schedule => ({
          schedule_id: schedule.schedule_id,
          schedule_name: schedule.schedule_name,
          state: schedule.state,
          day: schedule.day,
          time: schedule.time,
          schedule_actions: schedule.actions,
        }));

        const scheduleJSON = JSON.stringify(scheduleToStore);
        localStorage.setItem('schedule', scheduleJSON);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }

  const setImageInLocalStorage = (key, data) => {
    if (data) {
      const src = `data:${data.contentType};base64,${data.data}`;
      localStorage.setItem(key, src);
    } else {
      localStorage.setItem(key, '');
    }
  };

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    const accessToken = localStorage.getItem('accessToken');
    if (storedLoggedInStatus === 'true') {
      if (performance.navigation.type === 1) {
        localStorage.setItem('connected', 'false');
      }
      setIsLoggedIn(true);
      fetchRelayGet(accessToken);
      fetchRelayGetHome(accessToken);
      fetchProfileData(accessToken);
      fetchTemperaturData(accessToken);
      fetchHumidityData(accessToken);
      fetchScheduleGet(accessToken);
      const intervalId = setInterval(() => {
        fetchRelayGetHome(accessToken);
        fetchTemperaturData(accessToken);
        fetchHumidityData(accessToken);
        if (localStorage.getItem('connected') === 'false') {
          fetchConnect(accessToken, localStorage.getItem('connect'));
          fetchTemperatureHumidityData(accessToken, 7);
          fetchTemperatureHumidityData(accessToken, 30);
          fetchTemperatureHumidityData(accessToken, 90);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn]);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    const accessToken = localStorage.getItem('accessToken');
    fechLogout(accessToken);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleMouseMove = (e) => {
    const { clientX: x, clientY: y } = e;
    setBackgroundPosition({ x, y });
  };

  const getBackgroundColor = (active) => settings.mode === 'dark'
    ? `radial-gradient(circle at ${backgroundPosition.x}px ${backgroundPosition.y}px, #0c5c0e, #1e3963)`
    : `radial-gradient(circle at ${backgroundPosition.x}px ${backgroundPosition.y}px, #299121, #1e90ff)`;

  return (
    <Box onMouseMove={handleMouseMove}
      sx={{
        background: getBackgroundColor(),
       
      }}>
      <Router >
        <Routes >
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/home" /> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Login onLogin={handleLogin} />
                </Box>
            }
          />
          <Route
            path="/signup"
            element={
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Signup />
              </Box>
            }
          />
          <Route
            path="/home"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Home />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Profile />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/history"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <History />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/relay"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Relay />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/upgrade"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <UpgradeSide  />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />  
          <Route
            path="/schedules"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Schedules />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/setting"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Setting />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
        </Routes>
        <Footer />
      </Router>
      
    </Box>
  );
}

export default App;