import { useState, useEffect, useRef, useCallback } from "react";
import './pages.css';
import './Transactions.css';

/* ── Mock data ── */
const MOCK_ACCS = [
  { code: "01012000001", name: "Ramesh Patil",       prod: "SAVING REGULAR" },
  { code: "01012000045", name: "Sunita Sharma",      prod: "SAVING BASIC" },
  { code: "01012000099", name: "Vijay Desai",        prod: "SAVING PREMIUM" },
  { code: "01015000123", name: "Kiran Joshi",        prod: "HOUSING LOAN" },
  { code: "01014000011", name: "Mahesh Deposit",     prod: "FD 1 YEAR" },
  { code: "01011000088", name: "Anita Current Acct", prod: "CURRENT REGULAR" },
];

const MOCK_CHEQUES = [
  { chequeNumber: "000101", chequeSeries: "A", chequeTypeCode: "LOCAL" },
  { chequeNumber: "000102", chequeSeries: "A", chequeTypeCode: "LOCAL" },
  { chequeNumber: "000201", chequeSeries: "B", chequeTypeCode: "OUTSTATION" },
  { chequeNumber: "000202", chequeSeries: "B", chequeTypeCode: "OUTSTATION" },
];

const LOAN_COLS = [
  { col: "INTEREST",  desc: "Interest" },
  { col: "PENALTY",   desc: "Penalty" },
  { col: "INSURANCE", desc: "Insurance" },
  { col: "OTHER",     desc: "Other Chg" },
];

const CLOSING_COLS = [
  { col: "INT_AMOUNT",  desc: "Interest" },
  { col: "SERVICE_CHG", desc: "Service Chg" },
  { col: "TOD_INT",     desc: "TOD Int" },
  { col: "OTHER_CHG",   desc: "Other Chg" },
];

/* ── Highlight matching text ── */
function Hl({ text, search }) {
  const l7 = text.slice(-7), idx = l7.indexOf(search);
  if (idx === -1) return <>{text}</>;
  const ai = text.length - 7 + idx;
  return (
    <>
      {text.slice(0, ai)}
      <mark className="txn-hl">{search}</mark>
      {text.slice(ai + search.length)}
    </>
  );
}

/* ── Radio Pill ── */
function Pill({ label, val, cur, onChange }) {
  return (
    <button
      type="button"
      className={`txn-pill${cur === val ? " txn-pill--active" : ""}`}
      onClick={() => onChange(val)}
    >
      <span className="txn-pill-dot" />
      {label}
    </button>
  );
}

/* ── Field wrapper ── */
function Field({ label, children, style }) {
  return (
    <div className="txn-field" style={style}>
      <span className="txn-field-label">{label}</span>
      {children}
    </div>
  );
}

