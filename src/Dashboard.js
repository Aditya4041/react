import React from 'react';
import './Dashboard.css';

function Dashboard({ userInfo, onLogout }) {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();

    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img
            src="/images/IDSSPL_LOGO.png"
            alt="IDSSPL Logo"
            className="header-logo"
          />
          <h2 className="header-title">IDSSPL Banking System</h2>
        </div>
        <div className="header-right">
          <span className="user-info">{userInfo?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="welcome-card">
          {/* Welcome Icon/Greeting */}
          <div className="welcome-icon">👋</div>

          {/* Welcome Message */}
          <h1 className="welcome-title">Welcome Back, {userInfo?.username}!</h1>

          <p className="welcome-message">
            You have successfully logged in to the IDSSPL Core Banking Solution
          </p>

          {/* User Details */}
          <div className="user-details">
            <div className="detail-item">
              <span className="detail-label">Branch Code:</span>
              <span className="detail-value">{userInfo?.branch}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Branch Name:</span>
              <span className="detail-value">{userInfo?.branchName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Login Time:</span>
              <span className="detail-value">{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3 className="actions-title">Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn">
                <span className="action-icon">💳</span>
                <span className="action-text">Transactions</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">👥</span>
                <span className="action-text">Customers</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📊</span>
                <span className="action-text">Reports</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Settings</span>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="info-box">
            <svg className="info-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="info-text">
              Welcome to the IDSSPL Core Banking Solution. You can now access all banking operations and features.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2024 IDSSPL Technologies Pvt Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
