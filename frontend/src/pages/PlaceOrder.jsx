import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function PlaceOrder() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [menu, setMenu] = useState([]);
  
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]); // Array of { _id, item_name, price, quantity }
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Get user from local storage
  const rawUser = localStorage.getItem('user');
  const loggedInUser = rawUser ? JSON.parse(rawUser) : null;

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchInitData = async () => {
    try {
      const restRes = await axios.get(`${API_BASE}/restaurants`);
      setRestaurants(restRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestaurantChange = async (e) => {
    const rId = e.target.value;
    setSelectedRestaurantId(rId);
    setSelectedItems([]); // Clear cart when restaurant changes
    
    if (!rId) {
      setMenu([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/menu/${rId}`);
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add items securely
  const handleAddItem = (item) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        // If it exists, uniquely increment quantity
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        // If it does not exist, add securely
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove completely
  const handleRemoveItem = (itemId) => {
    setSelectedItems(prev => prev.filter(i => i._id !== itemId));
  };

  // Update logic with fallback to remove
  const handleUpdateQuantity = (itemId, delta) => {
    setSelectedItems(prev => prev.map(item => {
      if (item._id === itemId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0)); // Prune explicitly
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      setMsg({ type: 'error', text: 'You must be logged in to place an order.' });
      return;
    }

    if (!selectedRestaurantId || selectedItems.length === 0) {
      setMsg({ type: 'error', text: 'Please select a restaurant and at least one item.' });
      return;
    }

    try {
      const totalAmount = calculateTotal();
      const address = `${loggedInUser.street || 'Default Street'}, ${loggedInUser.city || 'City'}, ${loggedInUser.state || 'State'} - ${loggedInUser.pincode || '000000'}`;

      // Create structured payload explicitly mapping item._id to expected API model
      const orderPayload = {
        delivery_address: address,
        total_amount: totalAmount,
        customer_id: loggedInUser._id, // Set explicitly from storage
        restaurant_id: selectedRestaurantId,
        items: selectedItems.map(item => ({
          item_id: item._id, // Enforce unified backend expectation
          quantity: item.quantity
        }))
      };

      console.log('Dispatching order:', orderPayload);

      const orderRes = await axios.post(`${API_BASE}/orders`, orderPayload);
      const orderId = orderRes.data._id || orderRes.data.order_id; // Support both returns

      setMsg({ type: 'success', text: 'Order created! Redirecting to payment...' });
      setTimeout(() => navigate(`/payment/${orderId}`), 1500);
      
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Order creation failed' });
    }
  };

  if (!loggedInUser) {
    return (
      <div className="form-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Authentication Required</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>You must be logged in to access the cart and place orders.</p>
        <button className="btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="form-container" style={{ maxWidth: '900px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Place New Order</h2>
      {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}
      
      <form onSubmit={handleOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
               <h4 style={{ color: 'var(--primary)' }}>Ordering As:</h4>
               <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{loggedInUser.name} <span style={{fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)'}}>({loggedInUser.email})</span></p>
            </div>

            <div className="form-group">
              <label>Select Restaurant</label>
              <select value={selectedRestaurantId} onChange={handleRestaurantChange} required>
                <option value="">-- Select Restaurant --</option>
                {restaurants.map(r => {
                  const rId = r._id;
                  return (
                    <option key={rId} value={rId}>{r.name}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Cart Summary</h4>
            {selectedItems.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No items added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedItems.map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span>{item.item_name} x {item.quantity}</span>
                    <span style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: 'var(--secondary)' }}>₹{calculateTotal()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedRestaurantId && (
          <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Menu Items</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
              {menu.filter(m => m.availability_status).map(m => {
                const cartItem = selectedItems.find(i => i._id === m._id);
                return (
                  <div key={m._id} className="card" style={{ padding: '1.2rem', margin: 0, position: 'relative', border: cartItem ? '1px solid var(--primary)' : '1px solid var(--border-color)' }}>
                    <h5 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{m.item_name}</h5>
                    <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '1rem' }}>₹{m.price}</p>
                    
                    {cartItem ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <button type="button" onClick={() => handleUpdateQuantity(m._id, -1)} style={{ padding: '2px 8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: '800' }}>-</button>
                          <span style={{ minWidth: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                          <button type="button" onClick={() => handleUpdateQuantity(m._id, 1)} style={{ padding: '2px 8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: '800' }}>+</button>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(m._id)}
                          style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="btn" 
                        style={{ padding: '0.6rem', fontSize: '0.9rem' }}
                        onClick={() => handleAddItem(m)}
                      >
                        Add to Order
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn" 
          style={{ marginTop: '3rem', maxWidth: '300px', display: 'block', margin: '3rem auto 0 auto' }}
          disabled={selectedItems.length === 0}
        >
          Proceed to Payment (₹{calculateTotal()})
        </button>
      </form>
    </div>
  );
}

export default PlaceOrder;

