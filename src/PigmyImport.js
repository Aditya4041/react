import React, { useState, useRef } from 'react';
import './pages.css';

const pigmyImportCSS = `
  .pigmy-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .pigmy-fieldset {
    background-color: white;
    border: 2px solid #BBADED;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
  }

  .pigmy-legend {
    font-size: 15px;
    font-weight: bold;
    padding: 0 8px;
    color: #3D316F;
    display: block;
    margin-bottom: 12px;
  }

  .pigmy-form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 12px;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .pigmy-form-group {
    flex: 1;
    min-width: 150px;
  }

  .pigmy-label {
    font-weight: bold;
    font-size: 12px;
    color: #3D316F;
    margin-bottom: 5px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .pigmy-input {
    width: 100%;
    padding: 8px 10px;
    border: 2px solid #C8B7F6;
    border-radius: 6px;
    background-color: #F4EDFF;
    outline: none;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
  }

  .pigmy-input:focus {
    border-color: #8066E8;
  }

  .pigmy-input:read-only {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .pigmy-select {
    width: 100%;
    padding: 8px 10px;
    border: 2px solid #C8B7F6;
    border-radius: 6px;
    background-color: #F4EDFF;
    outline: none;
    font-size: 13px;
    cursor: pointer;
    color: #3D316F;
    font-weight: 600;
  }

  .pigmy-select:focus {
    border-color: #8066E8;
  }

  .pigmy-icon-btn {
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

  .pigmy-icon-btn:hover {
    background-color: #3D316F;
  }

  .pigmy-input-box {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pigmy-message-box {
    margin-top: 12px;
    padding: 10px;
    border-radius: 6px;
    border: 2px solid;
    min-height: 45px;
    font-size: 13px;
    display: none;
  }

  .pigmy-message-box.show {
    display: block;
  }

  .pigmy-message-box.success {
    background: #f0fdf4;
    border-color: #86efac;
    color: #166534;
  }

  .pigmy-message-box.error {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #991b1b;
  }

  .pigmy-message-box.info {
    background: #eff6ff;
    border-color: #93c5fd;
    color: #1e40af;
  }

  .pigmy-column-tools {
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f4f9 100%);
    border: 2px solid #93c5fd;
    margin-top: 12px;
    display: none;
  }

  .pigmy-column-tools.show {
    display: block;
  }

  .pigmy-column-row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .pigmy-column-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 600;
    margin-right: 6px;
    margin-bottom: 6px;
  }

  .pigmy-column-tag .remove-btn {
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    transition: all 0.2s;
  }

  .pigmy-column-tag .remove-btn:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .pigmy-table-wrap {
    overflow-x: auto;
  }

  .pigmy-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .pigmy-table thead {
    background: #373279;
    color: white;
  }

  .pigmy-table th,
  .pigmy-table td {
    padding: 6px 8px;
    border: 1px solid #ddd;
    text-align: left;
  }

  .pigmy-table tbody tr:nth-child(even) {
    background: #f9f9f9;
  }

  .pigmy-table th.customized-column {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .pigmy-table td.customized-column {
    background: #f0f4ff !important;
    font-weight: 600;
    color: #1e40af;
  }

  .pigmy-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 12px 0;
    padding: 10px;
  }

  .pigmy-pagination-btn {
    background: #2b0d73;
    color: white;
    padding: 6px 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    transition: background 0.3s;
  }

  .pigmy-pagination-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .pigmy-pagination-btn:hover:not(:disabled) {
    background: #1a0548;
  }

  .pigmy-page-info {
    font-size: 13px;
    color: #2b0d73;
    font-weight: bold;
    padding: 0 12px;
  }

  .pigmy-radio-group {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .pigmy-radio-label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 13px;
    padding: 6px 12px;
    border: 2px solid #C8B7F6;
    border-radius: 6px;
    transition: all 0.3s ease;
    background: #F4EDFF;
    color: #3D316F;
    user-select: none;
  }

  .pigmy-radio-label:hover {
    border-color: #8066E8;
    background: #E8DCFF;
  }

  .pigmy-radio-label input[type="radio"] {
    cursor: pointer;
    accent-color: #8066E8;
  }

  .pigmy-btn {
    padding: 8px 18px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    transition: all 0.3s ease;
    margin: 4px;
  }

  .pigmy-btn-primary {
    background: linear-gradient(135deg, #4a9eff 0%, #3d85d9 100%);
    color: white;
  }

  .pigmy-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(74, 158, 255, 0.4);
  }

  .pigmy-btn-secondary {
    background: #f59e0b;
    color: white;
  }

  .pigmy-btn-secondary:hover {
    background: #d97706;
  }

  .pigmy-btn-cancel {
    background: #dc2626;
    color: white;
  }

  .pigmy-btn-cancel:hover {
    background: #b91c1c;
  }

  .pigmy-button-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }

  input[type="file"] {
    padding: 6px;
  }

  input[type="file"]::file-selector-button {
    background: #2D2B80;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 8px;
    font-size: 12px;
  }

  input[type="file"]::file-selector-button:hover {
    background: #1a0548;
  }
`;

