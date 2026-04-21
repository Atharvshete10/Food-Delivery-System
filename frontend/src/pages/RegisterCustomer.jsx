import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/users';

function RegisterCustomer() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    street: '', city: '', state: '', pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setMsg({ type: 'error', text: 'Passwords do not match' });
    }
    
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      await axios.post(`${API_BASE}/register`, formData);
      setMsg({ type: 'success', text: 'Registration successful! You can now login.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg({ 
        type: 'error', 
        text: err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2>Create Account</h2>
      {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Min 6 characters" />
          </div>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
        </div>
        
        <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem', color: 'var(--primary)' }}>Delivery Address</h3>
        
        <div className="form-group">
          <label>Street / Area</label>
          <input type="text" name="street" required value={formData.street} onChange={handleChange} placeholder="123 Main St" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="Mumbai" />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" required value={formData.state} onChange={handleChange} placeholder="MH" />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} placeholder="400001" />
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Register Account'}
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterCustomer;
