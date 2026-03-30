// components/VerificationModal.jsx
import React, { useState, useEffect } from 'react';
import './VerificationModal.css';

function VerificationModal({ email, onVerify, onClose, onResend }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await onVerify(verificationCode);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    
    const result = await onResend();
    
    if (result.success) {
      setTimer(600);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-input-0')?.focus();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="verification-overlay">
      <div className="verification-modal">
        <button className="verification-close" onClick={onClose}>×</button>
        
        <div className="verification-icon">📧</div>
        <h2>Verify Your Email</h2>
        <p>We've sent a verification code to</p>
        <p className="verification-email">{email}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          {error && <div className="verification-error">{error}</div>}
          
          <div className="verification-timer">
            {!canResend ? (
              <span>Code expires in: <strong>{formatTime(timer)}</strong></span>
            ) : (
              <button 
                type="button" 
                onClick={handleResend}
                className="resend-btn"
                disabled={loading}
              >
                Resend Code
              </button>
            )}
          </div>
          
          <button 
            type="submit" 
            className="verify-submit-btn"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Sign Up'}
          </button>
        </form>
        
        <div className="verification-help">
          <p>Didn't receive the code? Check your spam folder</p>
        </div>
      </div>
    </div>
  );
}

export default VerificationModal;