export default function PigmyImport({ onBack }) {
  const [currentView, setCurrentView] = useState('form'); // 'form' or 'data'
  const [importFrom, setImportFrom] = useState('Client');
  const [transactionType, setTransactionType] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productDescription, setProductDescription] = useState('');
  
  const [originalParsedData, setOriginalParsedData] = useState([]);
  const [currentDisplayData, setCurrentDisplayData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [totalColumns, setTotalColumns] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomizationApplied, setIsCustomizationApplied] = useState(false);
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showMessage, setShowMessage] = useState(false);
  
  const [displayMode, setDisplayMode] = useState('full');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [lastChars, setLastChars] = useState('');
  const [firstChars, setFirstChars] = useState('');
  
  const [firstLineData, setFirstLineData] = useState(null);
  const fileInputRef = useRef(null);

  const RECORDS_PER_PAGE = 15;
  const TRANSACTION_TYPES = [
    { id: 1, desc: 'Pigmy Collection' },
    { id: 2, desc: 'Pigmy Settlement' },
    { id: 3, desc: 'Agent Commission' },
  ];

  const showToast = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4200);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    showToast(`File selected: ${fileName}. Reading file...`, 'info');

    const reader = new FileReader();
    reader.onload = (event) => {
      parseFile(event.target.result, fileName);
    };
    reader.readAsText(file);
  };

  const parseFile = (content, fileName) => {
    try {
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        showToast('File is empty', 'error');
        return;
      }

      const isDatFile = fileName.toLowerCase().endsWith('.dat');
      let dataLines = lines;
      let firstLine = null;

      if (isDatFile && lines.length > 0) {
        firstLine = lines[0].split(',').map(cell => cell.trim());
        dataLines = lines.slice(1);
        setFirstLineData(firstLine);
        showToast('DAT file detected. First line separated and displayed above.', 'info');
      } else {
        setFirstLineData(null);
      }

      if (dataLines.length === 0) {
        showToast('No data found in file', 'error');
        return;
      }

      const parsedData = dataLines.map(line =>
        line.split(',').map(cell => cell.trim())
      );

      if (parsedData.length === 0) {
        showToast('No data rows found in file', 'error');
        return;
      }

      const maxColumns = Math.max(...parsedData.map(row => row.length));
      setOriginalParsedData(parsedData);
      setCurrentDisplayData(parsedData);
      setTotalColumns(maxColumns);
      setCurrentPage(1);
      setIsCustomizationApplied(false);
      setSelectedColumns([]);

      showToast(
        `File loaded successfully! ${parsedData.length} records found with ${maxColumns} columns.`,
        'success'
      );
      setCurrentView('data');
    } catch (error) {
      showToast(`Error parsing file: ${error.message}`, 'error');
    }
  };

  const addSelectedColumn = () => {
    if (!selectedColumn) {
      showToast('Please select a column', 'error');
      return;
    }

    const columnNum = parseInt(selectedColumn);
    if (selectedColumns.find(col => col.columnNumber === columnNum)) {
      showToast(`Column ${columnNum} is already selected`, 'error');
      return;
    }

    let substringLength = null;
    let extractPosition = null;
    let label = `Column ${columnNum}`;

    if (displayMode === 'last') {
      const chars = parseInt(lastChars);
      if (!chars || chars < 1) {
        showToast('Please enter number of characters to extract', 'error');
        return;
      }
      substringLength = chars;
      extractPosition = 'end';
      label += ` (Last ${chars})`;
    } else if (displayMode === 'first') {
      const chars = parseInt(firstChars);
      if (!chars || chars < 1) {
        showToast('Please enter number of characters to extract', 'error');
        return;
      }
      substringLength = chars;
      extractPosition = 'start';
      label += ` (First ${chars})`;
    }

    const newColumn = {
      columnNumber: columnNum,
      substringLength,
      extractPosition,
      label,
    };

    setSelectedColumns([...selectedColumns, newColumn]);
    setSelectedColumn('');
    setDisplayMode('full');
    setLastChars('');
    setFirstChars('');
    showToast('Column added successfully! Click "Apply Customization" to see changes.', 'success');
  };

  const removeColumn = (index) => {
    setSelectedColumns(selectedColumns.filter((_, i) => i !== index));
  };

  const applyColumnFilter = () => {
    if (selectedColumns.length === 0) {
      showToast('Please select at least one column', 'error');
      return;
    }

    const customizationMap = {};
    selectedColumns.forEach(colConfig => {
      customizationMap[colConfig.columnNumber] = colConfig;
    });

    const transformedData = originalParsedData.map(row =>
      row.map((cellValue, index) => {
        const columnNumber = index + 1;
        if (customizationMap[columnNumber]) {
          const colConfig = customizationMap[columnNumber];
          let value = cellValue || '';

          if (colConfig.substringLength) {
            if (colConfig.extractPosition === 'end') {
              value = value.slice(-colConfig.substringLength);
            } else {
              value = value.slice(0, colConfig.substringLength);
            }
          }
          return value;
        }
        return cellValue || '';
      })
    );

    setCurrentDisplayData(transformedData);
    setCurrentPage(1);
    setIsCustomizationApplied(true);
    showToast(
      `Applied customizations to ${selectedColumns.length} column(s). Showing all ${totalColumns} columns.`,
      'success'
    );
  };

  const resetColumnFilter = () => {
    setSelectedColumns([]);
    setCurrentDisplayData(originalParsedData);
    setCurrentPage(1);
    setIsCustomizationApplied(false);
    showToast(`Showing all columns with original data (${totalColumns} columns)`, 'info');
  };

  const displayTableData = () => {
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    const end = Math.min(start + RECORDS_PER_PAGE, currentDisplayData.length);
    const dataToDisplay = currentDisplayData.slice(start, end);

    const customizedColumnNumbers = selectedColumns.map(col => col.columnNumber);

    return {
      headers: Array.from({ length: totalColumns }, (_, i) => ({
        num: i + 1,
        isCustomized: customizedColumnNumbers.includes(i + 1),
      })),
      rows: dataToDisplay,
      start,
      end,
      total: currentDisplayData.length,
    };
  };

  const totalPages = Math.ceil(currentDisplayData.length / RECORDS_PER_PAGE);

  if (currentView === 'data') {
    const tableData = displayTableData();

    return (
      <div className="pf-root">
        <div className="pf-topbar">
          <span className="pf-tb-icon">📁</span>
          <span className="pf-tb-title">Transaction Import</span>
          <span className="pf-tb-badge">Module</span>
        </div>

        <style>{pigmyImportCSS}</style>

        <div className="pf-body pigmy-container">
          {showMessage && (
            <div className={`pigmy-message-box show ${messageType}`}>
              <strong>Message:</strong> {message}
            </div>
          )}

          {/* Column Customization Section */}
          {totalColumns > 0 && (
            <div className="pigmy-fieldset pigmy-column-tools show">
              <span className="pigmy-legend">📊 Customize Columns</span>

              <div className="pigmy-column-row">
                <div className="pigmy-form-group" style={{ flex: 1, minWidth: 180 }}>
                  <label className="pigmy-label">Column</label>
                  <select
                    className="pigmy-select"
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                  >
                    <option value="">-- Select Column --</option>
                    {Array.from({ length: totalColumns }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Column {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pigmy-form-group" style={{ flex: 2, minWidth: 280 }}>
                  <label className="pigmy-label">Display</label>
                  <div className="pigmy-radio-group">
                    <label className="pigmy-radio-label">
                      <input
                        type="radio"
                        name="displayMode"
                        value="full"
                        checked={displayMode === 'full'}
                        onChange={(e) => setDisplayMode(e.target.value)}
                      />
                      Full Column
                    </label>
                    <label className="pigmy-radio-label">
                      <input
                        type="radio"
                        name="displayMode"
                        value="last"
                        checked={displayMode === 'last'}
                        onChange={(e) => setDisplayMode(e.target.value)}
                      />
                      Last
                    </label>
                    {displayMode === 'last' && (
                      <input
                        type="number"
                        placeholder="4"
                        min="1"
                        max="50"
                        value={lastChars}
                        onChange={(e) => setLastChars(e.target.value)}
                        className="pigmy-input"
                        style={{ width: 60, padding: 6 }}
                      />
                    )}
                    <label className="pigmy-radio-label">
                      <input
                        type="radio"
                        name="displayMode"
                        value="first"
                        checked={displayMode === 'first'}
                        onChange={(e) => setDisplayMode(e.target.value)}
                      />
                      First
                    </label>
                    {displayMode === 'first' && (
                      <input
                        type="number"
                        placeholder="4"
                        min="1"
                        max="50"
                        value={firstChars}
                        onChange={(e) => setFirstChars(e.target.value)}
                        className="pigmy-input"
                        style={{ width: 60, padding: 6 }}
                      />
                    )}
                    <span style={{ color: '#666', fontSize: 11 }}>chars</span>
                  </div>
                </div>

                <button className="pigmy-btn pigmy-btn-primary" onClick={addSelectedColumn}>
                  ➕ Add
                </button>
              </div>

              {selectedColumns.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <label className="pigmy-label">Selected Columns:</label>
                  <div style={{ marginBottom: 10 }}>
                    {selectedColumns.map((col, idx) => (
                      <span key={idx} className="pigmy-column-tag">
                        {col.label}
                        <button
                          className="remove-btn"
                          onClick={() => removeColumn(idx)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="pigmy-button-row">
                    <button className="pigmy-btn pigmy-btn-primary" onClick={applyColumnFilter}>
                      ✓ Apply Customization
                    </button>
                    <button
                      className="pigmy-btn pigmy-btn-secondary"
                      onClick={resetColumnFilter}
                    >
                      ↺ Reset to Original
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* First Line Data Table (for DAT files) */}
          {firstLineData && (
            <div className="pigmy-fieldset">
              <span className="pigmy-legend">FIRST LINE DATA (Metadata)</span>
              <div className="pigmy-table-wrap">
                <table className="pigmy-table">
                  <thead>
                    <tr>
                      {firstLineData.map((_, idx) => (
                        <th key={idx}>Column {idx + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {firstLineData.map((value, idx) => (
                        <td key={idx}>{value}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="pigmy-fieldset">
            <span className="pigmy-legend">TEXT DATA</span>
            <div className="pigmy-table-wrap">
              <table className="pigmy-table">
                <thead>
                  <tr>
                    {tableData.headers.map((header) => (
                      <th
                        key={header.num}
                        className={header.isCustomized ? 'customized-column' : ''}
                      >
                        Column {header.num}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} style={{ background: rowIdx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      {row.map((cell, cellIdx) => {
                        const columnNumber = cellIdx + 1;
                        const isCustomized = selectedColumns.some(
                          col => col.columnNumber === columnNumber
                        );
                        return (
                          <td
                            key={cellIdx}
                            className={isCustomized ? 'customized-column' : ''}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {currentDisplayData.length > 0 && (
              <div className="pigmy-pagination">
                <button
                  className="pigmy-pagination-btn"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  ← Previous
                </button>
                <span className="pigmy-page-info">
                  Page {currentPage} of {totalPages} ({currentDisplayData.length} records)
                </span>
                <button
                  className="pigmy-pagination-btn"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pigmy-button-row">
            <button className="pigmy-btn pigmy-btn-primary">📥 Import</button>
            <button
              className="pigmy-btn pigmy-btn-cancel"
              onClick={() => {
                setCurrentView('form');
                setOriginalParsedData([]);
                setCurrentDisplayData([]);
                setSelectedColumns([]);
                setFirstLineData(null);
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div className="pf-root">
      <div className="pf-topbar">
        <span className="pf-tb-icon">📁</span>
        <span className="pf-tb-title">New Transaction Import</span>
        <span className="pf-tb-badge">Module</span>
      </div>

      <style>{pigmyImportCSS}</style>

      <div className="pf-body pigmy-container">
        {showMessage && (
          <div className={`pigmy-message-box show ${messageType}`}>
            <strong>Message:</strong> {message}
          </div>
        )}

        <div className="pigmy-fieldset">
          <span className="pigmy-legend">Transaction Details</span>

          <div className="pigmy-form-row">
            <div className="pigmy-form-group">
              <label className="pigmy-label">Import From</label>
              <div className="pigmy-radio-group">
                <label className="pigmy-radio-label">
                  <input
                    type="radio"
                    name="importFrom"
                    value="Client"
                    checked={importFrom === 'Client'}
                    onChange={(e) => setImportFrom(e.target.value)}
                  />
                  Client
                </label>
                <label className="pigmy-radio-label">
                  <input
                    type="radio"
                    name="importFrom"
                    value="Server"
                    checked={importFrom === 'Server'}
                    onChange={(e) => setImportFrom(e.target.value)}
                  />
                  Server
                </label>
              </div>
            </div>

            <div className="pigmy-form-group">
              <label className="pigmy-label">Transaction Type</label>
              <select
                className="pigmy-select"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="">-- Select Transaction Type --</option>
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.desc}
                  </option>
                ))}
              </select>
            </div>

            <div className="pigmy-form-group">
              <label className="pigmy-label">Product Code</label>
              <div className="pigmy-input-box">
                <input
                  type="text"
                  className="pigmy-input"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  maxLength={3}
                />
                <button className="pigmy-icon-btn">…</button>
              </div>
            </div>

            <div className="pigmy-form-group">
              <label className="pigmy-label">Description</label>
              <input
                type="text"
                className="pigmy-input"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="pigmy-form-row">
            <div className="pigmy-form-group">
              <button
                className="pigmy-btn pigmy-btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                📤 Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.dat,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="pigmy-button-row">
          <button className="pigmy-btn pigmy-btn-cancel" onClick={onBack}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
