import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Transactions.css';

/* ─── tiny toast ─── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);
  return { toasts, add };
}

const TOAST_COLORS = {
  success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#6366f1',
};
const TOAST_ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

function ToastContainer({ toasts }) {
  return (
    <div className="tx-toast-area">
      {toasts.map(t => (
        <div key={t.id} className="tx-toast" style={{ borderLeftColor: TOAST_COLORS[t.type] }}>
          <span className="tx-toast-icon" style={{ color: TOAST_COLORS[t.type] }}>
            {TOAST_ICONS[t.type]}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── mock data ─── */
const MOCK_ACCOUNTS = {
  saving: [
    { code: '00012000001', name: 'Ramesh Kumar', productDesc: 'Savings Basic' },
    { code: '00012000045', name: 'Sunita Patil', productDesc: 'Savings Premium' },
    { code: '00012000078', name: 'Arjun Desai',  productDesc: 'Savings Basic' },
  ],
  loan: [
    { code: '00015000010', name: 'Mahesh Nair',  productDesc: 'Home Loan' },
    { code: '00015000022', name: 'Priya Sharma', productDesc: 'Personal Loan' },
  ],
  deposit: [
    { code: '00014000005', name: 'Kamala Bai',   productDesc: 'Fixed Deposit' },
    { code: '00014000019', name: 'Ravi Kulkarni', productDesc: 'Recurring Deposit' },
  ],
  pigmy: [
    { code: '00016000003', name: 'Shanti Devi',  productDesc: 'Daily Pigmy' },
  ],
  current: [
    { code: '00011000007', name: 'M/s ABC Traders', productDesc: 'Current Plus' },
  ],
  cc: [
    { code: '00013000002', name: 'Suresh Hegde', productDesc: 'Cash Credit' },
  ],
};

const MOCK_ACCOUNT_DETAILS = {
  '00012000001': { ledgerBalance: '42500.00', availableBalance: '42500.00', glAccountCode: 'GL20001', glAccountName: 'Savings Account GL', customerId: 'C100234', aadharNumber: '1234 5678 9012', panNumber: 'ABCDE1234F', zipcode: '580001' },
  '00012000045': { ledgerBalance: '18750.50', availableBalance: '18750.50', glAccountCode: 'GL20001', glAccountName: 'Savings Account GL', customerId: 'C100189', aadharNumber: '9876 5432 1098', panNumber: 'PQRST5678G', zipcode: '580003' },
  '00012000078': { ledgerBalance: '95000.00', availableBalance: '95000.00', glAccountCode: 'GL20001', glAccountName: 'Savings Account GL', customerId: 'C100298', aadharNumber: '1111 2222 3333', panNumber: 'MNOPQ2345H', zipcode: '580002' },
  '00015000010': { ledgerBalance: '250000.00', availableBalance: '250000.00', glAccountCode: 'GL50001', glAccountName: 'Home Loan GL',      customerId: 'C100201', aadharNumber: '4444 5555 6666', panNumber: 'LMNO1234K', zipcode: '580005' },
  '00015000022': { ledgerBalance: '75000.00',  availableBalance: '75000.00',  glAccountCode: 'GL50002', glAccountName: 'Personal Loan GL',  customerId: 'C100202', aadharNumber: '7777 8888 9999', panNumber: 'ABCXY9876Z', zipcode: '580006' },
  '00014000005': { ledgerBalance: '100000.00', availableBalance: '100000.00', glAccountCode: 'GL40001', glAccountName: 'Fixed Deposit GL',  customerId: 'C100203', aadharNumber: '3333 4444 5555', panNumber: 'FGHIJ4567L', zipcode: '580007' },
  '00014000019': { ledgerBalance: '36000.00',  availableBalance: '36000.00',  glAccountCode: 'GL40002', glAccountName: 'Recurring Dep GL',  customerId: 'C100204', aadharNumber: '2222 3333 4444', panNumber: 'UVWXY6789M', zipcode: '580008' },
  '00016000003': { ledgerBalance: '4500.00',   availableBalance: '4500.00',   glAccountCode: 'GL60001', glAccountName: 'Pigmy GL',          customerId: 'C100205', aadharNumber: '5555 6666 7777', panNumber: 'RSTUV1234N', zipcode: '580009' },
  '00011000007': { ledgerBalance: '180000.00', availableBalance: '180000.00', glAccountCode: 'GL10001', glAccountName: 'Current Account GL',customerId: 'C100206', aadharNumber: '6666 7777 8888', panNumber: 'KLMNO5678P', zipcode: '580010' },
  '00013000002': { ledgerBalance: '500000.00', availableBalance: '500000.00', glAccountCode: 'GL30001', glAccountName: 'Cash Credit GL',    customerId: 'C100207', aadharNumber: '8888 9999 0000', panNumber: 'VWXYZ9012Q', zipcode: '580011' },
};

