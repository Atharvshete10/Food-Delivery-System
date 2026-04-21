import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/users';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await axios.post(`${API_BASE}/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMsg({ type: 'success', text: 'Login successful! Redirecting...' });
      
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // To update navbar
      }, 1500);
    } catch (err) {
      setMsg({ 
        type: 'error', 
        text: err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Login failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Welcome Back</h2>
      {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="example@mail.com"
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            required 
            placeholder="••••••••"
            value={formData.password} 
            onChange={handleChange} 
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Login'}
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
