import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';


import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Forget from './components/auth/Forget';

import Home from './components/ui/Home/Home';
import Profile from './components/ui/Profile/Profile';
import History from './components/ui/History/History';
import AuthenticatedLayout from './components/ui/Sidebar/Sidebarlayout';
import Relay from './components/ui/Relay/Relay';
import Setting from './components/ui/Setting/Setting';
import UpgradeSide from './components/ui/Upgrade/upgrade'
import AppContext from './components/ui/Setting/language/AppContext';
import Schedules from './components/ui/Schedules/Schedules';

function App() {
  const { settings } = useContext(AppContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

  const timePeriods = [7, 30, 90];

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
        if (result.data.avatar) {
          const avatarSrc = `data:${result.data.avatar.contentType};base64,${result.data.avatar.data}`;
          localStorage.setItem('avatar', avatarSrc);
        }
        else {
          localStorage.setItem('avatar', '');
        }
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

      // if (time === 30 || time === 90) {

      // console.log('humi_now', humi_now);
      // console.log('temp_now', temp_now);
      //   const currentDate = new Date().toISOString().split('T')[0];
      //   tempResult.push({ date: currentDate, value: humi_now });
      //   humiResult.push({ date: currentDate, value: temp_now });
      //   const humidityDataString = JSON.stringify(humiResult);
      //   const temperatureDataString = JSON.stringify(tempResult);
      //   console.log('humi_now', humidityDataString);
      //   console.log('temp_now', temperatureDataString);
      // }

      localStorage.setItem('chart_humi' + time, humidityDataString);
      localStorage.setItem('chart_temp' + time, temperatureDataString);
      // console.log('chart_humi' + time, localStorage.getItem('chart_humi' + time));
      // console.log('chart_temp' + time, localStorage.getItem('chart_temp' + time));

    } catch (error) {
      console.error('Error fetching temperature and humidity data:', error);
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
        //...gradientStyle, // Sử dụng gradient dựa trên vị trí con trỏ chuột
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
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100&' }}>
                <Signup />
              </Box>
            }
          />
          <Route
            path="/home"
            element={
              isLoggedIn ?
                <AuthenticatedLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Home />
                </AuthenticatedLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ?
                <AuthenticatedLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Profile />
                </AuthenticatedLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/history"
            element={
              isLoggedIn ?
                <AuthenticatedLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <History />
                </AuthenticatedLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/relay"
            element={
              isLoggedIn ?
                <AuthenticatedLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Relay />
                </AuthenticatedLayout>
                : <Navigate to="/" />
            }
          />
          <Route path="/forget" element={<Forget />} />
          <Route path="/upgrade" element={<UpgradeSide />} />
          
          <Route
            path="/schedules"
            element={
              isLoggedIn ?
                <AuthenticatedLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Schedules />
                </AuthenticatedLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/setting"
            element={
              isLoggedIn ?
                <AuthenticatedLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Setting />
                </AuthenticatedLayout>
                : <Navigate to="/" />
            }
          />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;