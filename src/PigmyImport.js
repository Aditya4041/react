import React, { useState, useRef } from 'react';
import './pages.css';

const S = `
.pi-wrap { max-width: 1100px; margin: 0 auto; }

/* ── Card ── */
.pi-card {
  background:#fff; border:1.5px solid #e0d7f8;
  border-radius:10px; overflow:hidden;
  box-shadow:0 2px 10px rgba(99,88,210,.07); margin-bottom:14px;
}
.pi-card-head {
  background:linear-gradient(90deg,#373279 0%,#5548a0 100%);
  padding:10px 18px; display:flex; align-items:center; gap:8px;
}
.pi-card-head span { color:#fff; font-size:13px; font-weight:700; }
.pi-card-body { padding:16px 18px; }

/* ── Form grid ── */
.pi-grid { display:grid; grid-template-columns: repeat(4,1fr); gap:12px 16px; }
@media(max-width:800px){ .pi-grid{ grid-template-columns:1fr 1fr; } }
@media(max-width:500px){ .pi-grid{ grid-template-columns:1fr; } }

.pi-field { display:flex; flex-direction:column; gap:4px; }
.pi-label {
  font-size:10.5px; font-weight:700; color:#5548a0;
  text-transform:uppercase; letter-spacing:.4px;
}
.pi-inp-row { display:flex; gap:5px; align-items:center; }
.pi-inp {
  flex:1; padding:6px 10px;
  border:1.5px solid #d4c8f5; border-radius:6px;
  background:#f7f4ff; font-size:13px; color:#1e1b4b;
  font-family:inherit; outline:none; transition:border-color .15s;
}
.pi-inp:focus { border-color:#7c5ee8; background:#fff; }
.pi-inp[readonly] { background:#f1f1f6; color:#888; cursor:default; }
.pi-sel {
  flex:1; padding:6px 10px;
  border:1.5px solid #d4c8f5; border-radius:6px;
  background:#f7f4ff; font-size:13px; color:#1e1b4b;
  font-family:inherit; outline:none; cursor:pointer;
}
.pi-sel:focus { border-color:#7c5ee8; }
.pi-dot-btn {
  width:28px; height:28px; border:none; border-radius:5px;
  background:#373279; color:#fff; font-size:13px;
  cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center;
}
.pi-dot-btn:hover { background:#5548a0; }

/* ── Radio pills ── */
.pi-radio-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.pi-radio {
  display:flex; align-items:center; gap:5px; cursor:pointer;
  padding:5px 12px; border:1.5px solid #d4c8f5; border-radius:20px;
  font-size:12.5px; font-weight:600; color:#5548a0; background:#f7f4ff;
  transition:all .15s; user-select:none;
}
.pi-radio.on { border-color:#7c5ee8; background:#ede9fc; color:#373279; }
.pi-radio input { display:none; }

/* ── Upload button ── */
.pi-upload-btn {
  display:inline-flex; align-items:center; gap:7px;
  padding:7px 16px; background:#373279; color:#fff;
  border:none; border-radius:7px; font-size:13px; font-weight:700;
  cursor:pointer; font-family:inherit; transition:background .15s;
}
.pi-upload-btn:hover { background:#5548a0; }

/* ── Message ── */
.pi-msg {
  padding:9px 14px; border-radius:7px; font-size:12.5px;
  font-weight:600; border:1.5px solid; display:flex; align-items:center; gap:8px;
  margin-bottom:14px;
}
.pi-msg.info    { background:#eff6ff; border-color:#93c5fd; color:#1e40af; }
.pi-msg.success { background:#f0fdf4; border-color:#86efac; color:#166534; }
.pi-msg.error   { background:#fef2f2; border-color:#fca5a5; color:#991b1b; }

/* ── Customise bar ── */
.pi-cust-bar {
  background:#f0f7ff; border:1.5px solid #93c5fd;
  border-radius:8px; padding:12px 16px; margin-bottom:14px;
}
.pi-cust-row { display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap; }
.pi-cust-title { font-size:12px; font-weight:700; color:#1e40af; margin-bottom:10px; }
.pi-tag {
  display:inline-flex; align-items:center; gap:5px;
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff; padding:3px 10px; border-radius:14px;
  font-size:11.5px; font-weight:600; margin:3px;
}
.pi-tag-rm {
  background:rgba(255,255,255,.3); border:none; color:#fff;
  width:16px; height:16px; border-radius:50%; cursor:pointer;
  font-size:12px; line-height:1; display:flex; align-items:center; justify-content:center;
}
.pi-tag-rm:hover { background:rgba(255,255,255,.5); }

/* ── Table ── */
.pi-tbl-wrap { overflow-x:auto; }
.pi-tbl {
  width:100%; border-collapse:collapse; font-size:12px;
}
.pi-tbl thead { background:#373279; color:#fff; }
.pi-tbl th { padding:7px 10px; text-align:left; font-weight:700; white-space:nowrap; border-right:1px solid rgba(255,255,255,.15); }
.pi-tbl th.cust { background:linear-gradient(135deg,#667eea,#764ba2); }
.pi-tbl td { padding:5px 9px; border-bottom:1px solid #ede9fc; border-right:1px solid #f0ecff; }
.pi-tbl td.cust { background:#f0f4ff; font-weight:600; color:#1e40af; }
.pi-tbl tbody tr:nth-child(even) td:not(.cust) { background:#faf9ff; }
.pi-tbl tbody tr:hover td:not(.cust) { background:#f3f0ff; }

/* ── Pagination ── */
.pi-page {
  display:flex; align-items:center; justify-content:center; gap:10px; padding:10px 0 4px;
}
.pi-page-btn {
  padding:5px 14px; background:#373279; color:#fff;
  border:none; border-radius:5px; cursor:pointer; font-size:12px; font-weight:700;
}
.pi-page-btn:disabled { background:#ccc; cursor:not-allowed; }
.pi-page-btn:hover:not(:disabled) { background:#5548a0; }
.pi-page-info { font-size:12px; font-weight:700; color:#373279; }

/* ── Action row ── */
.pi-btn-row {
  display:flex; gap:10px; justify-content:center; margin-top:14px; flex-wrap:wrap;
}
.pi-btn {
  padding:9px 22px; border:none; border-radius:7px;
  font-size:13px; font-weight:700; cursor:pointer;
  font-family:inherit; transition:all .15s; display:flex; align-items:center; gap:6px;
}
.pi-btn:active { transform:scale(.97); }
.pi-btn-import  { background:linear-gradient(135deg,#4a9eff,#3d85d9); color:#fff; }
.pi-btn-import:hover { box-shadow:0 3px 10px rgba(74,158,255,.4); transform:translateY(-1px); }
.pi-btn-apply   { background:#373279; color:#fff; }
.pi-btn-apply:hover { background:#5548a0; }
.pi-btn-reset   { background:#fef3c7; color:#b45309; border:1.5px solid #fcd34d; }
.pi-btn-cancel  { background:#fef2f2; color:#b91c1c; border:1.5px solid #fca5a5; }
.pi-btn-back    { background:#f1f5f9; color:#475569; border:1.5px solid #e2e8f0; }
`;

