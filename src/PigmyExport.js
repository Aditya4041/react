import React, { useState } from 'react';
import './pages.css';

const pigmyExportCSS = `
  .pigmy-export-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .pigmy-export-fieldset {
    background-color: white;
    border: 2px solid #BBADED;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
  }

  .pigmy-export-legend {
    font-size: 15px;
    font-weight: bold;
    padding: 0 8px;
    color: #3D316F;
    display: block;
    margin-bottom: 12px;
  }

  .pigmy-export-form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 12px;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .pigmy-export-form-group {
    flex: 1;
    min-width: 150px;
  }

  .pigmy-export-label {
    font-weight: bold;
    font-size: 12px;
    color: #3D316F;
    margin-bottom: 5px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .pigmy-export-input {
    width: 100%;
    padding: 8px 10px;
    border: 2px solid #C8B7F6;
    border-radius: 6px;
    background-color: #F4EDFF;
    outline: none;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
  }

  .pigmy-export-input:focus {
    border-color: #8066E8;
  }

  .pigmy-export-input:read-only {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #666;
  }

  .pigmy-export-input-box {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pigmy-export-icon-btn {
    background-color: #2D2B80;
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .pigmy-export-icon-btn:hover {
    background-color: #3D316F;
  }

  .pigmy-export-message-box {
    margin-top: 12px;
    padding: 10px;
    border-radius: 6px;
    border: 2px solid;
    min-height: 45px;
    font-size: 13px;
    display: none;
  }

  .pigmy-export-message-box.show {
    display: block;
  }

  .pigmy-export-message-box.success {
    background: #f0fdf4;
    border-color: #86efac;
    color: #166534;
  }

  .pigmy-export-message-box.error {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #991b1b;
  }

  .pigmy-export-message-box.info {
    background: #eff6ff;
    border-color: #93c5fd;
    color: #1e40af;
  }

  .pigmy-export-button-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }

  .pigmy-export-btn {
    padding: 10px 22px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    transition: all 0.3s ease;
  }

  .pigmy-export-btn-primary {
    background: linear-gradient(135deg, #4a9eff 0%, #3d85d9 100%);
    color: white;
  }

  .pigmy-export-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(74, 158, 255, 0.4);
  }

  .pigmy-export-btn-validate {
    background: #2b0d73;
    color: white;
  }

  .pigmy-export-btn-validate:hover {
    background: #1a0548;
    transform: translateY(-1px);
  }

  .pigmy-export-btn-cancel {
    background: #dc2626;
    color: white;
  }

  .pigmy-export-btn-cancel:hover {
    background: #b91c1c;
  }
`;

export default function PigmyExport({ onBack }) {
  const [branchCode, setBranchCode] = useState('0001');
  const [branchName, setBranchName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  
  const [message, setMessage] = useState('Please fill in the required details and click Validate');
  const [messageType, setMessageType] = useState('info');
  const [showMessage, setShowMessage] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  const showToast = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
  };

  const validateExport = () => {
    const branchCodeTrim = branchCode.trim();
    const productCodeTrim = productCode.trim();

    if (!branchCodeTrim) {
      showToast('Please enter Branch Code', 'error');
      return;
    }

    if (!productCodeTrim) {
      showToast('Please enter Product Code', 'error');
      return;
    }

    showToast('Validating export parameters...', 'info');

    setTimeout(() => {
      setBranchName('Main Branch - Gadag');
      setProductDescription('Pigmy Collection');
      showToast('Validation successful! Ready to export.', 'success');
      setIsValidated(true);
    }, 1000);
  };

  const exportToClient = () => {
    if (!branchCode.trim() || !productCode.trim()) {
      showToast('Please validate the form before exporting', 'error');
      return;
    }

    showToast('Generating export file...', 'info');

    setTimeout(() => {
      // Create sample CSV content
      const csvContent =
        'Account Code,Customer Name,Agent ID,Collection Date,Amount\n' +
        '000200010001,Test Customer 1,AG001,30/01/2026,500.00\n' +
        '000200010002,Test Customer 2,AG001,30/01/2026,750.00\n' +
        '000200010003,Test Customer 3,AG001,30/01/2026,1000.00\n' +
        '000200010004,Test Customer 4,AG001,30/01/2026,600.00\n' +
        '000200010005,Test Customer 5,AG001,30/01/2026,800.00';

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `pigmy_export_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Export file downloaded successfully!', 'success');
    }, 1500);
  };

  const cancelExport = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      setBranchCode('0001');
      setBranchName('');
      setProductCode('');
      setProductDescription('');
      setAgentId('');
      setAgentName('');
      setMessage('Please fill in the required details and click Validate');
      setMessageType('info');
      setIsValidated(false);
    }
  };

  return (
    <div className="pf-root">
      <div className="pf-topbar">
        <span className="pf-tb-icon">📤</span>
        <span className="pf-tb-title">Transaction Export</span>
        <span className="pf-tb-badge">Module</span>
      </div>

      <style>{pigmyExportCSS}</style>

      <div className="pf-body pigmy-export-container">
        {showMessage && (
          <div className={`pigmy-export-message-box show ${messageType}`}>
            <strong>Message:</strong> {message}
          </div>
        )}

        <div className="pigmy-export-fieldset">
          <span className="pigmy-export-legend">Transaction Details</span>

          {/* Row 1: Branch Code, Branch Name, Product Code, Product Description */}
          <div className="pigmy-export-form-row">
            <div className="pigmy-export-form-group">
              <label className="pigmy-export-label">Branch Code</label>
              <div className="pigmy-export-input-box">
                <input
                  type="text"
                  className="pigmy-export-input"
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  maxLength={4}
                />
                <button className="pigmy-export-icon-btn">…</button>
              </div>
            </div>

            <div className="pigmy-export-form-group">
              <label className="pigmy-export-label">Branch Name</label>
              <input
                type="text"
                className="pigmy-export-input"
                value={branchName}
                readOnly
              />
            </div>

            <div className="pigmy-export-form-group">
              <label className="pigmy-export-label">Product Code</label>
              <div className="pigmy-export-input-box">
                <input
                  type="text"
                  className="pigmy-export-input"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  maxLength={3}
                />
                <button className="pigmy-export-icon-btn">…</button>
              </div>
            </div>

            <div className="pigmy-export-form-group">
              <label className="pigmy-export-label">Description</label>
              <input
                type="text"
                className="pigmy-export-input"
                value={productDescription}
                readOnly
              />
            </div>
          </div>

          {/* Row 2: Agent ID, Agent Name */}
          <div className="pigmy-export-form-row">
            <div className="pigmy-export-form-group">
              <label className="pigmy-export-label">Agent ID</label>
              <div className="pigmy-export-input-box">
                <input
                  type="text"
                  className="pigmy-export-input"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                />
                <button className="pigmy-export-icon-btn">…</button>
              </div>
            </div>

            <div className="pigmy-export-form-group">
              <label className="pigmy-export-label">Agent Name</label>
              <input
                type="text"
                className="pigmy-export-input"
                value={agentName}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pigmy-export-button-row">
          <button className="pigmy-export-btn pigmy-export-btn-validate" onClick={validateExport}>
            ✓ Validate
          </button>
          <button
            className="pigmy-export-btn pigmy-export-btn-primary"
            onClick={exportToClient}
            disabled={!isValidated}
            style={{ opacity: !isValidated ? 0.5 : 1 }}
          >
            📥 Client_Export
          </button>
          <button className="pigmy-export-btn pigmy-export-btn-cancel" onClick={cancelExport}>
            Cancel
          </button>
          <button className="pigmy-export-btn pigmy-export-btn-cancel" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
