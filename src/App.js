import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/ui/Main/Mainboard';
import Profile from './components/ui/User/Profile';
import History from './components/ui/historyboard/History';
import AuthenticatedLayout from './components/ui/sidebar/Sidebarlayout';
import { Box } from '@mui/material';
import Relay from './components/ui/Relayboard/Relay';
import Setting from './components/ui/Settingboard/Settingboard';
import Forget from './components/auth/Forget'; // Import trang Forget


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
    console.log('Disconnecting from MQTT...');
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
        console.log('Disconnected from MQTT successfully');
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
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
      fetchConnectMqtt(localStorage.getItem('accessToken'));
    }
  }, []);

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" /> :
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Login onLogin={handleLogin} />
              </Box>
          }
        />
        <Route
          path="/signup"
          element={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
  );
}

export default App;
