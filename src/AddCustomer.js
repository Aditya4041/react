import React, { useState, useEffect, useRef } from 'react';
import './AddCustomer.css';

/* ─── Tab config ─── */
const TABS = [
  { id: 1, label: 'Customer Information' },
  { id: 2, label: 'Personal Information' },
  { id: 3, label: 'Address Information' },
  { id: 4, label: 'KYC Documents' },
  { id: 5, label: 'Photo & Signature' },
];

/* ─── Reusable field components ─── */
function Field({ label, required, error, children }) {
  return (
    <div className="ac-field">
      <label className="ac-label">
        {label}{required && <span className="ac-req">*</span>}
      </label>
      {children}
      {error && <span className="ac-error-text">⚠ {error}</span>}
    </div>
  );
}

function TextInput({ label, required, error, ...props }) {
  return (
    <Field label={label} required={required} error={error}>
      <input className={`ac-input${error ? ' ac-input--error' : ''}`} {...props} />
    </Field>
  );
}

function SelectInput({ label, required, error, options, ...props }) {
  return (
    <Field label={label} required={required} error={error}>
      <select className={`ac-input ac-select${error ? ' ac-input--error' : ''}`} {...props}>
        <option value="">-- Select --</option>
        {options.map((o, i) => (
          <option key={i} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function RadioGroup({ label, required, name, options, value, onChange }) {
  return (
    <Field label={label} required={required}>
      <div className="ac-radio-group">
        {options.map((o) => (
          <label key={o.value} className="ac-radio-label">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </Field>
  );
}

/* ─── Validation helpers ─── */
const PATTERNS = {
  mobile: /^[6-9][0-9]{9}$/,
  zip: /^[4-5][0-9]{5}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  aadhar: /^[0-9]{12}$/,
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passport: /^[A-Z]{1}[0-9]{7}$/,
  voterid: /^[A-Z]{3}[0-9]{7}$/,
  dl: /^[A-Z]{2}[0-9]{13}$/,
};

function validateTabFields(tab, form, kyc, uploads) {
  const errors = {};

  if (tab === 1) {
    if (!form.isIndividual) errors.isIndividual = 'Required';
    if (!form.aadharNo || !PATTERNS.aadhar.test(form.aadharNo)) errors.aadharNo = 'Aadhar must be 12 digits';
    if (!form.gender) errors.gender = 'Required';
    if (!form.salutationCode) errors.salutationCode = 'Required';
    if (!form.firstName) errors.firstName = 'Required';
    if (!form.surname) errors.surname = 'Required';
    if (!form.middleName) errors.middleName = 'Required';
    if (!form.customerName) errors.customerName = 'Required';
    if (!form.birthDate) errors.birthDate = 'Required';
    if (!form.registrationDate) errors.registrationDate = 'Required';
    if (!form.isMinor) errors.isMinor = 'Required';
    if (form.isMinor === 'yes' && !form.guardianName) errors.guardianName = 'Required for minor';
    if (form.isMinor === 'yes' && !form.relationGuardian) errors.relationGuardian = 'Required for minor';
    if (!form.religionCode) errors.religionCode = 'Required';
    if (!form.casteCode) errors.casteCode = 'Required';
    if (!form.categoryCode) errors.categoryCode = 'Required';
    if (!form.constitutionCode) errors.constitutionCode = 'Required';
    if (!form.occupationCode) errors.occupationCode = 'Required';
    if (!form.memberType) errors.memberType = 'Required';
    if (!form.riskCategory) errors.riskCategory = 'Required';
  }

  if (tab === 2) {
    if (!form.motherName) errors.motherName = 'Required';
    if (!form.fatherName) errors.fatherName = 'Required';
    if (!form.maritalStatus) errors.maritalStatus = 'Required';
    if (form.maritalStatus !== 'Single') {
      if (!form.children) errors.children = 'Required';
      if (!form.dependents) errors.dependents = 'Required';
    }
  }

  if (tab === 3) {
    if (!form.residenceType) errors.residenceType = 'Required';
    if (!form.residenceStatus) errors.residenceStatus = 'Required';
    if (!form.address1) errors.address1 = 'Required';
    if (!form.address2) errors.address2 = 'Required';
    if (!form.address3) errors.address3 = 'Required';
    if (!form.country) errors.country = 'Required';
    if (!form.state) errors.state = 'Required';
    if (!form.city) errors.city = 'Required';
    if (!form.zip || !PATTERNS.zip.test(form.zip)) errors.zip = 'Invalid ZIP (starts with 4 or 5, 6 digits)';
    if (form.mobileNo && !PATTERNS.mobile.test(form.mobileNo)) errors.mobileNo = 'Must be 10 digits starting with 6-9';
    if (form.email && !PATTERNS.email.test(form.email)) errors.email = 'Invalid email format';
    if (form.gstinNo && !PATTERNS.gstin.test(form.gstinNo)) errors.gstinNo = 'Invalid GSTIN format';
  }

  if (tab === 4) {
    const idFilled =
      (kyc.passport && kyc.passportNo) ||
      (kyc.pan && kyc.panNo) ||
      (kyc.voterid && kyc.voteridNo) ||
      (kyc.dl && kyc.dlExpiry && kyc.dlNo) ||
      (kyc.aadharKyc && kyc.aadharKycNo) ||
      (kyc.nrega && kyc.nregaNo);
    if (!idFilled) errors.idProof = 'At least one ID Proof document must be selected and filled';

    const addrFilled =
      (kyc.telephone && kyc.telephoneNo) ||
      (kyc.bank && kyc.bankNo) ||
      (kyc.govt && kyc.govtNo) ||
      (kyc.electricity && kyc.electricityNo) ||
      (kyc.ration && kyc.rationNo);
    if (!addrFilled) errors.addrProof = 'At least one Address Proof document must be selected and filled';
  }

  if (tab === 5) {
    if (!uploads.photo) errors.photo = 'Customer photo is required';
    if (!uploads.signature) errors.signature = 'Customer signature is required';
  }

  return errors;
}

/* ─── KYC Document Row ─── */
function KycRow({ checked, onToggle, label, hasExpiry, expiry, onExpiry, docNo, onDocNo, docNoLabel = 'Document No' }) {
  return (
    <tr>
      <td><input type="checkbox" className="ac-checkbox" checked={checked} onChange={onToggle} /></td>
      <td className="ac-kyc-doc-label">{label}</td>
      <td>
        <input
          type="date"
          className="ac-input ac-input--sm"
          value={expiry || ''}
          onChange={e => onExpiry && onExpiry(e.target.value)}
          disabled={!hasExpiry || !checked}
        />
      </td>
      <td>
        <input
          type="text"
          className="ac-input ac-input--sm"
          placeholder={docNoLabel}
          value={docNo || ''}
          onChange={e => onDocNo(e.target.value)}
          disabled={!checked}
        />
      </td>
    </tr>
  );
}

/* ─── Upload Card ─── */
function UploadCard({ label, preview, onFile, onCamera, error }) {
  const inputRef = useRef();
  return (
    <div className={`ac-upload-card${error ? ' ac-upload-card--error' : ''}`}>
      <h3 className="ac-upload-title">{label}</h3>
      <div className="ac-upload-preview">
        {preview
          ? <img src={preview} alt="preview" className="ac-upload-img" />
          : <span className="ac-upload-placeholder">📷</span>}
      </div>
      <p className="ac-upload-hint">Drag & drop or use buttons below</p>
      <div className="ac-upload-btns">
        <button type="button" className="ac-btn ac-btn--outline" onClick={onCamera}>📸 Camera</button>
        <button type="button" className="ac-btn ac-btn--outline" onClick={() => inputRef.current.click()}>📁 Browse</button>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg" style={{ display: 'none' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
      {error && <span className="ac-error-text">⚠ {error}</span>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function AddCustomer() {
  const [currentTab, setCurrentTab] = useState(1);
  const [completedTabs, setCompletedTabs] = useState(new Set());
  const [enabledTabs, setEnabledTabs] = useState(new Set([1]));
  const [errors, setErrors] = useState({});
  const [submitDone, setSubmitDone] = useState(false);

  /* ─── Customer Information form state ─── */
  const [form, setForm] = useState({
    isIndividual: 'yes',
    aadharNo: '',
    gender: '',
    salutationCode: '',
    firstName: '',
    surname: '',
    middleName: '',
    customerName: '',
    birthDate: '',
    registrationDate: '',
    isMinor: 'no',
    guardianName: '',
    relationGuardian: '',
    religionCode: '',
    casteCode: '',
    categoryCode: '',
    subCategoryCode: '0',
    constitutionCode: 'OTHER',
    occupationCode: '',
    vehicleOwned: 'NOT APPLICABLE',
    memberType: 'A',
    email: '',
    gstinNo: '',
    memberNumber: '',
    ckyNo: '',
    riskCategory: 'LOW',
    // Personal Info
    motherName: '',
    fatherName: '',
    maritalStatus: 'Married',
    children: '',
    dependents: '',
    // Address
    nationality: 'INDIAN',
    residenceType: '',
    residenceStatus: '',
    address1: '',
    address2: '',
    address3: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    mobileNo: '',
    residencePhone: '',
    officePhone: '',
  });

  /* ─── KYC state ─── */
  const [kyc, setKyc] = useState({
    passport: false, passportExpiry: '', passportNo: '',
    pan: false, panNo: '',
    voterid: false, voteridNo: '',
    dl: false, dlExpiry: '', dlNo: '',
    aadharKyc: false, aadharKycNo: '',
    nrega: false, nregaNo: '',
    telephone: false, telephoneExpiry: '', telephoneNo: '',
    bank: false, bankExpiry: '', bankNo: '',
    govt: false, govtExpiry: '', govtNo: '',
    electricity: false, electricityExpiry: '', electricityNo: '',
    ration: false, rationNo: '',
  });

  /* ─── Upload state ─── */
  const [uploads, setUploads] = useState({ photo: null, signature: null });

  /* ─── Auto-fill customer name ─── */
  useEffect(() => {
    const full = [form.firstName, form.middleName, form.surname].filter(Boolean).join(' ');
    setForm(f => ({ ...f, customerName: full }));
  }, [form.firstName, form.middleName, form.surname]);

  /* ─── Auto-detect minor from birth date ─── */
  useEffect(() => {
    if (!form.birthDate) return;
    const age = Math.floor((new Date() - new Date(form.birthDate)) / (365.25 * 24 * 60 * 60 * 1000));
    setForm(f => ({ ...f, isMinor: age < 18 ? 'yes' : 'no' }));
  }, [form.birthDate]);

  /* ─── Sync aadhar to KYC ─── */
  useEffect(() => {
    if (form.aadharNo.length > 0) {
      setKyc(k => ({ ...k, aadharKyc: true, aadharKycNo: form.aadharNo }));
    }
  }, [form.aadharNo]);

  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setFv = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setK = (key) => (val) => setKyc(k => ({ ...k, [key]: val }));

  /* ─── Image processing ─── */
  function processImage(file, type) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const config = type === 'photo' ? { w: 413, h: 531 } : { w: 600, h: 200 };
        canvas.width = config.w; canvas.height = config.h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFF'; ctx.fillRect(0, 0, config.w, config.h);
        const sr = img.width / img.height;
        const tr = config.w / config.h;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (sr > tr) { sw = sh * tr; sx = (img.width - sw) / 2; }
        else { sh = sw / tr; sy = (img.height - sh) / 2; }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, config.w, config.h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setUploads(u => ({ ...u, [type]: dataUrl }));
        setErrors(er => { const c = { ...er }; delete c[type]; return c; });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* ─── Navigation ─── */
  function goNext() {
    const errs = validateTabFields(currentTab, form, kyc, uploads);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCompletedTabs(c => new Set([...c, currentTab]));
    if (currentTab < TABS.length) {
      const next = currentTab + 1;
      setEnabledTabs(e => new Set([...e, next]));
      setCurrentTab(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goPrev() {
    if (currentTab > 1) {
      setCurrentTab(t => t - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleTabClick(id) {
    if (enabledTabs.has(id)) setCurrentTab(id);
  }

  function handleSubmit() {
    const errs = validateTabFields(5, form, kyc, uploads);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitDone(true);
  }

  const progress = (currentTab / TABS.length) * 100;
  const isLastTab = currentTab === TABS.length;

  /* ═══════════ RENDER ═══════════ */
  return (
    <div className="ac-root">

      {/* Success Modal */}
      {submitDone && (
        <div className="ac-overlay" onClick={() => setSubmitDone(false)}>
          <div className="ac-modal" onClick={e => e.stopPropagation()}>
            <div className="ac-modal-icon">✓</div>
            <h3 className="ac-modal-title">Customer Saved Successfully!</h3>
            <p className="ac-modal-body">Customer has been added to the system.</p>
            <button className="ac-btn ac-btn--primary" onClick={() => setSubmitDone(false)}>OK</button>
          </div>
        </div>
      )}

      {/* ── Tab Navigation ── */}
      <div className="ac-tab-nav">
        <ul className="ac-tab-list">
          {TABS.map(tab => (
            <li key={tab.id} className="ac-tab-item">
              <button
                className={[
                  'ac-tab-btn',
                  currentTab === tab.id ? 'ac-tab-btn--active' : '',
                  completedTabs.has(tab.id) ? 'ac-tab-btn--completed' : '',
                  enabledTabs.has(tab.id) ? 'ac-tab-btn--enabled' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleTabClick(tab.id)}
                disabled={!enabledTabs.has(tab.id)}
              >
                <span className="ac-tab-num">
                  {completedTabs.has(tab.id) ? '✓' : tab.id}
                </span>
                <span className="ac-tab-label">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="ac-progress-bar-wrap">
          <div className="ac-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="ac-body">

        {/* ════ TAB 1: Customer Information ════ */}
        {currentTab === 1 && (
          <div className="ac-section-card">
            <div className="ac-section-header">
              <span className="ac-section-dot" />
              <span className="ac-section-title">Customer Information</span>
            </div>

            <div className="ac-grid ac-grid--4">
              <RadioGroup
                label="Is Individual"
                name="isIndividual"
                value={form.isIndividual}
                onChange={setFv('isIndividual')}
                options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              />
              <TextInput label="Aadhar No" required error={errors.aadharNo}
                value={form.aadharNo} maxLength={12}
                onChange={e => setForm(f => ({ ...f, aadharNo: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                placeholder="Enter 12-digit Aadhar" />
              <SelectInput label="Gender" required error={errors.gender}
                value={form.gender} onChange={setF('gender')}
                options={['Male', 'Female', 'Other']} />
              <SelectInput label="Salutation Code" required error={errors.salutationCode}
                value={form.salutationCode} onChange={setF('salutationCode')}
                options={['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'M/S']} />

              <TextInput label="First Name" required error={errors.firstName}
                value={form.firstName} onChange={setF('firstName')} placeholder="First name" />
              <TextInput label="Surname Name" required error={errors.surname}
                value={form.surname} onChange={setF('surname')} placeholder="Surname" />
              <TextInput label="Middle Name" required error={errors.middleName}
                value={form.middleName} onChange={setF('middleName')} placeholder="Middle name" />
              <TextInput label="Customer Name" required error={errors.customerName}
                value={form.customerName} onChange={setF('customerName')} placeholder="Auto-generated" />

              <TextInput label="Birth Date" required error={errors.birthDate}
                type="date" value={form.birthDate} onChange={setF('birthDate')} />
              <TextInput label="Registration Date" required error={errors.registrationDate}
                type="date" value={form.registrationDate} onChange={setF('registrationDate')} />
              <RadioGroup label="Is Minor" name="isMinor" value={form.isMinor}
                onChange={setFv('isMinor')}
                options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              <TextInput label="Guardian Name" error={errors.guardianName}
                value={form.guardianName} onChange={setF('guardianName')}
                disabled={form.isMinor !== 'yes'} placeholder="Guardian name" />

              <SelectInput label="Relation with Guardian" error={errors.relationGuardian}
                value={form.relationGuardian} onChange={setF('relationGuardian')}
                options={['Father', 'Mother', 'Spouse', 'Sibling', 'Other']} />
              <SelectInput label="Religion Code" required error={errors.religionCode}
                value={form.religionCode} onChange={setF('religionCode')}
                options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']} />
              <SelectInput label="Caste Code" required error={errors.casteCode}
                value={form.casteCode} onChange={setF('casteCode')}
                options={['General', 'OBC', 'SC', 'ST', 'Other']} />
              <SelectInput label="Category Code" required error={errors.categoryCode}
                value={form.categoryCode} onChange={setF('categoryCode')}
                options={['General', 'Minority', 'Senior Citizen', 'Staff', 'Other']} />

              <TextInput label="Sub Category Code"
                value={form.subCategoryCode} onChange={setF('subCategoryCode')} />
              <SelectInput label="Constitution Code" required error={errors.constitutionCode}
                value={form.constitutionCode} onChange={setF('constitutionCode')}
                options={['Individual', 'Proprietorship', 'Partnership', 'Company', 'Trust', 'Society', 'OTHER']} />
              <SelectInput label="Occupation Code" required error={errors.occupationCode}
                value={form.occupationCode} onChange={setF('occupationCode')}
                options={['Salaried', 'Business', 'Professional', 'Agriculture', 'Student', 'Retired', 'Other']} />
              <SelectInput label="Vehicle Owned"
                value={form.vehicleOwned} onChange={setF('vehicleOwned')}
                options={['NOT APPLICABLE', 'CAR', 'BIKE', 'BOTH']} />

              <SelectInput label="Member Type" required error={errors.memberType}
                value={form.memberType} onChange={setF('memberType')}
                options={['A', 'B', 'O']} />
              <TextInput label="Email ID" error={errors.email}
                type="email" value={form.email} onChange={setF('email')} placeholder="email@example.com" />
              <TextInput label="GSTIN No" error={errors.gstinNo}
                value={form.gstinNo} onChange={e => setForm(f => ({ ...f, gstinNo: e.target.value.toUpperCase() }))}
                placeholder="22AAAAA0000A1Z5" maxLength={15} />
              <TextInput label="Member Number"
                value={form.memberNumber} onChange={e => setForm(f => ({ ...f, memberNumber: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                maxLength={2} />

              <TextInput label="CKYC No"
                value={form.ckyNo} onChange={setF('ckyNo')} />
              <SelectInput label="Risk Category" required error={errors.riskCategory}
                value={form.riskCategory} onChange={setF('riskCategory')}
                options={['LOW', 'MEDIUM', 'HIGH']} />
            </div>
          </div>
        )}

        {/* ════ TAB 2: Personal Information ════ */}
        {currentTab === 2 && (
          <div className="ac-section-card">
            <div className="ac-section-header">
              <span className="ac-section-dot" />
              <span className="ac-section-title">Personal Information</span>
            </div>
            <div className="ac-grid ac-grid--3">
              <TextInput label="Mother Name" required error={errors.motherName}
                value={form.motherName} onChange={setF('motherName')} placeholder="Mother's full name" />
              <TextInput label="Father Name" required error={errors.fatherName}
                value={form.fatherName} onChange={setF('fatherName')} placeholder="Father's full name" />
              <RadioGroup label="Marital Status" name="maritalStatus" value={form.maritalStatus}
                onChange={setFv('maritalStatus')}
                options={[
                  { value: 'Married', label: 'Married' },
                  { value: 'Single', label: 'Single' },
                  { value: 'Other', label: 'Other' },
                ]} />
              <TextInput label="No. of Children" error={errors.children}
                type="number" min="0" value={form.children} onChange={setF('children')}
                disabled={form.maritalStatus === 'Single'} />
              <TextInput label="No. of Dependents" error={errors.dependents}
                type="number" min="0" value={form.dependents} onChange={setF('dependents')}
                disabled={form.maritalStatus === 'Single'} />
            </div>
          </div>
        )}

        {/* ════ TAB 3: Address Information ════ */}
        {currentTab === 3 && (
          <div className="ac-section-card">
            <div className="ac-section-header">
              <span className="ac-section-dot" />
              <span className="ac-section-title">Permanent / Address Information</span>
            </div>
            <div className="ac-grid ac-grid--3">
              <TextInput label="Nationality" value={form.nationality} readOnly />
              <SelectInput label="Residence Type" required error={errors.residenceType}
                value={form.residenceType} onChange={setF('residenceType')}
                options={['Owned', 'Rented', 'Leased', 'Company Provided', 'Other']} />
              <SelectInput label="Residence Status" required error={errors.residenceStatus}
                value={form.residenceStatus} onChange={setF('residenceStatus')}
                options={['Resident Indian', 'Non-Resident Indian', 'Foreign National']} />
              <TextInput label="Address 1" required error={errors.address1}
                value={form.address1} onChange={setF('address1')} placeholder="House / Flat No." />
              <TextInput label="Address 2" required error={errors.address2}
                value={form.address2} onChange={setF('address2')} placeholder="Street / Area" />
              <TextInput label="Address 3" required error={errors.address3}
                value={form.address3} onChange={setF('address3')} placeholder="Landmark" />
              <SelectInput label="Country" required error={errors.country}
                value={form.country} onChange={setF('country')}
                options={['INDIA', 'USA', 'UK', 'UAE', 'Other']} />
              <SelectInput label="State" required error={errors.state}
                value={form.state} onChange={setF('state')}
                options={['Karnataka', 'Maharashtra', 'Goa', 'Telangana', 'Tamil Nadu']} />
              <SelectInput label="City" required error={errors.city}
                value={form.city} onChange={setF('city')}
                options={['Gadag', 'Belgaum', 'Dharwad', 'Hubli', 'Bangalore', 'Mumbai', 'Pune']} />
              <TextInput label="ZIP" required error={errors.zip}
                value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                maxLength={6} placeholder="6-digit PIN" />
              <TextInput label="Mobile No" error={errors.mobileNo}
                value={form.mobileNo} onChange={e => setForm(f => ({ ...f, mobileNo: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                maxLength={10} placeholder="10-digit mobile" />
              <TextInput label="Residence Phone"
                value={form.residencePhone} onChange={setF('residencePhone')} placeholder="Landline" />
              <TextInput label="Office Phone"
                value={form.officePhone} onChange={setF('officePhone')} placeholder="Office landline" />
            </div>
          </div>
        )}

        {/* ════ TAB 4: KYC Documents ════ */}
        {currentTab === 4 && (
          <div className="ac-section-card">
            <div className="ac-section-header">
              <span className="ac-section-dot" />
              <span className="ac-section-title">KYC Document Details</span>
            </div>

            {errors.idProof && <div className="ac-kyc-error">⚠ {errors.idProof}</div>}
            {errors.addrProof && <div className="ac-kyc-error">⚠ {errors.addrProof}</div>}

            <div className="ac-kyc-grid">
              {/* ID Proof */}
              <div>
                <h4 className="ac-kyc-section-title">ID Proof</h4>
                <table className="ac-kyc-table">
                  <thead>
                    <tr>
                      <th>✔</th><th>Document</th><th>Expiry Date</th><th>Document No</th>
                    </tr>
                  </thead>
                  <tbody>
                    <KycRow checked={kyc.passport} onToggle={() => setK('passport')(!kyc.passport)}
                      label="Passport" hasExpiry expiry={kyc.passportExpiry}
                      onExpiry={setK('passportExpiry')} docNo={kyc.passportNo} onDocNo={setK('passportNo')} />
                    <KycRow checked={kyc.pan} onToggle={() => setK('pan')(!kyc.pan)}
                      label="PAN Card" hasExpiry={false}
                      docNo={kyc.panNo} onDocNo={setK('panNo')} />
                    <KycRow checked={kyc.voterid} onToggle={() => setK('voterid')(!kyc.voterid)}
                      label="Election Card" hasExpiry={false}
                      docNo={kyc.voteridNo} onDocNo={setK('voteridNo')} />
                    <KycRow checked={kyc.dl} onToggle={() => setK('dl')(!kyc.dl)}
                      label="Driving License" hasExpiry expiry={kyc.dlExpiry}
                      onExpiry={setK('dlExpiry')} docNo={kyc.dlNo} onDocNo={setK('dlNo')} />
                    <KycRow checked={kyc.aadharKyc} onToggle={() => {}}
                      label="Aadhar Card" hasExpiry={false}
                      docNo={kyc.aadharKycNo} onDocNo={setK('aadharKycNo')} />
                    <KycRow checked={kyc.nrega} onToggle={() => setK('nrega')(!kyc.nrega)}
                      label="NREGA Job Card" hasExpiry={false}
                      docNo={kyc.nregaNo} onDocNo={setK('nregaNo')} />
                  </tbody>
                </table>
              </div>

              {/* Address Proof */}
              <div>
                <h4 className="ac-kyc-section-title">Address Proof</h4>
                <table className="ac-kyc-table">
                  <thead>
                    <tr>
                      <th>✔</th><th>Document</th><th>Expiry Date</th><th>Document No</th>
                    </tr>
                  </thead>
                  <tbody>
                    <KycRow checked={kyc.telephone} onToggle={() => setK('telephone')(!kyc.telephone)}
                      label="Telephone Bill" hasExpiry expiry={kyc.telephoneExpiry}
                      onExpiry={setK('telephoneExpiry')} docNo={kyc.telephoneNo} onDocNo={setK('telephoneNo')} />
                    <KycRow checked={kyc.bank} onToggle={() => setK('bank')(!kyc.bank)}
                      label="Bank Statement" hasExpiry expiry={kyc.bankExpiry}
                      onExpiry={setK('bankExpiry')} docNo={kyc.bankNo} onDocNo={setK('bankNo')} />
                    <KycRow checked={kyc.govt} onToggle={() => setK('govt')(!kyc.govt)}
                      label="Govt. Documents" hasExpiry expiry={kyc.govtExpiry}
                      onExpiry={setK('govtExpiry')} docNo={kyc.govtNo} onDocNo={setK('govtNo')} />
                    <KycRow checked={kyc.electricity} onToggle={() => setK('electricity')(!kyc.electricity)}
                      label="Electricity Bill" hasExpiry expiry={kyc.electricityExpiry}
                      onExpiry={setK('electricityExpiry')} docNo={kyc.electricityNo} onDocNo={setK('electricityNo')} />
                    <KycRow checked={kyc.ration} onToggle={() => setK('ration')(!kyc.ration)}
                      label="Ration Card" hasExpiry={false}
                      docNo={kyc.rationNo} onDocNo={setK('rationNo')} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB 5: Photo & Signature ════ */}
        {currentTab === 5 && (
          <div className="ac-section-card">
            <div className="ac-section-header">
              <span className="ac-section-dot" />
              <span className="ac-section-title">Photo & Signature Upload</span>
            </div>
            <div className="ac-upload-grid">
              <UploadCard
                label="Upload Photo"
                preview={uploads.photo}
                error={errors.photo}
                onFile={f => processImage(f, 'photo')}
                onCamera={() => alert('Camera not supported in this demo')}
              />
              <UploadCard
                label="Upload Signature"
                preview={uploads.signature}
                error={errors.signature}
                onFile={f => processImage(f, 'signature')}
                onCamera={() => alert('Camera not supported in this demo')}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="ac-nav-btns">
        <button
          type="button"
          className="ac-btn ac-btn--ghost"
          onClick={goPrev}
          disabled={currentTab === 1}
        >
          ← Previous
        </button>
        <span className="ac-step-label">Step {currentTab} of {TABS.length}</span>
        {!isLastTab ? (
          <button type="button" className="ac-btn ac-btn--primary" onClick={goNext}>
            Next →
          </button>
        ) : (
          <div className="ac-last-btns">
            <button type="button" className="ac-btn ac-btn--ghost"
              onClick={() => { setForm(f => ({ ...f })); setUploads({ photo: null, signature: null }); }}>
              Reset
            </button>
            <button type="button" className="ac-btn ac-btn--primary" onClick={handleSubmit}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
