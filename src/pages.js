import React, { useState } from 'react';
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

/* ════════════════════════════════════════════
   AUTHORIZATION MODULE — Card Dashboard
════════════════════════════════════════════ */
const AUTH_CSS = `
.auth-dash { max-width: 900px; margin: 0 auto; }

.auth-card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 800px) { .auth-card-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 500px) { .auth-card-grid { grid-template-columns: 1fr; } }

.auth-card {
  background: #fff;
  border: 1.5px solid #e0d7f8;
  border-radius: 12px;
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 2px 8px rgba(55,50,121,0.06);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--auth-accent, #6366f1);
  opacity: 0;
  transition: opacity 0.2s;
}

.auth-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(55,50,121,0.14);
  border-color: var(--auth-accent, #6366f1);
}

.auth-card:hover::before { opacity: 1; }
.auth-card:active { transform: scale(0.97); }

.auth-card-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.auth-card:hover .auth-card-icon { transform: scale(1.08); }

.auth-card-title {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.auth-card-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

.auth-card-arrow {
  font-size: 18px;
  color: #cbd5e1;
  transition: all 0.2s;
}
.auth-card:hover .auth-card-arrow { color: var(--auth-accent, #6366f1); transform: translateX(3px); }

/* ── Detail placeholder ── */
.auth-detail-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: #373279;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 20px;
  font-family: inherit;
  transition: background 0.15s;
}
.auth-detail-back:hover { background: #5548a0; }

.auth-coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  gap: 14px;
}
.auth-coming-icon {
  font-size: 52px;
  width: 90px; height: 90px;
  background: #eef2ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-coming-title {
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}
.auth-coming-desc {
  font-size: 13px;
  color: #94a3b8;
  max-width: 320px;
  line-height: 1.6;
}
`;

const AUTH_CARDS = [
  {
    id: 'customer',
    icon: '👤',
    title: 'Customer',
    desc: 'Authorize or reject pending customer registrations',
    accent: '#6366f1',
    bg: '#eef2ff',
  },
  {
    id: 'application',
    icon: '📋',
    title: 'Application',
    desc: 'Review and authorize pending account applications',
    accent: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    id: 'masters',
    icon: '⚙️',
    title: 'Masters',
    desc: 'Authorize changes to system master configuration',
    accent: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    id: 'txn-cash',
    icon: '💵',
    title: 'Transaction in Cash',
    desc: 'Authorize pending cash deposit and withdrawal transactions',
    accent: '#22c55e',
    bg: '#f0fdf4',
  },
  {
    id: 'txn-transfer',
    icon: '🔄',
    title: 'Transaction in Transfer',
    desc: 'Authorize pending fund transfer transactions',
    accent: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    id: 'users',
    icon: '👥',
    title: 'Users',
    desc: 'Authorize or reject new user registrations and role assignments',
    accent: '#06b6d4',
    bg: '#ecfeff',
  },
  {
    id: 'shares',
    icon: '📈',
    title: 'Shares',
    desc: 'Authorize share certificate issuance and transfers',
    accent: '#ef4444',
    bg: '#fff1f2',
  },
];

function AuthDetail({ card, onBack }) {
  return (
    <div>
      <button className="auth-detail-back" onClick={onBack}>← Back</button>
      <div className="auth-coming-soon">
        <div className="auth-coming-icon">{card.icon}</div>
        <div className="auth-coming-title">Authorization — {card.title}</div>
        <div className="auth-coming-desc">
          This section will show all pending {card.title.toLowerCase()} records awaiting authorization or rejection.
        </div>
      </div>
    </div>
  );
}

export function Authorization() {
  const [active, setActive] = useState(null);

  const activeCard = AUTH_CARDS.find(c => c.id === active);

  return (
    <PageFrame title="Authorization" icon="🔐">
      <style>{AUTH_CSS}</style>
      <div className="auth-dash">
        {activeCard ? (
          <AuthDetail card={activeCard} onBack={() => setActive(null)} />
        ) : (
          <div className="auth-card-grid">
            {AUTH_CARDS.map(card => (
              <div
                key={card.id}
                className="auth-card"
                style={{ '--auth-accent': card.accent }}
                onClick={() => setActive(card.id)}
              >
                <div className="auth-card-icon" style={{ background: card.bg, color: card.accent }}>
                  {card.icon}
                </div>
                <div className="auth-card-title">{card.title}</div>
                <div className="auth-card-desc">{card.desc}</div>
                <div className="auth-card-arrow">→</div>
              </div>
            ))}
          </div>
        )}
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