export default function Transactions() {
  const [txType,     setTxType]     = useState("regular");
  const [opType,     setOpType]     = useState("deposit");
  const [trOp,       setTrOp]       = useState("Debit");
  const [acCat,      setAcCat]      = useState("saving");
  const [acCode,     setAcCode]     = useState("");
  const [acName,     setAcName]     = useState("");
  const [txnAmt,     setTxnAmt]     = useState("");
  const [particular, setParticular] = useState("By Cash");

  const [cheqType,   setCheqType]   = useState("");
  const [cheqSeries, setCheqSeries] = useState("");
  const [cheqNo,     setCheqNo]     = useState("");
  const [cheqDate,   setCheqDate]   = useState("");
  const [allCheqs,   setAllCheqs]   = useState([]);

  const [srchRes,  setSrchRes]  = useState([]);
  const [showSrch, setShowSrch] = useState(false);
  const [srching,  setSrching]  = useState(false);
  const srchTimer = useRef(null);

  const mkLoanInit = () => {
    const o = {};
    LOAN_COLS.forEach(c => { o[c.col] = { recv: "", rcvd: "", rem: "" }; });
    return o;
  };
  const [loanVals,  setLoanVals]  = useState(mkLoanInit());
  const [totRecv,   setTotRecv]   = useState("");
  const [totRcvd,   setTotRcvd]   = useState("");
  const [totRem,    setTotRem]    = useState("");
  const [princRcvd, setPrincRcvd] = useState("0.00");

  const mkCloseInit = () => {
    const o = {};
    CLOSING_COLS.forEach(c => { o[c.col] = { recv: "", rcvd: "", rem: "" }; });
    return o;
  };
  const [closeVals, setCloseVals] = useState(mkCloseInit());

  const [txnRows, setTxnRows] = useState([]);
  const [totDr,   setTotDr]   = useState("0.00");
  const [totCr,   setTotCr]   = useState("0.00");

  const [authModal, setAuthModal] = useState({ on: false, msg: "", scroll: "" });
  const [lkOn,      setLkOn]      = useState(false);
  const [lkQ,       setLkQ]       = useState("");
  const [toast,     setToast]     = useState({ on: false, msg: "", type: "info" });
  const tTimer = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    clearTimeout(tTimer.current);
    setToast({ on: true, msg, type });
    tTimer.current = setTimeout(() => setToast(t => ({ ...t, on: false })), 4000);
  }, []);

  /* visibility flags */
  const showCheqRow  = (opType === "withdrawal" || (opType === "transfer" && trOp === "Debit")) && txType !== "closing";
  const showLoanSec  = (acCat === "loan" || acCat === "cc") && txType !== "closing";
  const showTrStrip  = opType === "transfer" && txType !== "closing";
  const showCloseSec = txType === "closing";
  const showAddBtn   = opType === "transfer" && txType !== "closing";
  const tallied      = parseFloat(totDr) > 0 && totDr === totCr;

  /* auto particular */
  useEffect(() => {
    if (opType === "deposit")    setParticular("By Cash");
    else if (opType === "withdrawal") setParticular("To Cash");
    else if (opType === "transfer")   setParticular(trOp === "Debit" ? "To Transfer" : "By Transfer");
  }, [opType, trOp]);

  /* totals */
  useEffect(() => {
    let d = 0, c = 0;
    txnRows.forEach(r => { const a = parseFloat(r.amount) || 0; r.op === "Debit" ? d += a : c += a; });
    setTotDr(d.toFixed(2));
    setTotCr(c.toFixed(2));
  }, [txnRows]);

  /* principle */
  useEffect(() => {
    const a = parseFloat(txnAmt) || 0, r = parseFloat(totRecv) || 0;
    setPrincRcvd(a > r ? (a - r).toFixed(2) : "0.00");
  }, [txnAmt, totRecv]);

  /* sequential loan deduction */
  useEffect(() => {
    if (!showLoanSec) return;
    if (opType !== "deposit" && !(opType === "transfer" && trOp === "Credit")) return;
    seqLoanDeduct();
    // eslint-disable-next-line
  }, [txnAmt]);

  function seqLoanDeduct() {
    const amt = parseFloat(txnAmt) || 0;
    if (amt <= 0) { resetLoanRcvd(); return; }
    let rem = amt;
    const upd = {};
    LOAN_COLS.forEach(c => {
      const rv = parseFloat(loanVals[c.col]?.recv) || 0;
      if (rv > 0 && rem > 0) {
        const ded = Math.min(rv, rem);
        upd[c.col] = { recv: rv.toFixed(2), rcvd: ded.toFixed(2), rem: (rv - ded).toFixed(2) };
        rem -= ded;
      } else {
        upd[c.col] = { ...loanVals[c.col], rcvd: "", rem: loanVals[c.col]?.recv || "" };
      }
    });
    setLoanVals(upd);
    let tr = 0;
    Object.values(upd).forEach(v => { tr += parseFloat(v.rcvd) || 0; });
    setTotRcvd(tr.toFixed(2));
    setTotRem(((parseFloat(totRecv) || 0) - tr).toFixed(2));
  }

  function resetLoanRcvd() {
    setLoanVals(prev => {
      const o = {};
      Object.entries(prev).forEach(([k, v]) => { o[k] = { ...v, rcvd: "", rem: v.recv }; });
      return o;
    });
    setTotRcvd(""); setTotRem(totRecv); setPrincRcvd("0.00");
  }

  function clearAll() {
    setAcCode(""); setAcName(""); setTxnAmt(""); setShowSrch(false);
    setCheqType(""); setCheqSeries(""); setCheqNo(""); setCheqDate(""); setAllCheqs([]);
    setLoanVals(mkLoanInit()); setTotRecv(""); setTotRcvd(""); setTotRem(""); setPrincRcvd("0.00");
    setTxnRows([]);
  }

  /* live search */
  function handleCodeChange(v) {
    const clean = v.replace(/\D/g, "");
    setAcCode(clean); setAcName("");
    if (!clean) { setShowSrch(false); return; }
    const s = clean.length > 7 ? clean.slice(-7) : clean;
    if (s.length < 3) { setSrchRes([{ info: "Type at least 3 digits…" }]); setShowSrch(true); return; }
    clearTimeout(srchTimer.current); setSrching(true); setShowSrch(true);
    srchTimer.current = setTimeout(() => {
      const r = MOCK_ACCS.filter(a => a.code.slice(-7).includes(s));
      setSrchRes(r); setSrching(false);
    }, 300);
  }

  function pickAccount(code, name) {
    setAcCode(code); setAcName(name); setShowSrch(false);
    if (showCheqRow) { setAllCheqs(MOCK_CHEQUES); showToast("Cheque data loaded", "info"); }
    if (showLoanSec) loadLoanData(code);
  }

  function loadLoanData() {
    const upd = {}; let tot = 0;
    LOAN_COLS.forEach(c => {
      const v = Math.round(Math.random() * 20000) / 10;
      upd[c.col] = { recv: v.toFixed(2), rcvd: "", rem: v.toFixed(2) }; tot += v;
    });
    setLoanVals(upd); setTotRecv(tot.toFixed(2)); setTotRem(tot.toFixed(2)); setTotRcvd("");
    showToast("Loan receivable data loaded", "info");
  }

  const uSeries = [...new Set(allCheqs.map(c => c.chequeSeries).filter(Boolean))];
  const uTypes  = [...new Set(allCheqs.map(c => c.chequeTypeCode).filter(Boolean))];
  const filtNos = allCheqs.filter(c => (!cheqSeries || c.chequeSeries === cheqSeries) && (!cheqType || c.chequeTypeCode === cheqType));

  function loanRcvdChange(col, val) {
    setLoanVals(prev => {
      const rv = parseFloat(prev[col]?.recv) || 0, rc = parseFloat(val) || 0;
      const upd = { ...prev, [col]: { ...prev[col], rcvd: val, rem: (rv - rc).toFixed(2) } };
      let tr = 0;
      Object.values(upd).forEach(v => { tr += parseFloat(v.rcvd) || 0; });
      setTotRcvd(tr.toFixed(2)); setTotRem(((parseFloat(totRecv) || 0) - tr).toFixed(2));
      return upd;
    });
  }

  function closeRcvdChange(col, val) {
    setCloseVals(prev => {
      const rv = parseFloat(prev[col]?.recv) || 0;
      return { ...prev, [col]: { ...prev[col], rcvd: val, rem: (rv - (parseFloat(val) || 0)).toFixed(2) } };
    });
  }

  function addRow() {
    if (!acCode)                          { showToast("Enter or select an account code", "error"); return; }
    if (!acName)                          { showToast("Select a valid account", "error"); return; }
    if (!txnAmt || parseFloat(txnAmt) <= 0) { showToast("Enter a valid transaction amount", "error"); return; }
    setTxnRows(prev => [...prev, {
      id: Date.now(), code: acCode, name: acName,
      amount: parseFloat(txnAmt).toFixed(2), particular, op: trOp,
    }]);
    setAcCode(""); setAcName(""); setTxnAmt(""); setShowSrch(false);
    setCheqType(""); setCheqSeries(""); setCheqNo(""); setCheqDate("");
    showToast("Transaction added", "success");
  }

  function handleSave() {
    if (opType === "transfer") {
      if (!txnRows.length)  { showToast("Add at least one transaction", "error"); return; }
      if (!tallied)         { showToast("Debit and Credit must be equal and non-zero", "error"); return; }
    } else {
      if (!acCode)          { showToast("Enter or select an account code", "error"); return; }
      if (!txnAmt || parseFloat(txnAmt) <= 0) { showToast("Enter a valid amount", "error"); return; }
    }
    const s = Math.floor(Math.random() * 900000) + 100000;
    setAuthModal({ on: true, msg: "Transaction saved successfully!", scroll: `Scroll No: ${s}` });
    clearAll();
  }

  const lkAccs = MOCK_ACCS.filter(a => {
    if (!lkQ) return true;
    const q = lkQ.toLowerCase();
    return a.code.includes(q) || a.name.toLowerCase().includes(q);
  });

  const toastColors = { success: "#22c55e", error: "#ef4444", warning: "#f59e0b", info: "#6366f1" };

  return (
    <div className="pf-root">

      {/* ── Toast ── */}
      <div
        className={`txn-toast${toast.on ? " txn-toast--on" : ""}`}
        style={{ borderLeftColor: toastColors[toast.type] || "#6366f1" }}
      >
        <span className="txn-toast-icon">
          {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : toast.type === "warning" ? "⚠️" : "ℹ️"}
        </span>
        {toast.msg}
      </div>

      {/* ── Top bar ── */}
      <div className="pf-topbar">
        <span className="pf-tb-icon">💳</span>
        <span className="pf-tb-title">Transactions</span>
        <span className="pf-tb-badge">Module</span>
      </div>

      {/* ── Body ── */}
      <div className="pf-body">

        {/* ══ MAIN CARD ══ */}
        <div className="pf-section-card">
          <div className="pf-section-header">
            <span className="pf-section-dot" />
            <span className="pf-section-title">Transaction Details</span>
          </div>

          {/* ── Type + Operation pills ── */}
          <div className="txn-pills-row">

            {/* Transaction Type */}
            <div className="txn-pill-group">
              <span className="txn-pill-group-label">Transaction Type</span>
              <div className="txn-pill-group-btns">
                <Pill label="Regular" val="regular" cur={txType}
                  onChange={v => { setTxType(v); clearAll(); }} />
                <Pill label="Closing" val="closing" cur={txType}
                  onChange={v => { setTxType(v); clearAll(); setOpType("deposit"); }} />
              </div>
            </div>

            {/* Operation Type */}
            {txType !== "closing" && (
              <div className="txn-pill-group">
                <span className="txn-pill-group-label">Operation Type</span>
                <div className="txn-pill-group-btns">
                  <Pill label="Deposit"    val="deposit"    cur={opType} onChange={v => { setOpType(v); clearAll(); }} />
                  <Pill label="Withdrawal" val="withdrawal" cur={opType} onChange={v => { setOpType(v); clearAll(); }} />
                  <Pill label="Transfer"   val="transfer"   cur={opType} onChange={v => { setOpType(v); clearAll(); }} />
                </div>
              </div>
            )}

            {/* Transfer strip */}
            {showTrStrip && (
              <div className="txn-transfer-strip">
                <div className="txn-strip-item">
                  <span className="txn-strip-label">OP Type</span>
                  <select
                    className={`txn-op-sel${trOp === "Debit" ? " txn-op-sel--debit" : " txn-op-sel--credit"}`}
                    value={trOp}
                    onChange={e => {
                      setTrOp(e.target.value); setAcCode(""); setAcName(""); setTxnAmt("");
                      setParticular(e.target.value === "Debit" ? "To Transfer" : "By Transfer");
                      setCheqType(""); setCheqSeries(""); setCheqNo(""); setCheqDate(""); setAllCheqs([]);
                      if (showLoanSec) setLoanVals(mkLoanInit());
                    }}
                  >
                    <option value="Debit">DEBIT</option>
                    <option value="Credit">CREDIT</option>
                  </select>
                </div>
                <div className="txn-strip-item">
                  <span className="txn-strip-label">Total Debit</span>
                  <input className={`txn-total-inp${tallied ? " txn-total-inp--ok" : ""}`} readOnly value={totDr} />
                </div>
                <div className="txn-strip-item">
                  <span className="txn-strip-label">Total Credit</span>
                  <input className={`txn-total-inp${tallied ? " txn-total-inp--ok" : ""}`} readOnly value={totCr} />
                </div>
                {tallied && <span className="txn-tallied-msg">✓ Tallied</span>}
              </div>
            )}
          </div>

          {/* ── Main fields row ── */}
          <div className="txn-fields-row">

            {/* Account Type */}
            <Field label="Account Type">
              <select
                className="txn-select"
                value={acCat}
                onChange={e => { setAcCat(e.target.value); setLoanVals(mkLoanInit()); setTotRecv(""); setTotRcvd(""); setTotRem(""); }}
              >
                {["saving","loan","deposit","pigmy","current","cc","other"].map(v => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </Field>

            {/* Account Code */}
            <Field label={opType === "transfer" ? (trOp === "Debit" ? "Debit Account Code" : "Credit Account Code") : "Account Code"}>
              <div className="txn-code-wrap">
                <div className="txn-search-wrap">
                  <input
                    className="txn-input"
                    placeholder="Enter account code"
                    value={acCode}
                    maxLength={14}
                    autoComplete="off"
                    onChange={e => handleCodeChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSrch(false), 180)}
                  />
                  {showSrch && (
                    <div className="txn-dropdown">
                      {srching
                        ? <div className="txn-dropdown-info">🔄 Searching…</div>
                        : srchRes.length === 0
                          ? <div className="txn-dropdown-info">No accounts found</div>
                          : srchRes[0]?.info
                            ? <div className="txn-dropdown-info">{srchRes[0].info}</div>
                            : srchRes.map(a => (
                              <div key={a.code} className="txn-dropdown-item" onMouseDown={() => pickAccount(a.code, a.name)}>
                                <span className="txn-dd-code"><Hl text={a.code} search={acCode.length > 7 ? acCode.slice(-7) : acCode} /></span>
                                <span className="txn-dd-name">{a.name}</span>
                                {a.prod && <span className="txn-dd-prod">{a.prod}</span>}
                              </div>
                            ))
                      }
                    </div>
                  )}
                </div>
                <button type="button" className="txn-dots-btn" onClick={() => setLkOn(true)}>···</button>
              </div>
              <span className="txn-hint">Type last 7 digits to search</span>
            </Field>

            {/* Account Name */}
            <Field label={opType === "transfer" ? (trOp === "Debit" ? "Debit Account Name" : "Credit Account Name") : "Account Name"} style={{ flex: "1 1 160px" }}>
              <input className="txn-input" placeholder="Auto-filled" value={acName} readOnly />
            </Field>

            {/* Amount */}
            <Field label="Transaction Amount" style={{ flex: "0 0 150px" }}>
              <input
                className="txn-input txn-input--amount"
                placeholder="0.00"
                value={txnAmt}
                onChange={e => setTxnAmt(e.target.value.replace(/[^0-9.]/g, ""))}
              />
            </Field>

            {/* Particular */}
            <Field label="Particular" style={{ flex: "2 1 200px" }}>
              <textarea
                className="txn-textarea"
                value={particular}
                onChange={e => setParticular(e.target.value)}
              />
            </Field>

            {/* Buttons */}
            <div className="txn-action-btns">
              {showAddBtn && (
                <button type="button" className="pf-btn pf-btn-primary txn-add-btn" onClick={addRow}>
                  + Add
                </button>
              )}
              <button type="button" className="pf-btn pf-btn-primary" onClick={handleSave}>
                💾 Save
              </button>
            </div>
          </div>

          {/* ── Cheque row ── */}
          {showCheqRow && (
            <div className="txn-cheque-row">
              <div className="pf-section-header" style={{ marginBottom: 16, paddingBottom: 12 }}>
                <span className="pf-section-dot" style={{ background: "#f59e0b" }} />
                <span className="pf-section-title" style={{ fontSize: 12.5 }}>Cheque Details</span>
              </div>
              <div className="txn-cheque-fields">
                <Field label="Cheque Type">
                  <select className="txn-select" value={cheqType} onChange={e => setCheqType(e.target.value)}>
                    <option value="">— Select —</option>
                    {uTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Cheque Series">
                  <select className="txn-select" value={cheqSeries} onChange={e => setCheqSeries(e.target.value)}>
                    <option value="">— Select —</option>
                    {uSeries.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Cheque No">
                  <select className="txn-select" value={cheqNo} onChange={e => setCheqNo(e.target.value)}>
                    <option value="">— Select —</option>
                    {filtNos.map(c => <option key={c.chequeNumber} value={c.chequeNumber}>{c.chequeNumber}</option>)}
                  </select>
                </Field>
                <Field label="Cheque Date">
                  <input type="date" className="txn-input" value={cheqDate} onChange={e => setCheqDate(e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Loan table ── */}
          {showLoanSec && (
            <div className="txn-dyn-section">
              <div className="pf-section-header" style={{ marginBottom: 12, paddingBottom: 12 }}>
                <span className="pf-section-dot" style={{ background: "#3b82f6" }} />
                <span className="pf-section-title" style={{ fontSize: 12.5 }}>Loan Receivables</span>
              </div>
              <div className="txn-tbl-wrap">
                <table className="txn-dyn-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", paddingLeft: 10 }}>Type</th>
                      {LOAN_COLS.map(c => <th key={c.col}>{c.desc}</th>)}
                      <th>Principle</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="txn-recv-row">
                      <td className="txn-row-label">Receivable</td>
                      {LOAN_COLS.map(c => <td key={c.col}><input readOnly value={loanVals[c.col]?.recv || ""} placeholder="0.00" /></td>)}
                      <td><input readOnly value="" placeholder="0.00" /></td>
                      <td><input readOnly value={totRecv} placeholder="0.00" /></td>
                    </tr>
                    <tr className="txn-rcvd-row">
                      <td className="txn-row-label">Received</td>
                      {LOAN_COLS.map(c => (
                        <td key={c.col}>
                          <input value={loanVals[c.col]?.rcvd || ""} placeholder="0.00"
                            onChange={e => loanRcvdChange(c.col, e.target.value)} />
                        </td>
                      ))}
                      <td><input readOnly value={princRcvd} placeholder="0.00" className="txn-princ" /></td>
                      <td>
                        <input value={totRcvd} placeholder="0.00"
                          onChange={e => { setTotRcvd(e.target.value); setTotRem(((parseFloat(totRecv) || 0) - (parseFloat(e.target.value) || 0)).toFixed(2)); }} />
                      </td>
                    </tr>
                    <tr className="txn-rem-row">
                      <td className="txn-row-label">Remaining</td>
                      {LOAN_COLS.map(c => (
                        <td key={c.col}>
                          <input readOnly value={loanVals[c.col]?.rem || ""} placeholder="0.00"
                            style={{ color: parseFloat(loanVals[c.col]?.rem) < 0 ? "#ef4444" : parseFloat(loanVals[c.col]?.rem) === 0 ? "#22c55e" : "inherit" }} />
                        </td>
                      ))}
                      <td><input readOnly value="" placeholder="0.00" /></td>
                      <td><input readOnly value={totRem} placeholder="0.00" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Closing table ── */}
          {showCloseSec && (
            <div className="txn-dyn-section">
              <div className="pf-section-header" style={{ marginBottom: 12, paddingBottom: 12 }}>
                <span className="pf-section-dot" style={{ background: "#ef4444" }} />
                <span className="pf-section-title" style={{ fontSize: 12.5 }}>Closing Charges</span>
              </div>
              <div className="txn-tbl-wrap">
                <table className="txn-dyn-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", paddingLeft: 10 }}>Type</th>
                      {CLOSING_COLS.map(c => <th key={c.col}>{c.desc}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="txn-recv-row">
                      <td className="txn-row-label">Receivable</td>
                      {CLOSING_COLS.map(c => <td key={c.col}><input readOnly value={closeVals[c.col]?.recv || ""} placeholder="0.00" /></td>)}
                    </tr>
                    <tr className="txn-rcvd-row">
                      <td className="txn-row-label">Received</td>
                      {CLOSING_COLS.map(c => (
                        <td key={c.col}>
                          <input value={closeVals[c.col]?.rcvd || ""} placeholder="0.00"
                            onChange={e => closeRcvdChange(c.col, e.target.value)} />
                        </td>
                      ))}
                    </tr>
                    <tr className="txn-rem-row">
                      <td className="txn-row-label">Remaining</td>
                      {CLOSING_COLS.map(c => <td key={c.col}><input readOnly value={closeVals[c.col]?.rem || ""} placeholder="0.00" /></td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Transfer list ── */}
        {txnRows.length > 0 && (
          <div className="pf-section-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="pf-section-header" style={{ padding: "16px 20px", marginBottom: 0, borderBottom: "1px solid var(--p-border)" }}>
              <span className="pf-section-dot" />
              <span className="pf-section-title">Transfer List</span>
              <span className="pf-section-count">{txnRows.length} entries</span>
            </div>
            <div className="txn-tbl-wrap">
              <table className="txn-list-table">
                <thead>
                  <tr>
                    <th>OP</th>
                    <th>Account Code</th>
                    <th>Account Name</th>
                    <th style={{ textAlign: "right" }}>Amount (₹)</th>
                    <th>Particular</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {txnRows.map(r => (
                    <tr key={r.id} className={r.op === "Debit" ? "txn-list-debit" : "txn-list-credit"}>
                      <td>
                        <span className={`pf-badge ${r.op === "Debit" ? "pf-badge-error" : "pf-badge-success"}`}>
                          <span className="pf-badge-dot" />
                          {r.op}
                        </span>
                      </td>
                      <td><span className="pf-code">{r.code}</span></td>
                      <td><strong>{r.name}</strong></td>
                      <td style={{ textAlign: "right", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                        {parseFloat(r.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: "var(--p-text-3)", fontSize: 12.5 }}>{r.particular || "—"}</td>
                      <td>
                        <button className="pf-btn pf-btn-danger pf-btn-sm"
                          onClick={() => setTxnRows(p => p.filter(x => x.id !== r.id))}>
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ══ Success Modal ══ */}
      {authModal.on && (
        <div className="txn-overlay" onClick={() => setAuthModal({ on: false, msg: "", scroll: "" })}>
          <div className="txn-modal" onClick={e => e.stopPropagation()}>
            <div className="txn-modal-icon">✓</div>
            <h3 className="txn-modal-title">{authModal.msg}</h3>
            <p className="txn-modal-scroll">{authModal.scroll}</p>
            <button className="pf-btn pf-btn-primary" style={{ marginTop: 8 }}
              onClick={() => setAuthModal({ on: false, msg: "", scroll: "" })}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* ══ Lookup Modal ══ */}
      {lkOn && (
        <div className="txn-overlay" onClick={() => { setLkOn(false); setLkQ(""); }}>
          <div className="txn-lookup-box" onClick={e => e.stopPropagation()}>
            <div className="txn-lookup-header">
              <div>
                <span className="txn-lookup-title">Select Account</span>
                <span className="pf-badge pf-badge-pending" style={{ marginLeft: 8 }}>{acCat.toUpperCase()}</span>
              </div>
              <button className="pf-btn pf-btn-danger pf-btn-sm"
                onClick={() => { setLkOn(false); setLkQ(""); }}>✕ Close</button>
            </div>
            <input
              className="pf-search"
              style={{ width: "100%", marginBottom: 12 }}
              placeholder="🔍 Search by code or name…"
              value={lkQ}
              onChange={e => setLkQ(e.target.value)}
            />
            <div className="txn-tbl-wrap">
              <table className="txn-list-table">
                <thead>
                  <tr><th>Code</th><th>Name</th><th>Product</th></tr>
                </thead>
                <tbody>
                  {lkAccs.map(a => (
                    <tr key={a.code} style={{ cursor: "pointer" }}
                      onClick={() => { pickAccount(a.code, a.name); setLkOn(false); setLkQ(""); }}>
                      <td><span className="pf-code">{a.code}</span></td>
                      <td><strong>{a.name}</strong></td>
                      <td><span className="pf-badge pf-badge-error">{a.prod}</span></td>
                    </tr>
                  ))}
                  {lkAccs.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--p-text-3)", padding: "20px", fontStyle: "italic" }}>No accounts found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}