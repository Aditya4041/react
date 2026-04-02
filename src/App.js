import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainLayout from './MainLayout';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || null
  );

  const handleLoginSuccess = (username, branch, branchName) => {
    const user = { username, branch, branchName };
    setIsLoggedIn(true);
    setUserInfo(user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userInfo', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={
              isLoggedIn
                ? <Navigate to="/dashboard" replace />
                : <Login onLoginSuccess={handleLoginSuccess} />
            }
          />

          {/* Dashboard — catches /dashboard AND /dashboard/* so nested Routes work */}
          <Route
            path="/dashboard/*"
            element={
              isLoggedIn
                ? <MainLayout userInfo={userInfo} onLogout={handleLogout} />
                : <Navigate to="/login" replace />
            }
          />

          {/* Root → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;