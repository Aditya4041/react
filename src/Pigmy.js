import React, { useState } from 'react';
import './pages.css';
import PigmyImport from './PigmyImport';
import PigmyExport from './PigmyExport';

export default function Pigmy() {
  const [currentView, setCurrentView] = useState('dashboard');

  if (currentView === 'import') {
    return <PigmyImport onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'export') {
    return <PigmyExport onBack={() => setCurrentView('dashboard')} />;
  }

  // Dashboard view
  return (
    <div className="pf-root">
      <div className="pf-topbar">
        <span className="pf-tb-icon">🐷</span>
        <span className="pf-tb-title">Pigmy Management</span>
        <span className="pf-tb-badge">Module</span>
      </div>
      <div className="pf-body">
        <div className="pf-card-grid">
          <div 
            className="pf-type-card" 
            onClick={() => setCurrentView('import')}
            style={{ cursor: 'pointer' }}
          >
            <div className="pf-type-icon" style={{ background: '#667eea15', color: '#667eea' }}>
              📁
            </div>
            <div className="pf-type-info">
              <h4 className="pf-type-title">New Import</h4>
              <p className="pf-type-desc">Import transaction data from files with column customization</p>
            </div>
            <button className="pf-btn pf-btn-outline" style={{ color: '#667eea', borderColor: '#667eea60' }}>
              Open →
            </button>
          </div>

          <div 
            className="pf-type-card" 
            onClick={() => setCurrentView('export')}
            style={{ cursor: 'pointer' }}
          >
            <div className="pf-type-icon" style={{ background: '#764ba215', color: '#764ba2' }}>
              📤
            </div>
            <div className="pf-type-info">
              <h4 className="pf-type-title">Export</h4>
              <p className="pf-type-desc">Export transaction data to client with validation</p>
            </div>
            <button className="pf-btn pf-btn-outline" style={{ color: '#764ba2', borderColor: '#764ba260' }}>
              Open →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
