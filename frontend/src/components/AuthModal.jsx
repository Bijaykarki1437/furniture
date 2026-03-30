// components/AuthModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import VerificationModal from './VerificationModal';

function AuthModal() {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, signup, login, refreshUser } = useAuth(); // Add refreshUser
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (authMode === 'signup') {
      if (!formData.name) newErrors.name = 'Name is required';
      else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (authMode === 'signup') {
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send verification code
  const sendVerificationCode = async (email) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch (err) {
      return { success: false, message: 'Failed to send verification code' };
    }
  };

  // Handle signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const result = await sendVerificationCode(formData.email);
    
    if (result.success) {
      setPendingUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setShowVerification(true);
      setMessage({ type: 'success', text: 'Verification code sent to your email!' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setLoading(false);
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      
      setTimeout(() => {
        setShowAuthModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setLoading(false);
  };

  // Handle verification
  const handleVerifyCode = async (code) => {
    try {
      // Verify the code
      const verifyRes = await fetch('http://localhost:5000/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingUser.email, code })
      });
      
      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok) {
        return { success: false, message: verifyData.message };
      }
      
      // Complete signup
      const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...pendingUser, 
          verified: true 
        })
      });
      
      const signupData = await signupRes.json();
      
      if (!signupRes.ok) {
        return { success: false, message: signupData.message };
      }
      
      // Store token and user
      localStorage.setItem('token', signupData.token);
      localStorage.setItem('user', JSON.stringify(signupData.user));
      
      // 🔥 CRITICAL FIX: Force refresh user in context
      await refreshUser(); // This will reload user data from backend
      
      // Also trigger storage event for any other listeners
      window.dispatchEvent(new Event('storage'));
      
      setShowVerification(false);
      setShowAuthModal(false);
      setMessage({ type: 'success', text: 'Account created successfully!' });
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      return { success: true };
      
    } catch (err) {
      console.error('Verification error:', err);
      return { success: false, message: 'Verification failed. Please try again.' };
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingUser.email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Failed to resend code' };
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setMessage({ type: '', text: '' });
    setShowVerification(false);
    setPendingUser(null);
  };

  return (
    <>
      <div className="auth-overlay" onClick={() => setShowAuthModal(false)}>
        <div className="auth-modal" onClick={e => e.stopPropagation()}>
          <button className="auth-close" onClick={() => setShowAuthModal(false)}>×</button>
          
          <div className="auth-header">
            <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {authMode === 'login' 
                ? 'Sign in to continue to your account' 
                : 'Join us to start shopping'}
            </p>
          </div>

          {message.text && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="auth-form">
            {authMode === 'signup' && (
              <div className="auth-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ram Bahadur Gurung"
                  className={errors.name ? 'error' : ''}
                  disabled={loading}
                />
                {errors.name && <span className="auth-error">{errors.name}</span>}
              </div>
            )}

            <div className="auth-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            {authMode === 'signup' && (
              <div className="auth-form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
              </div>
            )}

            {authMode === 'login' && (
              <div className="auth-forgot">
                <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
              </div>
            )}

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                authMode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} className="auth-toggle-btn" disabled={loading}>
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="auth-social">
            <button className="social-btn google" disabled={loading}>
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Google
            </button>
            <button className="social-btn facebook" disabled={loading}>
              <span>f</span>
              Facebook
            </button>
          </div>

          <p className="auth-terms">
            By continuing, you agree to our 
            <a href="#"> Terms of Service </a> 
            and <a href="#"> Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <VerificationModal
          email={pendingUser?.email}
          onVerify={handleVerifyCode}
          onClose={() => {
            setShowVerification(false);
            setPendingUser(null);
          }}
          onResend={handleResendCode}
        />
      )}
    </>
  );
}

export default AuthModal;