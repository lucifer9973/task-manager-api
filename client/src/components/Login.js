import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });

      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="modern-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Welcome Back! 👋</h2>
      <p className="form-subtitle">Sign in to continue managing your tasks</p>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          📧 Email Address
        </label>
        <input
          type="email"
          id="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">
          🔒 Password
        </label>
        <input
          type="password"
          id="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <button 
        type="submit" 
        className="modern-btn" 
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? (
          <>
            <span className="loading"></span>
            Signing In...
          </>
        ) : (
          '🚀 Sign In'
        )}
      </button>

      <button 
        type="button" 
        className="switch-btn" 
        onClick={onSwitchToRegister}
      >
        Don't have an account? Sign up here
      </button>
    </form>
  );
};

export default Login;
