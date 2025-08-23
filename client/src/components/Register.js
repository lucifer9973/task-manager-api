import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password
      });

      // Check if token exists in response (this is the fix)
      if (response.data.token) {
        onRegister(response.data.user, response.data.token);
      } else {
        setError('Registration successful but login failed. Please try logging in.');
        onSwitchToLogin();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="modern-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Join TaskMaster! 🎉</h2>
      <p className="form-subtitle">Create your account and start organizing</p>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="name">
          👤 Full Name
        </label>
        <input
          type="text"
          id="name"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

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
          placeholder="Create a strong password"
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
            Creating Account...
          </>
        ) : (
          '✨ Create Account'
        )}
      </button>

      <button 
        type="button" 
        className="switch-btn" 
        onClick={onSwitchToLogin}
      >
        Already have an account? Sign in here
      </button>
    </form>
  );
};

export default Register;