const TXN_TYPES = [
  { id: 1, desc: 'Pigmy Collection' },
  { id: 2, desc: 'Pigmy Settlement' },
  { id: 3, desc: 'Agent Commission' },
];
const PER_PAGE = 15;

export default function PigmyImport({ onBack }) {
  const [view,         setView]         = useState('form'); // 'form' | 'data'
  const [importFrom,   setImportFrom]   = useState('Client');
  const [txnType,      setTxnType]      = useState('');
  const [productCode,  setProductCode]  = useState('');
  const [productDesc,  setProductDesc]  = useState('');

  const [rawData,      setRawData]      = useState([]);
  const [displayData,  setDisplayData]  = useState([]);
  const [totalCols,    setTotalCols]    = useState(0);
  const [firstLine,    setFirstLine]    = useState(null);
  const [page,         setPage]         = useState(1);

  const [selCols,      setSelCols]      = useState([]);
  const [selCol,       setSelCol]       = useState('');
  const [dispMode,     setDispMode]     = useState('full');
  const [lastN,        setLastN]        = useState('');
  const [firstN,       setFirstN]       = useState('');
  const [custApplied,  setCustApplied]  = useState(false);

  const [msg,          setMsg]          = useState(null);
  const fileRef = useRef();

  const icons = { info: 'ℹ️', success: '✅', error: '❌' };
  const toast = (text, type = 'info') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  /* ── File parse ── */
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    toast(`Reading: ${file.name}`, 'info');
    const reader = new FileReader();
    reader.onload = ev => parseFile(ev.target.result, file.name);
    reader.readAsText(file);
    e.target.value = '';
  }

  function parseFile(content, name) {
    try {
      const lines = content.split('\n').filter(l => l.trim());
      if (!lines.length) { toast('File is empty', 'error'); return; }

      const isDat = name.toLowerCase().endsWith('.dat');
      let fl = null, dataLines = lines;
      if (isDat) { fl = lines[0].split(',').map(c => c.trim()); dataLines = lines.slice(1); setFirstLine(fl); }
      else setFirstLine(null);

      const parsed = dataLines.map(l => l.split(',').map(c => c.trim()));
      const maxCols = Math.max(...parsed.map(r => r.length));
      setRawData(parsed); setDisplayData(parsed);
      setTotalCols(maxCols); setPage(1);
      setSelCols([]); setCustApplied(false);
      toast(`${parsed.length} records • ${maxCols} columns`, 'success');
      setView('data');
    } catch (err) { toast('Parse error: ' + err.message, 'error'); }
  }

  /* ── Column customisation ── */
  function addCol() {
    if (!selCol) { toast('Select a column', 'error'); return; }
    const num = parseInt(selCol);
    if (selCols.find(c => c.columnNumber === num)) { toast('Already added', 'error'); return; }
    let sub = null, pos = null, lbl = `Col ${num}`;
    if (dispMode === 'last') {
      const n = parseInt(lastN);
      if (!n || n < 1) { toast('Enter character count', 'error'); return; }
      sub = n; pos = 'end'; lbl += ` (Last ${n})`;
    } else if (dispMode === 'first') {
      const n = parseInt(firstN);
      if (!n || n < 1) { toast('Enter character count', 'error'); return; }
      sub = n; pos = 'start'; lbl += ` (First ${n})`;
    }
    setSelCols([...selCols, { columnNumber: num, substringLength: sub, extractPosition: pos, label: lbl }]);
    setSelCol(''); setDispMode('full'); setLastN(''); setFirstN('');
    toast('Column added', 'success');
  }

  function applyCustom() {
    if (!selCols.length) { toast('Add at least one column', 'error'); return; }
    const map = {};
    selCols.forEach(c => { map[c.columnNumber] = c; });
    const transformed = rawData.map(row =>
      row.map((cell, i) => {
        const cfg = map[i + 1];
        if (!cfg) return cell;
        let v = cell || '';
        if (cfg.substringLength) v = cfg.extractPosition === 'end' ? v.slice(-cfg.substringLength) : v.slice(0, cfg.substringLength);
        return v;
      })
    );
    setDisplayData(transformed); setPage(1); setCustApplied(true);
    toast('Customisation applied', 'success');
  }

  function resetCustom() {
    setSelCols([]); setDisplayData(rawData); setPage(1); setCustApplied(false);
    toast('Reset to original', 'info');
  }

  /* ── Table slice ── */
  const totalPages = Math.max(1, Math.ceil(displayData.length / PER_PAGE));
  const tableRows  = displayData.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const custNums   = selCols.map(c => c.columnNumber);

  /* ════════════════ DATA VIEW ════════════════ */
  if (view === 'data') {
    return (
      <div className="pf-root">
        <style>{S}</style>
        <div className="pf-topbar">
          <span className="pf-tb-icon">📁</span>
          <span className="pf-tb-title">Transaction Import — Data Preview</span>
          <span className="pf-tb-badge">Pigmy</span>
        </div>
        <div className="pf-body">
          <div className="pi-wrap">

            {msg && <div className={`pi-msg ${msg.type}`}>{icons[msg.type]} {msg.text}</div>}

            {/* Customise bar */}
            {totalCols > 0 && (
              <div className="pi-cust-bar">
                <div className="pi-cust-title">⚙️ Column Customisation</div>
                <div className="pi-cust-row">
                  <div className="pi-field" style={{ minWidth: 130 }}>
                    <label className="pi-label">Column</label>
                    <select className="pi-sel" value={selCol} onChange={e => setSelCol(e.target.value)}>
                      <option value="">-- Pick --</option>
                      {Array.from({ length: totalCols }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Column {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pi-field">
                    <label className="pi-label">Extract</label>
                    <div className="pi-radio-row">
                      {['full', 'last', 'first'].map(m => (
                        <label key={m} className={`pi-radio${dispMode === m ? ' on' : ''}`}>
                          <input type="radio" value={m} checked={dispMode === m} onChange={() => setDispMode(m)} />
                          {m === 'full' ? 'Full' : m === 'last' ? 'Last N' : 'First N'}
                        </label>
                      ))}
                      {dispMode === 'last' && (
                        <input className="pi-inp" style={{ width: 56 }} type="number" min="1" max="50"
                          value={lastN} onChange={e => setLastN(e.target.value)} placeholder="N" />
                      )}
                      {dispMode === 'first' && (
                        <input className="pi-inp" style={{ width: 56 }} type="number" min="1" max="50"
                          value={firstN} onChange={e => setFirstN(e.target.value)} placeholder="N" />
                      )}
                    </div>
                  </div>
                  <button className="pi-btn pi-btn-apply" style={{ padding: '7px 14px', fontSize: 12 }} onClick={addCol}>
                    ➕ Add
                  </button>
                </div>

                {selCols.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1e40af' }}>Selected: </span>
                    {selCols.map((c, i) => (
                      <span key={i} className="pi-tag">
                        {c.label}
                        <button className="pi-tag-rm" onClick={() => setSelCols(selCols.filter((_, j) => j !== i))}>×</button>
                      </span>
                    ))}
                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                      <button className="pi-btn pi-btn-apply" style={{ padding: '6px 14px', fontSize: 12 }} onClick={applyCustom}>
                        ✓ Apply
                      </button>
                      <button className="pi-btn pi-btn-reset" style={{ padding: '6px 14px', fontSize: 12 }} onClick={resetCustom}>
                        ↺ Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* First line (DAT) */}
            {firstLine && (
              <div className="pi-card">
                <div className="pi-card-head"><span>📄</span><span>First Line Metadata</span></div>
                <div className="pi-card-body">
                  <div className="pi-tbl-wrap">
                    <table className="pi-tbl">
                      <thead><tr>{firstLine.map((_, i) => <th key={i}>Col {i + 1}</th>)}</tr></thead>
                      <tbody><tr>{firstLine.map((v, i) => <td key={i}>{v}</td>)}</tr></tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Data table */}
            <div className="pi-card">
              <div className="pi-card-head">
                <span>📊</span>
                <span>Data — {displayData.length} records</span>
                {custApplied && <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(255,255,255,.2)', padding: '2px 8px', borderRadius: 10 }}>Customised</span>}
              </div>
              <div className="pi-card-body" style={{ padding: '12px 14px' }}>
                <div className="pi-tbl-wrap">
                  <table className="pi-tbl">
                    <thead>
                      <tr>
                        {Array.from({ length: totalCols }, (_, i) => (
                          <th key={i} className={custNums.includes(i + 1) ? 'cust' : ''}>
                            Col {i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} className={custNums.includes(ci + 1) ? 'cust' : ''}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pi-page">
                  <button className="pi-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <span className="pi-page-info">Page {page} / {totalPages} &nbsp;·&nbsp; {displayData.length} records</span>
                  <button className="pi-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pi-btn-row">
              <button className="pi-btn pi-btn-import">📥 Import</button>
              <button className="pi-btn pi-btn-back" onClick={() => {
                setView('form'); setRawData([]); setDisplayData([]);
                setSelCols([]); setFirstLine(null);
              }}>← Back</button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ════════════════ FORM VIEW ════════════════ */
  return (
    <div className="pf-root">
      <style>{S}</style>
      <div className="pf-topbar">
        <span className="pf-tb-icon">📁</span>
        <span className="pf-tb-title">New Transaction Import</span>
        <span className="pf-tb-badge">Pigmy</span>
      </div>
      <div className="pf-body">
        <div className="pi-wrap" style={{ maxWidth: 700 }}>

          {msg && <div className={`pi-msg ${msg.type}`}>{icons[msg.type]} {msg.text}</div>}

          <div className="pi-card">
            <div className="pi-card-head"><span>📋</span><span>Transaction Details</span></div>
            <div className="pi-card-body">
              <div className="pi-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>

                {/* Import From */}
                <div className="pi-field">
                  <label className="pi-label">Import From</label>
                  <div className="pi-radio-row" style={{ paddingTop: 4 }}>
                    {['Client', 'Server'].map(v => (
                      <label key={v} className={`pi-radio${importFrom === v ? ' on' : ''}`}>
                        <input type="radio" value={v} checked={importFrom === v} onChange={() => setImportFrom(v)} />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transaction Type */}
                <div className="pi-field">
                  <label className="pi-label">Transaction Type</label>
                  <select className="pi-sel" value={txnType} onChange={e => setTxnType(e.target.value)}>
                    <option value="">-- Select --</option>
                    {TXN_TYPES.map(t => <option key={t.id} value={t.id}>{t.desc}</option>)}
                  </select>
                </div>

                {/* Product Code */}
                <div className="pi-field">
                  <label className="pi-label">Product Code</label>
                  <div className="pi-inp-row">
                    <input className="pi-inp" value={productCode}
                      onChange={e => setProductCode(e.target.value)} maxLength={3} />
                    <button className="pi-dot-btn">…</button>
                  </div>
                </div>

                {/* Description */}
                <div className="pi-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="pi-label">Product Description</label>
                  <input className="pi-inp" value={productDesc} readOnly placeholder="Auto-filled on product selection" />
                </div>

              </div>

              {/* Upload */}
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #ede9fc', display: 'flex', alignItems: 'center', gap: 14 }}>
                <button className="pi-upload-btn" onClick={() => fileRef.current?.click()}>
                  📤 Choose File
                </button>
                <span style={{ fontSize: 12, color: '#888' }}>Supported: .csv, .dat, .txt</span>
                <input ref={fileRef} type="file" accept=".csv,.dat,.txt" onChange={handleFile} style={{ display: 'none' }} />
              </div>
            </div>
          </div>

          <div className="pi-btn-row">
            <button className="pi-btn pi-btn-back" onClick={onBack}>← Cancel</button>
          </div>

        </div>
      </div>
    </div>
  );
}