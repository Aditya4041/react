import React from 'react';
import './pages.css';
export { default as Transactions } from './Transactions';
export { default as AddCustomer } from './AddCustomer';
export { default as Pigmy } from './Pigmy';

function PageFrame({ title, icon, children }) {
  return (
    <div className="pf-root">
      <div className="pf-topbar">
        <span className="pf-tb-icon">{icon}</span>
        <span className="pf-tb-title">{title}</span>
        <span className="pf-tb-badge">Module</span>
      </div>
      <div className="pf-body">{children}</div>
    </div>
  );
}



export function Authorization() {
  const rows = [
    { id: 'TXN001', type: 'Account Opening',  user: 'rama',    branch: '0003', date: '02 Apr 2026', amount: '₹5,000',    status: 'Pending' },
    { id: 'TXN002', type: 'FD Booking',        user: 'sridhar', branch: '0001', date: '02 Apr 2026', amount: '₹50,000',   status: 'Pending' },
    { id: 'TXN003', type: 'Loan Disbursement', user: 'priya',   branch: '0002', date: '01 Apr 2026', amount: '₹2,00,000', status: 'Pending' },
    { id: 'TXN004', type: 'Customer Edit',     user: 'suresh',  branch: '0003', date: '01 Apr 2026', amount: '—',         status: 'Pending' },
  ];
  return (
    <PageFrame title="Authorization" icon="🔐">
      <div className="pf-tbl-header">
        <span className="pf-tbl-count">{rows.length} items pending authorization</span>
        <input className="pf-search" type="text" placeholder="🔍  Search…" />
      </div>
      <div className="pf-tbl-wrap">
        <table className="pf-table">
          <thead>
            <tr>{['Txn ID','Type','Initiated By','Branch','Date','Amount','Status','Action'].map(h=><th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td><code className="pf-code">{r.id}</code></td>
                <td>{r.type}</td><td>{r.user}</td><td>{r.branch}</td>
                <td>{r.date}</td><td><strong>{r.amount}</strong></td>
                <td><span className="pf-badge-pending">{r.status}</span></td>
                <td>
                  <div className="pf-row-btns">
                    <button className="pf-btn pf-btn-approve">✓ Approve</button>
                    <button className="pf-btn pf-btn-reject">✗ Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}

export function OpenAccount() {
  const types = [
    { icon: '💰', title: 'Savings Account',   desc: 'Standard savings account with interest', color: '#22c55e' },
    { icon: '🏢', title: 'Current Account',   desc: 'For business and commercial use',         color: '#3b82f6' },
    { icon: '📅', title: 'Fixed Deposit',     desc: 'Lock-in deposits with high returns',       color: '#8b5cf6' },
    { icon: '🔄', title: 'Recurring Deposit', desc: 'Monthly installment savings plan',          color: '#f59e0b' },
    { icon: '🐷', title: 'Pigmy Account',     desc: 'Daily collection savings scheme',           color: '#ef4444' },
    { icon: '📋', title: 'Loan Account',      desc: 'Personal and business loans',               color: '#06b6d4' },
  ];
  return (
    <PageFrame title="Open Account" icon="🏦">
      <div className="pf-card-grid">
        {types.map((c, i) => (
          <div className="pf-type-card" key={i}>
            <div className="pf-type-icon" style={{ background: c.color + '15', color: c.color }}>{c.icon}</div>
            <div className="pf-type-info">
              <h4 className="pf-type-title">{c.title}</h4>
              <p className="pf-type-desc">{c.desc}</p>
            </div>
            <button className="pf-btn pf-btn-outline" style={{ color: c.color, borderColor: c.color + '60' }}>Open →</button>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}

function ComingSoon({ title, icon, desc }) {
  return (
    <PageFrame title={title} icon={icon}>
      <div className="pf-empty">
        <div className="pf-empty-icon">{icon}</div>
        <h2 className="pf-empty-title">{title}</h2>
        <p className="pf-empty-desc">{desc}</p>
        <button className="pf-btn pf-btn-primary" style={{ marginTop: 24 }}>Get Started</button>
      </div>
    </PageFrame>
  );
}

export function Master()     { return <ComingSoon title="Master"  icon="⚙️" desc="Configure system masters — interest rates, charges, product types and more." />; }
export function ViewModule() { return <ComingSoon title="View"    icon="👁️" desc="Search and view customer records, accounts, and transaction history." />; }
export function Reports()    { return <ComingSoon title="Reports" icon="📊" desc="Generate branch reports, MIS statements, and regulatory filings." />; }
export function Utility()    { return <ComingSoon title="Utility" icon="🔧" desc="System utilities — day-end, backup, and maintenance operations." />; }
export function Shares()     { return <ComingSoon title="Shares"  icon="📈" desc="Manage member shares, dividends, and equity transactions." />; }