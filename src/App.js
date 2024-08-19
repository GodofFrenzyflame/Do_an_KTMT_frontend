import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/ui/Main/Mainboard';
import Profile from './components/ui/User/Profile';
// import Sidebar from './components/ui/Sidebar';
import History from './components/ui/historyboard/History';
import AuthenticatedLayout from './components/ui/sidebar/Sidebarlayout';
import { Box } from '@mui/material'; // Import Box ở đây
import Relay from './components/ui/Relayboard/Relay';
import Setting from './components/ui/Settingboard/Settingboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const fetchConnectMqtt = async (token) => {
    console.log('connect')
    try {
      const response = await fetch('http://localhost:8080/mqtt/connect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sử dụng token
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Connect mqtt successful')
      } else {
        console.error('Error:', result.message);
        if (response.status === 403) {
          await refreshAccessToken();
        }
      }
    } catch (error) {
      console.error('Error fetching humidity data:', error);
    }
  };

  const fetchDisconnectMqtt = async (token) => {
    console.log('disconnect')
    try {
      const response = await fetch('http://localhost:8080/mqtt/disconect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sử dụng token
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Connect mqtt successful')
      } else {
        console.error('Error:', result.message);
        if (response.status === 403) {
          await refreshAccessToken();
        }
      }
    } catch (error) {
      console.error('Error fetching humidity data:', error);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const response = await fetch('http://localhost:8080/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }), // Gửi refreshToken để lấy accessToken mới
      });

      const result = await response.json();

      if (response.ok) {
        const { accessToken } = result;
        localStorage.setItem('accessToken', accessToken);
        await fetchConnectMqtt(accessToken); // Gọi lại API với accessToken mới
      } else {
        console.error('Error refreshing access token:', result.message);
      }
    } catch (error) {
      console.error('Error during access token refresh:', error);
    }
  };

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
      console.log(localStorage.getItem('refreshToken'))
      fetchConnectMqtt(localStorage.getItem('accessToken'));
    }
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    fetchDisconnectMqtt(localStorage.getItem('accessToken'));
    setIsLoggedIn(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
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
