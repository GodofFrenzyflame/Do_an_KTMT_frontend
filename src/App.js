import React, { useState, useEffect, useContext} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';


import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Forget from './components/auth/Forget';

import Home from './components/ui/Home/Home';
import Profile from './components/ui/Profile/Profile';
import History from './components/ui/History/History';
import AuthenticatedLayout from './components/ui/Sidebar/Sidebarlayout';
import Relay from './components/ui/Relay/Relay';
import Setting from './components/ui/Setting/Setting';

import AppContext from './components/ui/Setting/language/AppContext';

function App() {
  const { settings } = useContext(AppContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
        if (state === 'connect') await fetchConnectMqtt(accessToken);
        else if (state === 'disconnect') await fetchDisconnectMqtt(accessToken);
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

  const fetchConnectMqtt = async (token) => {
    console.log('Connecting to MQTT...');
    try {
      const response = await fetch('http://localhost:8080/mqtt/connect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Connected to MQTT successfully');
      } else {
        console.error('Error:', result.message);
        if (response.status === 403) {
          await refreshAccessToken('connect');
        }
      }
    } catch (error) {
      console.error('Error connecting to MQTT:', error);
    }
  };

  const fetchDisconnectMqtt = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/mqtt/disconnect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
      } else {
        console.error('Error:', result.message);
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
        fetchDisconnectMqtt(token);
        localStorage.clear();
        setIsLoggedIn(false);
        console.log('Logged out successfully');
      } else {
        console.error('Error:', result.message);
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
        console.error('Error:', result.message);
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
          state: relay.state
        }));

        const relayJSON = JSON.stringify(relayToStore);
        localStorage.setItem('relays_home', relayJSON);
        console.log('Relay home:', localStorage.getItem('relays_home'));
      } else {
        console.error('Error:', result.message);
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
        localStorage.setItem('username', result.data.username);
        localStorage.setItem('fullname', result.data.fullname);
        localStorage.setItem('email', result.data.email);
        localStorage.setItem('phone_number', result.data.phone_number);
        localStorage.setItem('AIO_USERNAME', result.data.AIO_USERNAME);
        localStorage.setItem('AIO_KEY', result.data.AIO_KEY);
        if (result.data.avatar) {
          const avatarSrc = `data:${result.data.avatar.contentType};base64,${result.data.avatar.data}`;
          localStorage.setItem('avatar', avatarSrc);
        }
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
      fetchConnectMqtt(localStorage.getItem('accessToken'));
      fetchRelayGet(localStorage.getItem('accessToken'));
      fetchRelayGetHome(localStorage.getItem('accessToken'));
      fetchProfileData(localStorage.getItem('accessToken'));
      const intervalId = setInterval(() => {
        fetchRelayGetHome(localStorage.getItem('accessToken'));
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

  const getBackgroundColor = (active) => settings.color === 'dark' 
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