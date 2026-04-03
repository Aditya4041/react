import { useState, useEffect, useRef, useCallback } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --primary:#3730a3;
  --primary-bg:#ede9fe;
  --primary-border:#a5b4fc;
  --primary-dark:#1e1b4b;
  --bg-page:#e8e8f0;
  --bg-card:#ffffff;
  --text:#1e1b4b;
  --text-light:#6b7280;
  --input-pad:8px 12px;
  --btn-pad:8px 16px;
  --radius:6px;
}
body{font-family:'Inter',sans-serif;background:var(--bg-page);margin:0;}
.page{min-height:100vh;background:var(--bg-page);border-radius: 11px;font-family:'Inter',sans-serif}
.card{background:var(--bg-card);border-radius:14px;border:1.5px solid #d1c4f0;
  padding:22px 26px 26px;box-shadow:0 2px 16px rgba(55,48,163,.07)}
.card-title{font-size:15px;font-weight:700;color:var(--primary-dark);margin-bottom:18px}

/* ── Radio pills ── */
.radio-row{display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap}
.radio-group{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.group-label{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;margin-right:2px}
.radio-pill{display:flex;align-items:center;gap:7px;padding:var(--btn-pad);border-radius:var(--radius);
  border:1.5px solid var(--primary-border);cursor:pointer;font-size:13px;font-weight:500;
  color:var(--text);background:#fff;transition:all .15s;user-select:none;white-space:nowrap}
.radio-pill:hover{border-color:var(--primary);background:var(--primary-bg)}
.radio-pill.sel{border-color:var(--primary);background:var(--primary-bg);color:var(--primary-dark);font-weight:600}
.radio-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--primary-border);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fff}
.radio-pill.sel .radio-dot{border-color:var(--primary)}
.radio-inner{width:8px;height:8px;border-radius:50%;background:var(--primary);display:none}
.radio-pill.sel .radio-inner{display:block}

/* ── Transfer strip — now inline, no extra margin ── */
.transfer-strip{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
  padding:8px 12px;background:var(--primary-bg);border:1.5px solid var(--primary-border);
  border-radius:var(--radius)}
.strip-label{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap}
#opTypeSel{font-weight:700;color:#fff;border-radius:var(--radius);padding:var(--btn-pad);
  border:1.5px solid var(--primary-border);font-size:13px;font-family:'Inter',sans-serif;outline:none;cursor:pointer}
#opTypeSel.debit{background:#dc2626}
#opTypeSel.credit{background:#059669}
.totals-inp{width:105px;text-align:right;font-weight:700;background:#eef2ff;
  border:1.5px solid var(--primary-border);border-radius:var(--radius);
  padding:var(--input-pad);font-size:13px;color:var(--text);outline:none}
