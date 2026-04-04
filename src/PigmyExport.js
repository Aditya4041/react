import React, { useState } from 'react';
import './pages.css';

const S = `
.pe-wrap { max-width: 780px; margin: 0 auto; }
.pe-card {
  background: #fff;
  border: 1.5px solid #e0d7f8;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(99,88,210,.07);
}
.pe-card-head {
  background: linear-gradient(90deg,#373279 0%,#5548a0 100%);
  padding: 11px 20px;
  display: flex; align-items: center; gap: 8px;
}
.pe-card-head span { color:#fff; font-size:13px; font-weight:700; letter-spacing:.2px; }
.pe-card-body { padding: 20px; }

.pe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; }
.pe-grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
@media(max-width:700px){ .pe-grid { grid-template-columns:1fr; } .pe-grid-4 { grid-template-columns:1fr 1fr; } }

.pe-field { display:flex; flex-direction:column; gap:4px; }
.pe-label {
  font-size:10.5px; font-weight:700; color:#5548a0;
  text-transform:uppercase; letter-spacing:.4px;
}
.pe-input-row { display:flex; gap:5px; align-items:center; }
.pe-inp {
  flex:1; padding:6px 10px;
  border:1.5px solid #d4c8f5; border-radius:6px;
  background:#f7f4ff; font-size:13px; color:#1e1b4b;
  font-family:inherit; outline:none;
  transition:border-color .15s;
}
.pe-inp:focus { border-color:#7c5ee8; background:#fff; }
.pe-inp[readonly] { background:#f1f1f6; color:#888; cursor:default; }
.pe-inp-sm { max-width:100px; }
.pe-dot-btn {
  width:30px; height:30px; border:none; border-radius:5px;
  background:#373279; color:#fff; font-size:14px;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  flex-shrink:0; transition:background .15s;
}
.pe-dot-btn:hover { background:#5548a0; }

.pe-msg {
  margin-bottom:14px; padding:9px 14px; border-radius:7px;
  font-size:12.5px; font-weight:600; border:1.5px solid;
  display:flex; align-items:center; gap:8px;
}
.pe-msg.info    { background:#eff6ff; border-color:#93c5fd; color:#1e40af; }
.pe-msg.success { background:#f0fdf4; border-color:#86efac; color:#166534; }
.pe-msg.error   { background:#fef2f2; border-color:#fca5a5; color:#991b1b; }

.pe-divider { height:1px; background:#ede9fc; margin:18px 0; }

.pe-btn-row {
  display:flex; gap:10px; justify-content:center; padding-top:4px; flex-wrap:wrap;
}
.pe-btn {
  padding:9px 22px; border:none; border-radius:7px;
  font-size:13px; font-weight:700; cursor:pointer;
  transition:all .15s; display:flex; align-items:center; gap:6px; font-family:inherit;
}
.pe-btn:active { transform:scale(.97); }
.pe-btn-validate { background:#373279; color:#fff; }
.pe-btn-validate:hover { background:#5548a0; }
.pe-btn-export  { background:linear-gradient(135deg,#4a9eff,#3d85d9); color:#fff; }
.pe-btn-export:hover { box-shadow:0 3px 10px rgba(74,158,255,.4); transform:translateY(-1px); }
.pe-btn-export:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
.pe-btn-cancel { background:#fef2f2; color:#b91c1c; border:1.5px solid #fca5a5; }
.pe-btn-cancel:hover { background:#fecaca; }
.pe-btn-back { background:#f1f5f9; color:#475569; border:1.5px solid #e2e8f0; }
.pe-btn-back:hover { background:#e2e8f0; }
`;

