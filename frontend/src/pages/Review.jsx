import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

function Review() {
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    rating: 5, comment: '', restaurant_id: ''
  });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [selectedViewRestaurant, setSelectedViewRestaurant] = useState('');

  const rawUser = localStorage.getItem('user');
  const loggedInUser = rawUser ? JSON.parse(rawUser) : null;

  useEffect(() => {
    if (loggedInUser) {
        fetchInitData();
    }
  }, []);

  const fetchInitData = async () => {
    try {
      const restRes = await axios.get(`${API_BASE}/restaurants`);
      setRestaurants(restRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchReviews = async (rId) => {
    setSelectedViewRestaurant(rId);
    if (!rId) return;
    try {
      const res = await axios.get(`${API_BASE}/reviews/${rId}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser) {
        setMsg({ type: 'error', text: 'You must be logged in to leave a review.' });
        return;
    }
    if (!formData.restaurant_id) {
       setMsg({ type: 'error', text: 'Please select a restaurant.' });
       return;
    }
    try {
      const payload = {
          ...formData,
          customer_id: loggedInUser._id || loggedInUser.id
      };
      await axios.post(`${API_BASE}/reviews`, payload);
      setMsg({ type: 'success', text: `Review submitted!` });
      setFormData({...formData, comment: '', rating: 5});
      if (selectedViewRestaurant == formData.restaurant_id) {
          handleFetchReviews(formData.restaurant_id);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add review' });
    }
  };

  if (!loggedInUser) {
     return (
       <div className="form-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
         <h2>Authentication Required</h2>
         <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>You must be logged in to read or submit reviews.</p>
         <button className="btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/login')}>Go to Login</button>
       </div>
     );
  }

  return (
    <div>
      <div className="form-container" style={{marginBottom: '3rem'}}>
        <h2>Leave a Review</h2>
        {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
             <h4 style={{ color: 'var(--primary)' }}>Reviewing As:</h4>
             <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{loggedInUser.name}</p>
          </div>

          <div className="form-group">
            <label>Restaurant</label>
            <select value={formData.restaurant_id} onChange={(e) => setFormData({...formData, restaurant_id: e.target.value})} required>
              <option value="">-- Select Restaurant --</option>
              {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Rating (1-5)</label>
            <input 
              type="number" 
              min="1" max="5" 
              value={formData.rating} 
              onChange={(e) => setFormData({...formData, rating: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea 
              rows="4" 
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn">Submit Review</button>
        </form>
      </div>

      <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <h2>View Reviews</h2>
        <div className="form-group">
          <label>Select Restaurant to View Reviews</label>
          <select value={selectedViewRestaurant} onChange={(e) => handleFetchReviews(e.target.value)}>
            <option value="">-- Select Restaurant --</option>
            {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
        </div>

        {selectedViewRestaurant && (
          <div className="card-grid" style={{gridTemplateColumns: '1fr', gap: '1rem'}}>
            {reviews.length > 0 ? reviews.map(r => (
              <div key={r._id} style={{padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <strong>{r.customer_name || 'Anonymous User'}</strong>
                  <span style={{color: '#facc15'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                </div>
                <p style={{fontStyle: 'italic'}}>"{r.comment}"</p>
                <small style={{color: 'gray'}}>{new Date(r.review_date).toLocaleDateString()}</small>
              </div>
            )) : <p>No reviews yet for this restaurant. Be the first!</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;
