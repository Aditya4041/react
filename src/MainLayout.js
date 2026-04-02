import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  AddCustomer, Authorization, OpenAccount,
  Master, ViewModule, Transactions, Reports, Pigmy, Utility, Shares,
} from './pages';
import './MainLayout.css';

/* ─────────────────────────────────────────
   DASHBOARD HOME
───────────────────────────────────────── */
function DashboardHome({ userInfo }) {
  const stats = [
    { label: 'Total Accounts', value: '1,284', icon: '🏦', delta: '+12 today', deltaColor: '#22c55e' },
    { label: 'Transactions', value: '₹4.2Cr', icon: '💳', delta: 'Today', deltaColor: '#3b82f6' },
    { label: 'Pending Auth', value: '7', icon: '⏳', delta: 'Awaiting', deltaColor: '#f59e0b' },
    { label: 'Active Users', value: '24', icon: '👥', delta: 'Online now', deltaColor: '#22c55e' },
  ];
  const activities = [
    { type: 'Deposit', acc: 'AC-100234', amt: '₹25,000', time: '10:42 AM', color: '#22c55e' },
    { type: 'Withdrawal', acc: 'AC-100189', amt: '₹8,500', time: '10:18 AM', color: '#ef4444' },
    { type: 'Account Opened', acc: 'AC-100298', amt: '—', time: '09:55 AM', color: '#3b82f6' },
    { type: 'FD Booked', acc: 'AC-100201', amt: '₹1,00,000', time: '09:30 AM', color: '#8b5cf6' },
  ];
  const quickActions = [
    { icon: '➕', label: 'New Account' }, { icon: '💸', label: 'Transfer' },
    { icon: '🧾', label: 'Statement' }, { icon: '🔒', label: 'Block Card' },
    { icon: '📋', label: 'Apply Loan' }, { icon: '⚙️', label: 'Settings' },
  ];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  return (
    <div className="dash-home">


      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 70}ms` }}>
            <div className="stat-icon">{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-delta" style={{ color: s.deltaColor }}>{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-bottom">
        <div className="dash-card">
          <h3 className="dash-card-title">Recent Activity</h3>
          {activities.map((a, i) => (
            <div className="activity-row" key={i}>
              <span className="activity-dot" style={{ background: a.color }} />
              <div className="activity-info">
                <span className="activity-type">{a.type}</span>
                <span className="activity-acc">{a.acc}</span>
              </div>
              <div className="activity-right">
                <span className="activity-amt">{a.amt}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="dash-card">
          <h3 className="dash-card-title">Quick Actions</h3>
          <div className="quick-grid">
            {quickActions.map((q, i) => (
              <button className="quick-btn" key={i}>
                <span className="quick-icon">{q.icon}</span>
                <span className="quick-label">{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MENU CONFIG
───────────────────────────────────────── */
const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: '▣', path: '/dashboard' },
  { id: 'add-customer', label: 'Add Customer', icon: '👤', path: '/dashboard/add-customer' },
  { id: 'authorization', label: 'Authorization', icon: '🔐', path: '/dashboard/authorization' },
  { id: 'open-account', label: 'Open Account', icon: '🏦', path: '/dashboard/open-account' },
  { id: 'master', label: 'Master', icon: '⚙️', path: '/dashboard/master' },
  { id: 'view', label: 'View', icon: '👁️', path: '/dashboard/view' },
  { id: 'transactions', label: 'Transactions', icon: '💳', path: '/dashboard/transactions' },
  { id: 'reports', label: 'Reports', icon: '📊', path: '/dashboard/reports' },
  { id: 'pigmy', label: 'Pigmy', icon: '🐷', path: '/dashboard/pigmy' },
  { id: 'utility', label: 'Utility', icon: '🔧', path: '/dashboard/utility' },
  { id: 'shares', label: 'Shares', icon: '📈', path: '/dashboard/shares' },
];

/* ─────────────────────────────────────────
   MAIN LAYOUT
───────────────────────────────────────── */
function MainLayout({ userInfo, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sb-collapsed') === 'true');
  const [showLogout, setShowLogout] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { localStorage.setItem('sb-collapsed', collapsed); }, [collapsed]);

  const activeItem = MENU.find(m => m.path === location.pathname) || MENU[0];
  const breadcrumb = activeItem.id === 'dashboard' ? ['Home'] : ['Home', activeItem.label];
  const workingDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const clockStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const branchLabel = userInfo?.branchName?.split('—')[1]?.trim() || userInfo?.branch || '';

  return (
    <div className={`ml-root${collapsed ? ' ml-root--collapsed' : ''}`}>

      {/* ══ SIDEBAR ══════════════════════════ */}
      <aside className="ml-sidebar">

        <div className="ml-brand">
          <div className="ml-brand-icon">🏦</div>
          {!collapsed && (
            <div className="ml-brand-text">
              <span className="ml-brand-name">IDSSPL</span>
              <span className="ml-brand-sub">Core Banking</span>
            </div>
          )}
        </div>

        <div className="ml-profile" onClick={() => navigate('/dashboard')}>
          <div className="ml-avatar">{userInfo?.username?.[0]?.toUpperCase() || 'U'}</div>
          {!collapsed && (
            <div className="ml-profile-text">
              <span className="ml-profile-name">{userInfo?.username}</span>
              <span className="ml-profile-branch">{branchLabel}</span>
            </div>
          )}
        </div>

        <nav className="ml-nav">
          {MENU.map(item => (
            <div className="ml-nav-item" key={item.id}>
              <button
                className={`ml-nav-btn${location.pathname === item.path ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : ''}
              >
                <span className="ml-nav-icon">{item.icon}</span>
                {!collapsed && <span className="ml-nav-label">{item.label}</span>}
                {!collapsed && location.pathname === item.path && <span className="ml-nav-pip" />}
              </button>
              {collapsed && <span className="ml-tooltip">{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="ml-sidebar-footer">
          <div className="ml-nav-item">
            <button className="ml-logout-btn" onClick={() => setShowLogout(true)} title={collapsed ? 'Log Out' : ''}>
              <span className="ml-nav-icon">⏻</span>
              {!collapsed && <span>Log Out</span>}
            </button>
            {collapsed && <span className="ml-tooltip">Log Out</span>}
          </div>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════ */}
      <div className="ml-main">

        <header className="ml-header">
          <div className="ml-header-left">
            <button className="ml-hamburger" onClick={() => setCollapsed(c => !c)}>
              <span /><span /><span />
            </button>
            <div>
              <div className="ml-bank-name">THE AZAD CO-OP BANK LTD, GADAG</div>
              <div className="ml-bank-branch">{branchLabel}</div>
            </div>
          </div>
          <div className="ml-header-right">
            <div className="ml-date-block">
              <span className="ml-date-label">WORKING DATE</span>
              <span className="ml-date-value">{workingDate}</span>
            </div>
            <div className="ml-clock">{clockStr}</div>
          </div>
        </header>

        <div className="ml-breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="ml-bc-sep">›</span>}
              <span className={`ml-bc-crumb${i === breadcrumb.length - 1 ? ' active' : ''}`}>{crumb}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Content iframe-style area */}
        <main className="ml-content-frame">
          <div className="ml-content-inner">
            <Routes>
              <Route path="/" element={<DashboardHome userInfo={userInfo} />} />
              <Route path="/add-customer" element={<AddCustomer />} />
              <Route path="/authorization" element={<Authorization />} />
              <Route path="/open-account" element={<OpenAccount />} />
              <Route path="/master" element={<Master />} />
              <Route path="/view" element={<ViewModule />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/pigmy" element={<Pigmy />} />
              <Route path="/utility" element={<Utility />} />
              <Route path="/shares" element={<Shares />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* ══ LOGOUT MODAL ═════════════════════ */}
      {showLogout && (
        <div className="ml-overlay" onClick={() => setShowLogout(false)}>
          <div className="ml-modal" onClick={e => e.stopPropagation()}>
            <div className="ml-modal-icon">⚠️</div>
            <h3 className="ml-modal-title">Confirm Logout</h3>
            <p className="ml-modal-body">Are you sure you want to log out?</p>
            <div className="ml-modal-btns">
              <button className="ml-btn-cancel" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="ml-btn-confirm" onClick={onLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;