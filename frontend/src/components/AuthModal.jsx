// components/AuthModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthModal() {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, signup, login, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

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

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage({ type: '', text: '' });

  if (!validateForm()) return;

  let result;

  if (authMode === 'signup') {
    result = await signup(formData.name, formData.email, formData.password);
  } else {
    result = await login(formData.email, formData.password);
  }

  if (result.success) {
    setMessage({ type: 'success', text: result.message });

    setTimeout(() => {
      setShowAuthModal(false);

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // 🔥 Go to Home
      window.scrollTo({ top: 0, behavior: "smooth" });

    }, 1000);

  } else {
    setMessage({ type: 'error', text: result.message });
  }
};

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
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

        <form onSubmit={handleSubmit} className="auth-form">
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
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
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
              />
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
            </div>
          )}

          {authMode === 'login' && (
            <div className="auth-forgot">
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleMode} className="auth-toggle-btn">
              {authMode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="auth-social">
          <button className="social-btn google">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Google
          </button>
          <button className="social-btn facebook">
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
  );
}

export default AuthModal;