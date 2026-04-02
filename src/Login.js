import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    branch: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const branches = [
    { code: '', name: '— Select Branch —' },
    { code: '0001', name: '0001 — Main Branch - Gadag' },
    { code: '0002', name: '0002 — Branch 2 - Belgaum' },
    { code: '0003', name: '0003 — Branch 3 - Dharwad' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.branch) {
      newErrors.branch = 'Please select a branch';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempted with:', formData);
      alert(`Welcome, ${formData.username}!`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section - Illustration */}
        <div className="login-left">
          <div className="logo-section">
            <img 
              src="/images/IDSSPL_LOGO.png" 
              alt="IDSSPL Logo" 
              className="idsspl-logo"
            />
            <p className="company-name">IDSSPL TECHNOLOGIES PVT LTD</p>
          </div>

          <div className="illustration">
            <img 
              src="/images/online-banking.png" 
              alt="Online Banking Illustration" 
              className="illustration-image"
            />
          </div>

          <p className="version-text">
            <span className="dot">●</span> Core Banking Solution V3.1
          </p>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-right">
          <div className="form-header">
            <span className="back-link">Back Again !</span>
            <h1 className="bank-name">THE AZAD CO-OP BANK LTD,<br />GADAG</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Branch Dropdown */}
            <div className="form-group">
              <label htmlFor="branch" className="form-label">Branch</label>
              <div className="input-wrapper">
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className={`form-input select-input ${errors.branch ? 'error' : ''}`}
                >
                  {branches.map((branch, index) => (
                    <option key={index} value={branch.code}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {errors.branch && <span className="error-text">{errors.branch}</span>}
            </div>

            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">User Name</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                />
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
                {formData.password ? (
                  <svg 
                    className="eye-toggle"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    )}
                  </svg>
                ) : (
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                )}
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {/* Forgot Password Link */}
            <div className="password-help">
              <a href="#!" className="forgot-password">Forgot Password?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer Note */}
          <p className="login-footer">
            Secure online banking powered by IDSSPL
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;