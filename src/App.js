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

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
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