const LOAN_COLUMNS = [
  { columnName: 'interest',    description: 'Interest' },
  { columnName: 'penalty',     description: 'Penalty' },
  { columnName: 'insurance',   description: 'Insurance' },
  { columnName: 'legal',       description: 'Legal Charges' },
];

const MOCK_CHEQUES = {
  '00012000001': [
    { chequeNumber: '100001', chequeSeries: 'A', chequeTypeCode: 'BER' },
    { chequeNumber: '100002', chequeSeries: 'A', chequeTypeCode: 'BER' },
    { chequeNumber: '100003', chequeSeries: 'B', chequeTypeCode: 'CLG' },
  ],
  '00012000045': [
    { chequeNumber: '200001', chequeSeries: 'A', chequeTypeCode: 'BER' },
  ],
};

/* ─── helpers ─── */
function fmtCurrency(v) {
  const n = parseFloat(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

/* ═══════════════════════════════════════════
   ACCOUNT INFO PANEL
═══════════════════════════════════════════ */
function AccountInfoPanel({ details, label = 'Account Information', operationType, txnAmount }) {
  if (!details) return null;
  const ledger = parseFloat(details.ledgerBalance) || 0;
  const amt    = parseFloat(txnAmount) || 0;
  const newBal = operationType === 'deposit'    ? ledger + amt
               : operationType === 'withdrawal' ? ledger - amt
               : ledger;

  const fields = [
    { label: 'GL Account Code',   val: details.glAccountCode },
    { label: 'GL Account Name',   val: details.glAccountName },
    { label: 'Customer ID',       val: details.customerId },
    { label: 'Ledger Balance',    val: `₹ ${fmtCurrency(details.ledgerBalance)}` },
    { label: 'Available Balance', val: `₹ ${fmtCurrency(details.availableBalance)}` },
    { label: 'New Ledger Bal.',   val: `₹ ${fmtCurrency(newBal)}`, highlight: true },
    { label: 'Aadhar Number',     val: details.aadharNumber },
    { label: 'PAN Number',        val: details.panNumber },
    { label: 'ZIP Code',          val: details.zipcode },
  ];

  return (
    <div className="tx-info-panel">
      <div className="tx-info-legend">{label}</div>
      <div className="tx-info-grid">
        {fields.map((f, i) => (
          <div key={i} className={`tx-info-field${f.highlight ? ' highlight' : ''}`}>
            <span className="tx-info-label">{f.label}</span>
            <span className="tx-info-val">{f.val || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOAN FIELDS TABLE
═══════════════════════════════════════════ */
function LoanFieldsTable({ loanData, setLoanData, txnAmount }) {
  const total = LOAN_COLUMNS.reduce((s, c) => s + (parseFloat(loanData[c.columnName]?.receivable) || 0), 0);

  function setReceived(col, val) {
    setLoanData(p => ({ ...p, [col]: { ...p[col], received: val } }));
  }

  return (
    <div className="tx-loan-section">
      <div className="tx-loan-title">Loan Recovery Details</div>
      <div className="tx-loan-table-wrap">
        <table className="tx-loan-table">
          <thead>
            <tr>
              <th>Type</th>
              {LOAN_COLUMNS.map(c => <th key={c.columnName}>{c.description}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="rx-row">
              <td>Receivable</td>
              {LOAN_COLUMNS.map(c => (
                <td key={c.columnName}>
                  <input readOnly value={fmtCurrency(loanData[c.columnName]?.receivable || 0)} className="tx-loan-input ro" />
                </td>
              ))}
              <td><input readOnly value={fmtCurrency(total)} className="tx-loan-input ro" /></td>
            </tr>
            <tr className="rd-row">
              <td>Received</td>
              {LOAN_COLUMNS.map(c => (
                <td key={c.columnName}>
                  <input
                    value={loanData[c.columnName]?.received || ''}
                    onChange={e => setReceived(c.columnName, e.target.value)}
                    className="tx-loan-input"
                    placeholder="0.00"
                  />
                </td>
              ))}
              <td>
                <input readOnly
                  value={fmtCurrency(LOAN_COLUMNS.reduce((s, c) => s + (parseFloat(loanData[c.columnName]?.received) || 0), 0))}
                  className="tx-loan-input ro"
                />
              </td>
            </tr>
            <tr className="rm-row">
              <td>Remaining</td>
              {LOAN_COLUMNS.map(c => {
                const rem = (parseFloat(loanData[c.columnName]?.receivable) || 0) - (parseFloat(loanData[c.columnName]?.received) || 0);
                return (
                  <td key={c.columnName}>
                    <input readOnly value={fmtCurrency(rem)} className={`tx-loan-input ro${rem < 0 ? ' neg' : rem === 0 ? ' zero' : ''}`} />
                  </td>
                );
              })}
              <td>
                <input readOnly
                  value={fmtCurrency(LOAN_COLUMNS.reduce((s, c) => {
                    return s + (parseFloat(loanData[c.columnName]?.receivable) || 0) - (parseFloat(loanData[c.columnName]?.received) || 0);
                  }, 0))}
                  className="tx-loan-input ro"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHEQUE FIELDS
═══════════════════════════════════════════ */
function ChequeFields({ cheques, chequeForm, setChequeForm }) {
  const seriesList = [...new Set(cheques.map(c => c.chequeSeries))];
  const typeList   = [...new Set(cheques.map(c => c.chequeTypeCode))];
  const filteredNos = cheques.filter(c =>
    (!chequeForm.series || c.chequeSeries === chequeForm.series) &&
    (!chequeForm.type   || c.chequeTypeCode === chequeForm.type)
  );

  return (
    <div className="tx-cheque-row">
      <div className="tx-cheque-label-row">
        <span className="tx-cheque-badge">Cheque</span>
      </div>
      <div className="tx-cheque-fields">
        <div className="tx-field">
          <label className="tx-label">Cheque Type</label>
          <select className="tx-select" value={chequeForm.type}
            onChange={e => setChequeForm(p => ({ ...p, type: e.target.value, no: '' }))}>
            <option value="">Select Type</option>
            {typeList.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="tx-field">
          <label className="tx-label">Cheque Series</label>
          <select className="tx-select" value={chequeForm.series}
            onChange={e => setChequeForm(p => ({ ...p, series: e.target.value, no: '' }))}>
            <option value="">Select Series</option>
            {seriesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="tx-field">
          <label className="tx-label">Cheque No</label>
          <select className="tx-select" value={chequeForm.no}
            onChange={e => setChequeForm(p => ({ ...p, no: e.target.value }))}>
            <option value="">Select Cheque No</option>
            {filteredNos.map(c => <option key={c.chequeNumber} value={c.chequeNumber}>{c.chequeNumber}</option>)}
          </select>
        </div>
        <div className="tx-field">
          <label className="tx-label">Cheque Date</label>
          <input type="date" className="tx-input" value={chequeForm.date}
            onChange={e => setChequeForm(p => ({ ...p, date: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TRANSFER TABLE
═══════════════════════════════════════════ */
function TransferTable({ rows, onRemove }) {
  const totalDebit  = rows.filter(r => r.opType === 'Debit').reduce((s, r) => s + parseFloat(r.amount), 0);
  const totalCredit = rows.filter(r => r.opType === 'Credit').reduce((s, r) => s + parseFloat(r.amount), 0);
  const tallied = totalDebit > 0 && totalDebit === totalCredit;

  return (
    <div className="tx-transfer-table-wrap">
      <div className="tx-transfer-totals">
        <span className="tx-total-pill debit">Debit ₹{fmtCurrency(totalDebit)}</span>
        <span className="tx-total-pill credit">Credit ₹{fmtCurrency(totalCredit)}</span>
        {tallied && <span className="tx-tallied">✓ Tallied</span>}
      </div>
      {rows.length === 0
        ? <p className="tx-empty-rows">No transactions added yet</p>
        : (
          <table className="tx-xfer-table">
            <thead>
              <tr>
                <th>OP</th><th>Account Code</th><th>Name</th>
                <th>Amount</th><th>Particular</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className={r.opType === 'Debit' ? 'debit-row' : 'credit-row'}>
                  <td><span className={`tx-op-pill ${r.opType.toLowerCase()}`}>{r.opType}</span></td>
                  <td className="mono">{r.code}</td>
                  <td>{r.name}</td>
                  <td className="amt">₹ {fmtCurrency(r.amount)}</td>
                  <td>{r.particular || '—'}</td>
                  <td>
                    <button className="tx-remove-btn" onClick={() => onRemove(r.id)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEARCH DROPDOWN
═══════════════════════════════════════════ */
function SearchDropdown({ query, category, onSelect }) {
  const pool = MOCK_ACCOUNTS[category] || [];
  const results = query.length >= 3
    ? pool.filter(a => a.code.includes(query) || a.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  if (!query || query.length < 3) return null;
  if (results.length === 0)
    return (
      <div className="tx-search-drop">
        <div className="tx-search-empty">No accounts found for "{query}"</div>
      </div>
    );

  return (
    <div className="tx-search-drop">
      {results.map(a => (
        <div key={a.code} className="tx-search-item" onClick={() => onSelect(a)}>
          <span className="tx-search-code">{a.code}</span>
          <span className="tx-search-name">{a.name}</span>
          {a.productDesc && <span className="tx-search-prod">{a.productDesc}</span>}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS MODAL
═══════════════════════════════════════════ */
function SuccessModal({ scrollNo, onClose }) {
  return (
    <div className="tx-overlay" onClick={onClose}>
      <div className="tx-modal" onClick={e => e.stopPropagation()}>
        <div className="tx-modal-check">✓</div>
        <h3 className="tx-modal-title">Transaction Saved!</h3>
        <div className="tx-modal-scroll">Scroll No: <strong>{scrollNo}</strong></div>
        <button className="tx-modal-ok" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN TRANSACTIONS COMPONENT
═══════════════════════════════════════════ */
export default function Transactions() {
  const { toasts, add: toast } = useToast();

  /* form state */
  const [txnType, setTxnType]     = useState('regular');   // regular | closing
  const [opType, setOpType]       = useState('deposit');    // deposit | withdrawal | transfer
  const [category, setCategory]   = useState('saving');
  const [opDir, setOpDir]         = useState('Debit');      // transfer OP direction

  const [accountCode, setAccountCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch]   = useState(false);

  const [txnAmount, setTxnAmount]   = useState('');
  const [particular, setParticular] = useState('By Cash');

  const [accountDetails, setAccountDetails] = useState(null);

  /* cheque */
  const [chequeForm, setChequeForm] = useState({ type: '', series: '', no: '', date: '' });
  const cheques = (accountDetails && (MOCK_CHEQUES[accountCode] || []));

  /* loan */
  const [loanData, setLoanData] = useState({});

  /* transfer rows */
  const [transferRows, setTransferRows] = useState([]);

  /* modal */
  const [successScroll, setSuccessScroll] = useState(null);

  const searchRef = useRef(null);

  /* ── auto-particular ── */
  useEffect(() => {
    if (opType === 'deposit')    setParticular('By Cash');
    else if (opType === 'withdrawal') setParticular('To Cash');
    else if (opType === 'transfer')   setParticular(opDir === 'Debit' ? 'To Transfer' : 'By Transfer');
  }, [opType, opDir]);

  /* ── load account details ── */
  function loadAccount(acc) {
    setAccountCode(acc.code);
    setAccountName(acc.name);
    setSearchQuery(acc.code);
    setShowSearch(false);
    const details = MOCK_ACCOUNT_DETAILS[acc.code] || {
      ledgerBalance: '10000.00', availableBalance: '10000.00',
      glAccountCode: 'GL00000', glAccountName: 'General Ledger',
      customerId: 'C999999', aadharNumber: '', panNumber: '', zipcode: '',
    };
    setAccountDetails(details);

    // seed loan receivables
    if (category === 'loan' || category === 'cc') {
      const seeded = {};
      LOAN_COLUMNS.forEach(c => {
        seeded[c.columnName] = { receivable: (Math.random() * 2000 + 500).toFixed(2), received: '' };
      });
      setLoanData(seeded);
    }
  }

  function clearAccount() {
    setAccountCode(''); setAccountName(''); setSearchQuery('');
    setAccountDetails(null); setLoanData({});
    setChequeForm({ type: '', series: '', no: '', date: '' });
  }

  /* ── validate + save ── */
  function handleSave() {
    if (opType === 'transfer') {
      const deb = transferRows.filter(r => r.opType === 'Debit').reduce((s, r) => s + parseFloat(r.amount), 0);
      const crd = transferRows.filter(r => r.opType === 'Credit').reduce((s, r) => s + parseFloat(r.amount), 0);
      if (transferRows.length === 0) { toast('Add at least one transaction', 'error'); return; }
      if (deb !== crd || deb === 0) { toast('Debit and Credit must be equal and non-zero', 'error'); return; }
      const scroll = Math.floor(Math.random() * 90000 + 10000);
      setTransferRows([]);
      clearAccount();
      setSuccessScroll(scroll);
      return;
    }
    if (!accountCode) { toast('Please select an account', 'error'); return; }
    if (!txnAmount || parseFloat(txnAmount) <= 0) { toast('Enter a valid amount', 'error'); return; }
    if (opType === 'withdrawal') {
      const ledger = parseFloat(accountDetails?.ledgerBalance) || 0;
      if (parseFloat(txnAmount) > ledger) { toast(`Amount exceeds ledger balance ₹${fmtCurrency(ledger)}`, 'error'); return; }
    }
    const scroll = Math.floor(Math.random() * 90000 + 10000);
    clearAccount(); setTxnAmount('');
    setSuccessScroll(scroll);
  }

  /* ── add to transfer table ── */
  function addTransferRow() {
    if (!accountCode) { toast('Select an account', 'error'); return; }
    if (!txnAmount || parseFloat(txnAmount) <= 0) { toast('Enter a valid amount', 'error'); return; }
    if (opDir === 'Debit') {
      const ledger = parseFloat(accountDetails?.ledgerBalance) || 0;
      if (parseFloat(txnAmount) > ledger) { toast(`Debit amount exceeds ledger balance ₹${fmtCurrency(ledger)}`, 'error'); return; }
    }
    setTransferRows(p => [...p, {
      id: Date.now(), code: accountCode, name: accountName,
      amount: fmtCurrency(txnAmount), particular, opType: opDir,
    }]);
    clearAccount(); setTxnAmount('');
  }

  const showCheque = (opType === 'withdrawal' || (opType === 'transfer' && opDir === 'Debit')) && txnType !== 'closing';
  const showLoan   = (category === 'loan' || category === 'cc') && txnType !== 'closing' && opType !== 'transfer';
  const showInfo   = !!accountDetails;

  const opColors = { deposit: '#22c55e', withdrawal: '#ef4444', transfer: '#6366f1' };

  return (
    <div className="tx-root">
      <ToastContainer toasts={toasts} />

      {/* ── Header bar ── */}
      <div className="tx-header">
        <div className="tx-header-left">
          <span className="tx-header-icon">💳</span>
          <div>
            <div className="tx-header-title">Transaction Entry</div>
            <div className="tx-header-sub">Process deposits, withdrawals & transfers</div>
          </div>
        </div>
        <div className="tx-op-display" style={{ background: opColors[opType] + '20', border: `1px solid ${opColors[opType]}40` }}>
          <span className="tx-op-label" style={{ color: opColors[opType] }}>
            {opType.toUpperCase()}
            {opType === 'transfer' && ` · ${opDir}`}
          </span>
        </div>
      </div>

      {/* ── Control row ── */}
      <div className="tx-control-card">

        {/* Transaction Type */}
        <div className="tx-ctrl-group">
          <div className="tx-ctrl-label">Transaction Type</div>
          <div className="tx-radio-row">
            {['regular', 'closing'].map(v => (
              <label key={v} className={`tx-radio-btn${txnType === v ? ' active' : ''}`}>
                <input type="radio" name="txnType" value={v} checked={txnType === v}
                  onChange={() => { setTxnType(v); clearAccount(); setTransferRows([]); }} />
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Operation Type */}
        <div className="tx-ctrl-group">
          <div className="tx-ctrl-label">Operation</div>
          <div className="tx-radio-row">
            {['deposit', 'withdrawal', 'transfer'].map(v => (
              <label key={v} className={`tx-radio-btn${opType === v ? ' active op-' + v : ''}`}>
                <input type="radio" name="opType" value={v} checked={opType === v}
                  onChange={() => { setOpType(v); clearAccount(); setTransferRows([]); }} />
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Transfer OP dir */}
        {opType === 'transfer' && (
          <div className="tx-ctrl-group">
            <div className="tx-ctrl-label">OP Direction</div>
            <div className="tx-radio-row">
              {['Debit', 'Credit'].map(v => (
                <label key={v} className={`tx-radio-btn${opDir === v ? ' active op-' + v.toLowerCase() : ''}`}>
                  <input type="radio" name="opDir" value={v} checked={opDir === v}
                    onChange={() => { setOpDir(v); clearAccount(); }} />
                  {v}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Main form card ── */}
      <div className="tx-form-card">

        {/* Row 1: Account type + code + name */}
        <div className="tx-form-row">

          {/* Account Type */}
          <div className="tx-field narrow">
            <label className="tx-label">Account Type</label>
            <select className="tx-select" value={category}
              onChange={e => { setCategory(e.target.value); clearAccount(); }}>
              {['saving','loan','deposit','pigmy','current','cc'].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Account Code + search */}
          <div className="tx-field" style={{ position: 'relative' }}>
            <label className="tx-label">Account Code</label>
            <div className="tx-code-row">
              <input
                className="tx-input mono"
                value={searchQuery}
                maxLength={14}
                placeholder="Enter code or search…"
                autoComplete="off"
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '');
                  setSearchQuery(v);
                  setShowSearch(true);
                  if (!v) clearAccount();
                }}
                onFocus={() => setShowSearch(true)}
              />
              <button className="tx-lookup-btn" title="Browse accounts"
                onClick={() => {
                  const pool = MOCK_ACCOUNTS[category] || [];
                  if (pool.length) loadAccount(pool[0]);
                  toast('Lookup: auto-selected first account (demo)', 'info');
                }}>
                …
              </button>
            </div>
            <div className="tx-hint">Type last 3+ digits to search</div>
            {showSearch && (
              <SearchDropdown
                query={searchQuery}
                category={category}
                onSelect={acc => { loadAccount(acc); setShowSearch(false); }}
              />
            )}
          </div>

          {/* Account Name */}
          <div className="tx-field wide">
            <label className="tx-label">Account Name</label>
            <input className="tx-input ro" readOnly value={accountName} placeholder="Account Name" />
          </div>

          {/* Amount */}
          <div className="tx-field narrow">
            <label className="tx-label">Amount (₹)</label>
            <input className="tx-input"
              value={txnAmount}
              placeholder="0.00"
              onChange={e => setTxnAmount(e.target.value.replace(/[^\d.]/g, ''))}
            />
          </div>

          {/* Particular */}
          <div className="tx-field">
            <label className="tx-label">Particular</label>
            <input className="tx-input" value={particular}
              onChange={e => setParticular(e.target.value)} placeholder="Enter particular" />
          </div>

          {/* Action buttons */}
          <div className="tx-field narrow" style={{ justifyContent: 'flex-end' }}>
            <label className="tx-label">&nbsp;</label>
            <div className="tx-btn-row">
              {opType === 'transfer' && (
                <button className="tx-btn-add" onClick={addTransferRow}>+</button>
              )}
              <button className="tx-btn-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>

        {/* Cheque fields */}
        {showCheque && cheques && cheques.length > 0 && (
          <ChequeFields cheques={cheques} chequeForm={chequeForm} setChequeForm={setChequeForm} />
        )}

        {/* Loan fields */}
        {showLoan && Object.keys(loanData).length > 0 && (
          <LoanFieldsTable loanData={loanData} setLoanData={setLoanData} txnAmount={txnAmount} />
        )}

        {/* Transfer table */}
        {opType === 'transfer' && (
          <TransferTable rows={transferRows} onRemove={id => setTransferRows(p => p.filter(r => r.id !== id))} />
        )}
      </div>

      {/* ── Account info panels ── */}
      {showInfo && (
        <AccountInfoPanel
          details={accountDetails}
          label="Account Information"
          operationType={opType}
          txnAmount={txnAmount}
        />
      )}

      {/* ── Success modal ── */}
      {successScroll && (
        <SuccessModal scrollNo={successScroll} onClose={() => setSuccessScroll(null)} />
      )}
    </div>
  );
}