.totals-inp.tallied{border-color:#059669;color:#059669}
.tallied-msg{color:#059669;font-weight:700;font-size:14px}

/* ── Main fields row ── */
.fields-row{display:flex;align-items:flex-start;gap:12px;flex-wrap:nowrap;margin-bottom:14px}
.field{display:flex;flex-direction:column;gap:5px}
.field-label{font-size:12px;font-weight:600;color:var(--text);text-transform:uppercase;letter-spacing:.3px}

/* ── Inputs / Select / Textarea ── */
.inp,.sel,.ta{
  padding:var(--input-pad);border:1.5px solid var(--primary-border);border-radius:var(--radius);
  font-family:'Inter',sans-serif;font-size:13px;color:var(--text);background:#fff;
  outline:none;transition:border-color .15s,box-shadow .15s}
.inp:focus,.sel:focus,.ta:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(55,48,163,.1)}
.inp::placeholder,.ta::placeholder{color:#b0b7c3}
.inp[readonly]{background:#f5f5f5;cursor:not-allowed;color:#888}
.sel{appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%233730a3' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;padding-right:28px;
  cursor:pointer;font-weight:600}
.ta{resize:vertical;height:44px}
.code-wrap{display:flex;gap:5px;align-items:stretch}
.code-wrap .inp{flex:1}

/* ── Buttons ── */
.btn-dots,.btn-add,.btn-save{
  padding:var(--btn-pad);border-radius:var(--radius);border:none;
  font-family:'Inter',sans-serif;font-size:13px;font-weight:700;
  cursor:pointer;transition:background .15s,transform .1s;white-space:nowrap}
.btn-dots{background:var(--primary-dark);color:#fff;font-size:15px;line-height:1;flex-shrink:0}
.btn-dots:hover{background:var(--primary)}
.btn-add{background:var(--primary-dark);color:#fff;font-size:16px;align-self:center}
.btn-add:hover{background:var(--primary)}
.btn-save{background:var(--primary-dark);color:#fff;padding:9px 22px;align-self:center}
.btn-save:hover{background:var(--primary);transform:translateY(-1px)}
.btn-save:active{transform:translateY(0)}
/* hint sits below the code-wrap */
.search-hint{font-size:11px;color:var(--text-light);font-style:italic;margin-top:3px}

/* ── Live search dropdown ── */
.search-wrap{position:relative}
.srch-dropdown{position:absolute;top:calc(100% + 2px);left:0;width:max-content;min-width:100%;
  max-height:280px;overflow-y:auto;background:#fff;border:1.5px solid var(--primary);
  border-radius:var(--radius);box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:1000}
.srch-item{padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0f0f0;
  display:flex;align-items:center;gap:10px;transition:.15s}
.srch-item:hover{background:var(--primary-bg);transform:translateX(4px)}
.srch-code{font-weight:700;color:var(--primary-dark);font-size:13px;min-width:130px}
.srch-name{color:#0306ff;font-size:12px;font-weight:700;flex:1;padding-left:8px}
.srch-prod{color:#a52323;font-size:11px;font-weight:700;white-space:nowrap}
.srch-info{padding:12px;text-align:center;color:#999;font-size:12px;font-style:italic}
.hl{background:#fef08a;font-weight:700;padding:0 2px;border-radius:2px}

/* ── Cheque row ── */
.cheque-row{display:none;align-items:flex-end;gap:12px;justify-content: center;flex-wrap:wrap;margin-bottom:14px;
  animation:fadeIn .25s ease}
.cheque-row.on{display:flex}
@keyframes fadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}

/* ── Loan / Closing table ── */
.dyn-section{display:none;margin-top:14px}
.dyn-section.on{display:block}
.dyn-table{width:100%;border-collapse:collapse;table-layout:fixed}
.dyn-table thead{background:linear-gradient(135deg,var(--primary) 0%,var(--primary-dark) 100%);color:#fff}
.dyn-table th{padding:5px 3px;font-size:10px;text-align:center;
  border-right:1px solid rgba(255,255,255,.2);font-weight:700;word-wrap:break-word;line-height:1.2}
.dyn-table th:first-child{text-align:left;padding-left:8px;width:72px}
.dyn-table td{padding:3px 2px;text-align:center;border-bottom:1px solid #e0e0e0;border-right:1px solid #e0e0e0}
.dyn-table td:first-child{text-align:left;font-weight:700;font-size:10px;color:var(--primary);
  padding-left:8px;background:#f9f9f9;width:72px}
.dyn-table input{width:100%;padding:2px 3px;border:1px solid #ddd;border-radius:3px;
  text-align:right;font-size:10px;font-weight:700;font-family:'Inter',sans-serif}
.dyn-table input[readonly]{background:#f0f0f0;color:#666;cursor:not-allowed}
.dyn-table input:focus{outline:none;border-color:var(--primary)}
.recv-row td{background:#fffbeb!important}.rcvd-row td{background:#eff6ff!important}
.rem-row td{background:#fef2f2!important}
.recv-row td:first-child,.rcvd-row td:first-child,.rem-row td:first-child{background:#f9f9f9!important}

/* ── Transfer list table ── */
.txn-list{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
.txn-list thead tr{background:var(--primary-dark);color:#fff}
.txn-list th{padding:6px 8px;text-align:left;border:1px solid #ddd}
.txn-list td{padding:4px 7px;border:1px solid #ddd}
.rm-btn{background:#dc2626;color:#fff;border:none;padding:2px 8px;border-radius:4px;
  font-size:13px;font-weight:700;cursor:pointer}
.rm-btn:hover{background:#b91c1c}

/* ── Modals ── */
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.48);
  justify-content:center;align-items:center;z-index:9999}
.overlay.on{display:flex}
.m-box{background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.25);
  text-align:center;padding:36px 42px;min-width:380px}
.m-check{color:#2ecc71;font-size:48px;margin-bottom:14px}
.m-err{color:#e53935;font-size:48px;margin-bottom:14px}
.m-title{font-size:18px;font-weight:700;color:#222;margin-bottom:10px}
.m-sub{font-size:22px;font-weight:700;color:#444;margin-bottom:24px}
.m-ok-g{background:#2ecc71;color:#fff;border:none;padding:11px 46px;border-radius:var(--radius);
  font-size:14px;font-weight:700;cursor:pointer}
.m-ok-g:hover{background:#27ae60}
.m-ok-r{background:#e53935;color:#fff;border:none;padding:11px 46px;border-radius:var(--radius);
  font-size:14px;font-weight:700;cursor:pointer}
.m-ok-r:hover{background:#c62828}
/* Lookup */
.lk-box{background:#fff;width:72%;max-height:78vh;overflow:auto;
  padding:20px;border-radius:10px}
.lk-title{font-size:17px;font-weight:700;color:var(--primary-dark);margin-bottom:8px}
.lk-badge{display:inline-block;padding:3px 11px;margin-left:8px;background:#8066E8;
  color:#fff;border-radius:14px;font-size:11px;font-weight:700}
.lk-search{display:block;width:50%;margin:0 auto 10px;padding:7px 10px;font-size:13px;
  border:1.5px solid var(--primary-border);border-radius:var(--radius);outline:none;font-family:'Inter',sans-serif}
.lk-table{width:100%;border-collapse:collapse}
.lk-table th{background:var(--primary-dark);color:#fff;padding:9px 10px;font-size:13px;text-align:left}
.lk-table td{border:1px solid #ccc;padding:8px 10px;cursor:pointer;font-size:13px}
.lk-table tr:hover td{background:var(--primary-bg)}
.lk-no{text-align:center;color:#999;font-style:italic;padding:16px}

/* ── Toast ── */
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);
  background:#fff;color:#333;border-radius:8px;font-size:13px;padding:13px 22px;
  box-shadow:0 3px 10px rgba(0,0,0,.18);z-index:99999;border-left:5px solid #2196F3;
  opacity:0;pointer-events:none;transition:opacity .3s}
.toast.on{opacity:1;pointer-events:auto}
`;

/* ── Mock data (replace with real API calls) ── */
const MOCK_ACCS = [
  {code:"01012000001",name:"Ramesh Patil",       prod:"SAVING REGULAR"},
  {code:"01012000045",name:"Sunita Sharma",      prod:"SAVING BASIC"},
  {code:"01012000099",name:"Vijay Desai",        prod:"SAVING PREMIUM"},
  {code:"01015000123",name:"Kiran Joshi",        prod:"HOUSING LOAN"},
  {code:"01014000011",name:"Mahesh Deposit",     prod:"FD 1 YEAR"},
  {code:"01011000088",name:"Anita Current Acct", prod:"CURRENT REGULAR"},
];
const MOCK_CHEQUES = [
  {chequeNumber:"000101",chequeSeries:"A",chequeTypeCode:"LOCAL"},
  {chequeNumber:"000102",chequeSeries:"A",chequeTypeCode:"LOCAL"},
  {chequeNumber:"000201",chequeSeries:"B",chequeTypeCode:"OUTSTATION"},
  {chequeNumber:"000202",chequeSeries:"B",chequeTypeCode:"OUTSTATION"},
];
const LOAN_COLS   = [{col:"INTEREST",desc:"Interest"},{col:"PENALTY",desc:"Penalty"},
                     {col:"INSURANCE",desc:"Insurance"},{col:"OTHER",desc:"Other Chg"}];
const CLOSING_COLS= [{col:"INT_AMOUNT",desc:"Interest"},{col:"SERVICE_CHG",desc:"Service Chg"},
                     {col:"TOD_INT",desc:"TOD Int"},{col:"OTHER_CHG",desc:"Other Chg"}];

function hl(text, search) {
  const l7 = text.slice(-7), idx = l7.indexOf(search);
  if (idx===-1) return <>{text}</>;
  const ai = text.length-7+idx;
  return <>{text.slice(0,ai)}<span className="hl">{search}</span>{text.slice(ai+search.length)}</>;
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

  const [srchRes,    setSrchRes]    = useState([]);
  const [showSrch,   setShowSrch]   = useState(false);
  const [srching,    setSrching]    = useState(false);
  const srchTimer = useRef(null);

  const mkLoanInit = () => { const o={}; LOAN_COLS.forEach(c=>{o[c.col]={recv:"",rcvd:"",rem:""}}); return o; };
  const [loanVals, setLoanVals]   = useState(mkLoanInit());
  const [totRecv,  setTotRecv]    = useState(""); 
  const [totRcvd,  setTotRcvd]    = useState(""); 
  const [totRem,   setTotRem]     = useState("");
  const [princRcvd,setPrincRcvd]  = useState("0.00");

  const mkCloseInit = () => { const o={}; CLOSING_COLS.forEach(c=>{o[c.col]={recv:"",rcvd:"",rem:""}}); return o; };
  const [closeVals, setCloseVals] = useState(mkCloseInit());

  const [txnRows,   setTxnRows]   = useState([]);
  const [totDr,     setTotDr]     = useState("0.00");
  const [totCr,     setTotCr]     = useState("0.00");

  const [authM, setAuthM]   = useState({on:false,msg:"",scroll:""});
  const [valM,  setValM]    = useState({on:false,msg:""});
  const [lkOn,  setLkOn]    = useState(false);
  const [lkQ,   setLkQ]     = useState("");
  const [toast, setToast]   = useState({on:false,msg:"",type:"info"});
  const tTimer = useRef(null);

  const showToast = useCallback((msg,type="info")=>{
    clearTimeout(tTimer.current);
    setToast({on:true,msg,type});
    tTimer.current = setTimeout(()=>setToast(t=>({...t,on:false})),4200);
  },[]);

  /* visibility */
  const showCheqRow    = (opType==="withdrawal"||(opType==="transfer"&&trOp==="Debit"))&&txType!=="closing";
  const showLoanSec    = (acCat==="loan"||acCat==="cc")&&txType!=="closing";
  const showTrStrip    = opType==="transfer"&&txType!=="closing";
  const showCloseSec   = txType==="closing";
  const showAddBtn     = opType==="transfer"&&txType!=="closing";
  const tallied        = parseFloat(totDr)>0&&totDr===totCr;

  /* auto particular */
  useEffect(()=>{
    if(opType==="deposit") setParticular("By Cash");
    else if(opType==="withdrawal") setParticular("To Cash");
    else if(opType==="transfer") setParticular(trOp==="Debit"?"To Transfer":"By Transfer");
  },[opType,trOp]);

  /* totals */
  useEffect(()=>{
    let d=0,c=0;
    txnRows.forEach(r=>{ const a=parseFloat(r.amount)||0; if(r.op==="Debit") d+=a; else c+=a; });
    setTotDr(d.toFixed(2)); setTotCr(c.toFixed(2));
  },[txnRows]);

  /* principle */
  useEffect(()=>{
    const a=parseFloat(txnAmt)||0, r=parseFloat(totRecv)||0;
    setPrincRcvd(a>r?(a-r).toFixed(2):"0.00");
  },[txnAmt,totRecv]);

  /* sequential loan deduction */
  useEffect(()=>{
    if(!showLoanSec) return;
    if(opType!=="deposit"&&!(opType==="transfer"&&trOp==="Credit")) return;
    seqLoanDeduct();
  // eslint-disable-next-line
  },[txnAmt]);

  function seqLoanDeduct(){
    const amt=parseFloat(txnAmt)||0;
    if(amt<=0){ resetLoanRcvd(); return; }
    let rem=amt; const upd={};
    LOAN_COLS.forEach(c=>{
      const rv=parseFloat(loanVals[c.col]?.recv)||0;
      if(rv>0&&rem>0){ const ded=Math.min(rv,rem); upd[c.col]={recv:rv.toFixed(2),rcvd:ded.toFixed(2),rem:(rv-ded).toFixed(2)}; rem-=ded; }
      else upd[c.col]={...loanVals[c.col],rcvd:"",rem:loanVals[c.col]?.recv||""};
    });
    setLoanVals(upd);
    let tr=0; Object.values(upd).forEach(v=>{tr+=parseFloat(v.rcvd)||0});
    setTotRcvd(tr.toFixed(2)); setTotRem(((parseFloat(totRecv)||0)-tr).toFixed(2));
  }

  function resetLoanRcvd(){
    setLoanVals(prev=>{ const o={}; Object.entries(prev).forEach(([k,v])=>{o[k]={...v,rcvd:"",rem:v.recv}}); return o; });
    setTotRcvd(""); setTotRem(totRecv); setPrincRcvd("0.00");
  }

  function clearAll(){
    setAcCode(""); setAcName(""); setTxnAmt(""); setShowSrch(false);
    setCheqType(""); setCheqSeries(""); setCheqNo(""); setCheqDate(""); setAllCheqs([]);
    setLoanVals(mkLoanInit()); setTotRecv(""); setTotRcvd(""); setTotRem(""); setPrincRcvd("0.00");
    setTxnRows([]);
  }

  /* Live search */
  function handleCodeChange(v){
    const clean=v.replace(/\D/g,"");
    setAcCode(clean); setAcName("");
    if(!clean){ setShowSrch(false); return; }
    const s=clean.length>7?clean.slice(-7):clean;
    if(s.length<3){ setSrchRes([{info:"Type at least 3 digits..."}]); setShowSrch(true); return; }
    clearTimeout(srchTimer.current); setSrching(true); setShowSrch(true);
    srchTimer.current=setTimeout(()=>{
      const r=MOCK_ACCS.filter(a=>{ const l7=a.code.slice(-7); return l7.includes(s); });
      setSrchRes(r); setSrching(false);
    },300);
  }

  function pickAccount(code,name){
    setAcCode(code); setAcName(name); setShowSrch(false);
    if(showCheqRow){ setAllCheqs(MOCK_CHEQUES); showToast("Cheque data loaded","info"); }
    if(showLoanSec) loadLoanData(code);
  }

  function loadLoanData(code){
    const upd={}; let tot=0;
    LOAN_COLS.forEach(c=>{ const v=Math.round(Math.random()*20000)/10; upd[c.col]={recv:v.toFixed(2),rcvd:"",rem:v.toFixed(2)}; tot+=v; });
    setLoanVals(upd); setTotRecv(tot.toFixed(2)); setTotRem(tot.toFixed(2)); setTotRcvd("");
    showToast("Loan receivable data loaded","info");
  }

  const uSeries=[...new Set(allCheqs.map(c=>c.chequeSeries).filter(Boolean))];
  const uTypes=[...new Set(allCheqs.map(c=>c.chequeTypeCode).filter(Boolean))];
  const filtNos=allCheqs.filter(c=>(!cheqSeries||c.chequeSeries===cheqSeries)&&(!cheqType||c.chequeTypeCode===cheqType));

  function loanRcvdChange(col,val){
    setLoanVals(prev=>{
      const rv=parseFloat(prev[col]?.recv)||0, rc=parseFloat(val)||0;
      const upd={...prev,[col]:{...prev[col],rcvd:val,rem:(rv-rc).toFixed(2)}};
      let tr=0; Object.values(upd).forEach(v=>{tr+=parseFloat(v.rcvd)||0});
      setTotRcvd(tr.toFixed(2)); setTotRem(((parseFloat(totRecv)||0)-tr).toFixed(2));
      return upd;
    });
  }

  function closeRcvdChange(col,val){
    setCloseVals(prev=>{
      const rv=parseFloat(prev[col]?.recv)||0;
      return {...prev,[col]:{...prev[col],rcvd:val,rem:(rv-(parseFloat(val)||0)).toFixed(2)}};
    });
  }

  function addRow(){
    if(!acCode){showToast("Please enter or select an account code","error");return}
    if(!acName){showToast("Please select an account","error");return}
    if(!txnAmt||parseFloat(txnAmt)<=0){showToast("Please enter a valid transaction amount","error");return}
    setTxnRows(prev=>[...prev,{id:Date.now(),code:acCode,name:acName,
      amount:parseFloat(txnAmt).toFixed(2),particular,op:trOp,
      cheq:trOp==="Debit"?{cheqType,cheqSeries,cheqNo,cheqDate}:null}]);
    setAcCode(""); setAcName(""); setTxnAmt(""); setShowSrch(false);
    setCheqType(""); setCheqSeries(""); setCheqNo(""); setCheqDate("");
    showToast("Transaction added to list","success");
  }

  function handleSave(){
    if(opType==="transfer"){
      if(txnRows.length===0){showToast("Please add at least one transaction","error");return}
      if(!tallied){showToast("Debit and Credit must be equal and non-zero","error");return}
      const s=Math.floor(Math.random()*900000)+100000;
      setAuthM({on:true,msg:"All transfer transactions saved successfully!",scroll:`Scroll Number: ${s}`});
      setTxnRows([]); clearAll();
    } else {
      if(!acCode){showToast("Please enter or select an account code","error");return}
      if(!txnAmt||parseFloat(txnAmt)<=0){showToast("Please enter a valid transaction amount","error");return}
      const s=Math.floor(Math.random()*900000)+100000;
      setAuthM({on:true,msg:"Transaction saved successfully!",scroll:`Scroll Number: ${s}`});
      clearAll();
    }
  }

  const Pill=({label,val,cur,onChange})=>(
    <div className={`radio-pill${cur===val?" sel":""}`} onClick={()=>onChange(val)}>
      <span className="radio-dot"><span className="radio-inner"/></span>{label}
    </div>
  );

  const lkAccs=MOCK_ACCS.filter(a=>{ if(!lkQ) return true; const q=lkQ.toLowerCase(); return a.code.toLowerCase().includes(q)||a.name.toLowerCase().includes(q); });

  const toastColor={success:"#059669",error:"#dc2626",warning:"#d97706",info:"#2563EB"}[toast.type]||"#2563EB";

  return (
    <>
      <style>{css}</style>

      {/* Toast */}
      <div className={`toast${toast.on?" on":""}`} style={{borderLeftColor:toastColor}}>
        {toast.type==="success"?"✅":toast.type==="error"?"❌":toast.type==="warning"?"⚠️":"ℹ️"} {toast.msg}
      </div>

      <div className="page">
        <div className="card">
          <div className="card-title">Transaction Details</div>

          {/* ── Radio row + inline transfer strip ── */}
          <div className="radio-row">
            <div className="radio-group">
              <span className="group-label">Transaction Type:</span>
              <Pill label="Regular" val="regular" cur={txType} onChange={v=>{setTxType(v);clearAll();if(v==="closing")setOpType("deposit")}}/>
              <Pill label="Closing" val="closing" cur={txType} onChange={v=>{setTxType(v);clearAll()}}/>
            </div>

            {txType!=="closing"&&(
              <div className="radio-group">
                <span className="group-label">Operation Type:</span>
                <Pill label="Deposit"    val="deposit"    cur={opType} onChange={v=>{setOpType(v);clearAll();setParticular("By Cash")}}/>
                <Pill label="Withdrawal" val="withdrawal" cur={opType} onChange={v=>{setOpType(v);clearAll();setParticular("To Cash")}}/>
                <Pill label="Transfer"   val="transfer"   cur={opType} onChange={v=>{setOpType(v);clearAll();setParticular(trOp==="Debit"?"To Transfer":"By Transfer")}}/>
              </div>
            )}

            {/* Transfer strip — rendered inline, right of Operation Type pills */}
            {showTrStrip&&(
              <div className="transfer-strip">
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span className="strip-label">OP Type:</span>
                  <select id="opTypeSel" className={trOp==="Debit"?"debit":"credit"} value={trOp}
                    onChange={e=>{setTrOp(e.target.value);setAcCode("");setAcName("");setTxnAmt("");
                      setParticular(e.target.value==="Debit"?"To Transfer":"By Transfer");
                      setCheqType("");setCheqSeries("");setCheqNo("");setCheqDate("");setAllCheqs([]);
                      if(showLoanSec)setLoanVals(mkLoanInit())}}>
                    <option value="Debit">DEBIT</option>
                    <option value="Credit">CREDIT</option>
                  </select>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span className="strip-label">Total Debit:</span>
                  <input className={`totals-inp${tallied?" tallied":""}`} readOnly value={totDr}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span className="strip-label">Total Credit:</span>
                  <input className={`totals-inp${tallied?" tallied":""}`} readOnly value={totCr}/>
                </div>
                {tallied&&<span className="tallied-msg">✓ Transaction tallied</span>}
              </div>
            )}
          </div>

          {/* ── Main fields ── */}
          <div className="fields-row">

            {/* Account Type */}
            <div className="field">
              <div className="field-label">Account Type</div>
              <select className="sel" value={acCat}
                onChange={e=>{setAcCat(e.target.value);setLoanVals(mkLoanInit());setTotRecv("");setTotRcvd("");setTotRem("")}}>
                {["saving","loan","deposit","pigmy","current","cc","other"].map(v=>(
                  <option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Account Code — hint sits below the code-wrap */}
            <div className="field">
              <div className="field-label">
                {opType==="transfer"?(trOp==="Debit"?"Debit Account Code":"Credit Account Code"):"Account Code"}
              </div>
              <div className="code-wrap">
                <div className="search-wrap">
                  <input className="inp" style={{width:148}} placeholder="Enter account code"
                    value={acCode} maxLength={14} autoComplete="off"
                    onChange={e=>handleCodeChange(e.target.value)}
                    onBlur={()=>setTimeout(()=>setShowSrch(false),180)}/>
                  {showSrch&&(
                    <div className="srch-dropdown">
                      {srching?<div className="srch-info">🔄 Searching...</div>
                      :srchRes.length===0?<div className="srch-info">No accounts found</div>
                      :srchRes[0]?.info?<div className="srch-info">{srchRes[0].info}</div>
                      :srchRes.map(a=>(
                        <div key={a.code} className="srch-item" onMouseDown={()=>pickAccount(a.code,a.name)}>
                          <span className="srch-code">{hl(a.code, acCode.length>7?acCode.slice(-7):acCode)}</span>
                          <span className="srch-name">{a.name}</span>
                          {a.prod&&<span className="srch-prod">{a.prod}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="btn-dots" onClick={()=>setLkOn(true)}>···</button>
              </div>
              {/* hint below the code input + dots button */}
              <span className="search-hint">Type last 7 digits to search</span>
            </div>

            {/* Account Name */}
            <div className="field" style={{flex:"1 1 160px"}}>
              <div className="field-label">
                {opType==="transfer"?(trOp==="Debit"?"Debit Account Name":"Credit Account Name"):"Account Name"}
              </div>
              <input className="inp" placeholder="Account Name" value={acName} readOnly/>
            </div>

            {/* Transaction Amount */}
            <div className="field" style={{flex:"1 1 140px"}}>
              <div className="field-label">Transaction Amount</div>
              <input className="inp" placeholder="Enter Transaction" value={txnAmt}
                onChange={e=>setTxnAmt(e.target.value.replace(/[^0-9.]/g,""))}/>
            </div>

            {/* Particular */}
            <div className="field" style={{flex:"2 1 190px"}}>
              <div className="field-label">Particular</div>
              <textarea className="ta inp" value={particular}
                onChange={e=>setParticular(e.target.value)}/>
            </div>

            {showAddBtn&&<button type="button" className="btn-add" onClick={addRow}>+</button>}
            <button type="button" className="btn-save" onClick={handleSave}>Save</button>
          </div>

          {/* ── Cheque row ── */}
          <div className={`cheque-row${showCheqRow?" on":""}`}>
            <div className="field">
              <div className="field-label">Cheque Type</div>
              <select className="sel" value={cheqType} onChange={e=>setCheqType(e.target.value)}>
                <option value="">Select Cheque Type</option>
                {uTypes.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <div className="field-label">Cheque Series</div>
              <select className="sel" value={cheqSeries} onChange={e=>setCheqSeries(e.target.value)}>
                <option value="">Select Cheque Series</option>
                {uSeries.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <div className="field-label">Cheque No</div>
              <select className="sel" value={cheqNo} onChange={e=>setCheqNo(e.target.value)}>
                <option value="">Select Cheque No</option>
                {filtNos.map(c=><option key={c.chequeNumber} value={c.chequeNumber}>{c.chequeNumber}</option>)}
              </select>
            </div>
            <div className="field">
              <div className="field-label">Cheque Date</div>
              <input type="date" className="inp" value={cheqDate} onChange={e=>setCheqDate(e.target.value)}/>
            </div>
          </div>

          {/* ── Loan table ── */}
          <div className={`dyn-section${showLoanSec?" on":""}`}>
            <table className="dyn-table">
              <thead><tr>
                <th style={{textAlign:"left",paddingLeft:8}}>Type</th>
                {LOAN_COLS.map(c=><th key={c.col} title={c.desc}>{c.desc}</th>)}
                <th>Principle</th><th>Total</th>
              </tr></thead>
              <tbody>
                <tr className="recv-row"><td>Receivable</td>
                  {LOAN_COLS.map(c=><td key={c.col}><input readOnly value={loanVals[c.col]?.recv||""} placeholder="0.00"/></td>)}
                  <td><input readOnly value="" placeholder="0.00" style={{background:"#dcfce7"}}/></td>
                  <td><input readOnly value={totRecv} placeholder="0.00"/></td>
                </tr>
                <tr className="rcvd-row"><td>Received</td>
                  {LOAN_COLS.map(c=><td key={c.col}><input value={loanVals[c.col]?.rcvd||""} placeholder="0.00"
                    onChange={e=>loanRcvdChange(c.col,e.target.value)}/></td>)}
                  <td><input readOnly value={princRcvd} placeholder="0.00" style={{background:"#dcfce7",color:"#166534",fontWeight:700}}/></td>
                  <td><input value={totRcvd} placeholder="0.00"
                    onChange={e=>{setTotRcvd(e.target.value);setTotRem(((parseFloat(totRecv)||0)-(parseFloat(e.target.value)||0)).toFixed(2))}}/></td>
                </tr>
                <tr className="rem-row"><td>Remaining</td>
                  {LOAN_COLS.map(c=><td key={c.col}><input readOnly value={loanVals[c.col]?.rem||""} placeholder="0.00"
                    style={{color:parseFloat(loanVals[c.col]?.rem)<0?"#dc2626":parseFloat(loanVals[c.col]?.rem)===0?"#059669":"inherit"}}/></td>)}
                  <td><input readOnly value="" placeholder="0.00" style={{background:"#dcfce7"}}/></td>
                  <td><input readOnly value={totRem} placeholder="0.00"/></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Closing table ── */}
          <div className={`dyn-section${showCloseSec?" on":""}`}>
            <table className="dyn-table">
              <thead><tr>
                <th style={{textAlign:"left",paddingLeft:8}}>Type</th>
                {CLOSING_COLS.map(c=><th key={c.col} title={c.desc}>{c.desc}</th>)}
              </tr></thead>
              <tbody>
                <tr className="recv-row"><td>Receivable</td>
                  {CLOSING_COLS.map(c=><td key={c.col}><input readOnly value={closeVals[c.col]?.recv||""} placeholder="0.00"/></td>)}
                </tr>
                <tr className="rcvd-row"><td>Received</td>
                  {CLOSING_COLS.map(c=><td key={c.col}><input value={closeVals[c.col]?.rcvd||""} placeholder="0.00"
                    onChange={e=>closeRcvdChange(c.col,e.target.value)}/></td>)}
                </tr>
                <tr className="rem-row"><td>Remaining</td>
                  {CLOSING_COLS.map(c=><td key={c.col}><input readOnly value={closeVals[c.col]?.rem||""} placeholder="0.00"/></td>)}
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Transfer list ── */}
          {txnRows.length>0&&(
            <table className="txn-list" style={{marginTop:12}}>
              <thead><tr><th>OP</th><th>Account Code</th><th>Account Name</th>
                <th style={{textAlign:"right"}}>Amount</th><th>Particular</th><th>×</th></tr></thead>
              <tbody>
                {txnRows.map(r=>(
                  <tr key={r.id} style={{background:r.op==="Debit"?"#fee2e2":"#dcfce7"}}>
                    <td style={{fontWeight:700,color:r.op==="Debit"?"#991b1b":"#166534"}}>{r.op}</td>
                    <td>{r.code}</td><td>{r.name}</td>
                    <td style={{textAlign:"right",fontWeight:700}}>₹ {r.amount}</td>
                    <td>{r.particular||"-"}</td>
                    <td><button className="rm-btn" onClick={()=>setTxnRows(p=>p.filter(x=>x.id!==r.id))}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Auth modal ── */}
      <div className={`overlay${authM.on?" on":""}`}>
        <div className="m-box">
          <div className="m-check">✓</div>
          <div className="m-title">{authM.msg}</div>
          <div className="m-sub">{authM.scroll}</div>
          <button className="m-ok-g" onClick={()=>setAuthM({on:false,msg:"",scroll:""})}>OK</button>
        </div>
      </div>

      {/* ── Validation error modal ── */}
      <div className={`overlay${valM.on?" on":""}`}>
        <div className="m-box">
          <div className="m-err">✕</div>
          <div className="m-title">{valM.msg}</div>
          <button className="m-ok-r" onClick={()=>setValM({on:false,msg:""})}>OK</button>
        </div>
      </div>

      {/* ── Lookup modal ── */}
      <div className={`overlay${lkOn?" on":""}`}>
        <div className="lk-box">
          <button onClick={()=>{setLkOn(false);setLkQ("")}}
            style={{float:"right",background:"#dc2626",color:"#fff",border:"none",
              padding:"5px 11px",borderRadius:4,cursor:"pointer",fontSize:14}}>✖</button>
          <div className="lk-title">Select Account
            <span className="lk-badge">{acCat.toUpperCase()}</span>
          </div>
          <input className="lk-search" placeholder="🔍 Search by Account Code or Name..."
            value={lkQ} onChange={e=>setLkQ(e.target.value)}/>
          <table className="lk-table">
            <thead><tr><th>Code</th><th>Name</th><th>Product</th></tr></thead>
            <tbody>
              {lkAccs.map(a=>(
                <tr key={a.code} onClick={()=>{pickAccount(a.code,a.name);setLkOn(false);setLkQ("")}}>
                  <td>{a.code}</td><td>{a.name}</td>
                  <td style={{color:"#991b1b",fontWeight:700}}>{a.prod}</td>
                </tr>
              ))}
              {lkAccs.length===0&&<tr><td colSpan={3} className="lk-no">No accounts found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}