export default function PigmyExport({ onBack }) {
  const [branchCode,   setBranchCode]   = useState('0001');
  const [branchName,   setBranchName]   = useState('');
  const [productCode,  setProductCode]  = useState('');
  const [productDesc,  setProductDesc]  = useState('');
  const [agentId,      setAgentId]      = useState('');
  const [agentName,    setAgentName]    = useState('');
  const [msg,          setMsg]          = useState({ text: 'Fill in the details and click Validate.', type: 'info' });
  const [validated,    setValidated]    = useState(false);

  const icons = { info: 'ℹ️', success: '✅', error: '❌' };

  function validate() {
    if (!branchCode.trim()) { setMsg({ text: 'Branch Code is required.', type: 'error' }); return; }
    if (!productCode.trim()) { setMsg({ text: 'Product Code is required.', type: 'error' }); return; }
    setMsg({ text: 'Validating…', type: 'info' });
    setTimeout(() => {
      setBranchName('Main Branch - Gadag');
      setProductDesc('Pigmy Collection');
      setMsg({ text: 'Validation successful! Ready to export.', type: 'success' });
      setValidated(true);
    }, 800);
  }

  function exportFile() {
    if (!validated) { setMsg({ text: 'Please validate before exporting.', type: 'error' }); return; }
    setMsg({ text: 'Generating export file…', type: 'info' });
    setTimeout(() => {
      const csv =
        'Account Code,Customer Name,Agent ID,Date,Amount\n' +
        '000200010001,Test Customer 1,AG001,30/01/2026,500.00\n' +
        '000200010002,Test Customer 2,AG001,30/01/2026,750.00\n' +
        '000200010003,Test Customer 3,AG001,30/01/2026,1000.00';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = `pigmy_export_${Date.now()}.csv`;
      a.click();
      setMsg({ text: 'Export downloaded successfully!', type: 'success' });
    }, 1000);
  }

  function cancel() {
    setBranchCode('0001'); setBranchName(''); setProductCode('');
    setProductDesc(''); setAgentId(''); setAgentName('');
    setValidated(false);
    setMsg({ text: 'Fill in the details and click Validate.', type: 'info' });
  }

  return (
    <div className="pf-root">
      <style>{S}</style>
      <div className="pf-topbar">
        <span className="pf-tb-icon">📤</span>
        <span className="pf-tb-title">Transaction Export</span>
        <span className="pf-tb-badge">Pigmy</span>
      </div>

      <div className="pf-body">
        <div className="pe-wrap">

          {/* Message */}
          <div className={`pe-msg ${msg.type}`}>
            <span>{icons[msg.type]}</span> {msg.text}
          </div>

          <div className="pe-card">
            <div className="pe-card-head">
              <span>📋</span>
              <span>Transaction Details</span>
            </div>
            <div className="pe-card-body">
              <div className="pe-grid pe-grid-4">

                {/* Branch Code */}
                <div className="pe-field">
                  <label className="pe-label">Branch Code *</label>
                  <div className="pe-input-row">
                    <input className="pe-inp pe-inp-sm" value={branchCode}
                      onChange={e => setBranchCode(e.target.value)} maxLength={4} />
                    <button className="pe-dot-btn">…</button>
                  </div>
                </div>

                {/* Branch Name */}
                <div className="pe-field">
                  <label className="pe-label">Branch Name</label>
                  <input className="pe-inp" value={branchName} readOnly placeholder="Auto-filled" />
                </div>

                {/* Product Code */}
                <div className="pe-field">
                  <label className="pe-label">Product Code *</label>
                  <div className="pe-input-row">
                    <input className="pe-inp pe-inp-sm" value={productCode}
                      onChange={e => setProductCode(e.target.value)} maxLength={3} />
                    <button className="pe-dot-btn">…</button>
                  </div>
                </div>

                {/* Description */}
                <div className="pe-field">
                  <label className="pe-label">Description</label>
                  <input className="pe-inp" value={productDesc} readOnly placeholder="Auto-filled" />
                </div>

                {/* Agent ID */}
                <div className="pe-field">
                  <label className="pe-label">Agent ID</label>
                  <div className="pe-input-row">
                    <input className="pe-inp" value={agentId}
                      onChange={e => setAgentId(e.target.value)} />
                    <button className="pe-dot-btn">…</button>
                  </div>
                </div>

                {/* Agent Name */}
                <div className="pe-field">
                  <label className="pe-label">Agent Name</label>
                  <input className="pe-inp" value={agentName} readOnly placeholder="Auto-filled" />
                </div>

              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pe-btn-row" style={{ marginTop: 16 }}>
            <button className="pe-btn pe-btn-validate" onClick={validate}>✓ Validate</button>
            <button className="pe-btn pe-btn-export" onClick={exportFile} disabled={!validated}>
              📥 Export to Client
            </button>
            <button className="pe-btn pe-btn-cancel" onClick={cancel}>✕ Cancel</button>
            <button className="pe-btn pe-btn-back" onClick={onBack}>← Back</button>
          </div>

        </div>
      </div>
    </div>
  );
}