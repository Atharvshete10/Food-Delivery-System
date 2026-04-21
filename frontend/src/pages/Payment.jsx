import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState('Credit Card');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      // Simulate fetching amount from order (for demo, using dummy 500)
      // Ideally backend returns amount when viewing order, or it's passed via state
      
      const res = await axios.post(`${API_BASE}/payments`, {
        payment_method: method,
        amount: Math.floor(Math.random() * 500) + 200, // Simulated exact order amount 
        order_id: orderId
      });

      // Once paid, assigning a dummy delivery partner automatically to show DB inserts
      await axios.post(`${API_BASE}/delivery`, {
        delivery_id: 1, // Using dummy delivery ID 1, assuming one exists
        order_id: orderId
      });

      setMsg({ type: 'success', text: 'Payment successful! Order sent for delivery.' });
      setTimeout(() => navigate('/review'), 3000);
      
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Payment failed' });
    }
  };

  return (
    <div className="form-container" style={{maxWidth: '500px'}}>
      <h2>Complete Payment</h2>
      <p style={{marginBottom: '2rem'}}>Order Reference ID: <strong>{orderId}</strong></p>
      
      {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

      <form onSubmit={handlePayment}>
        <div className="form-group">
          <label>Payment Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="UPI">UPI / Wallet</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        <button type="submit" className="btn" style={{marginTop: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)'}}>
          Pay & Confirm Order
        </button>
      </form>
    </div>
  );
}

export default Payment;
