import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function Restaurants() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [restaurants, setRestaurants] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all restaurants
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/restaurants`);
      setRestaurants(res.data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load of restaurants
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Fetch menu for a specific restaurant
  useEffect(() => {
    if (!id) {
      setMenu([]);
      setSelectedRestaurant(null);
      return;
    }

    console.log("Fetching menu for:", id);
    setMenuLoading(true);

    axios.get(`${API_BASE}/menu/${id}`)
        .then(res => {
            console.log("Menu data:", res.data);
            setMenu(res.data);
        })
        .catch(err => {
            console.error("Menu error:", err);
            setError('Failed to load menu items.');
        })
        .finally(() => setMenuLoading(false));

    // Also sync the selected restaurant highlighting
    if (restaurants.length > 0) {
      const selected = restaurants.find(r => r._id === id);
      if (selected) {
        setSelectedRestaurant(selected);
        if (window.innerWidth < 768) {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }
      }
    }
  }, [id, restaurants]);

  const handleViewMenu = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const handleBackToList = () => {
    navigate('/restaurants');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading restaurants...</p>
      </div>
    );
  }

  if (error && !id) {
    return (
      <div className="error-container">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: 'auto' }} onClick={fetchRestaurants}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Explore <span style={{ color: 'var(--primary)' }}>Restaurants</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Discover the best food and drinks in your area
        </p>
      </header>
      
      {/* Restaurant List View */}
      <div className="card-grid">
        {restaurants.map(r => {
          const rId = r._id; 
          const isSelected = selectedRestaurant && (selectedRestaurant._id === rId);
          
          return (
          <div 
            key={rId} 
            className={`card ${isSelected ? 'active-card' : ''}`}
            style={selectedRestaurant && !isSelected ? { opacity: 0.5, transform: 'scale(0.95)' } : {}}
          >
            <h3>{r.name}</h3>
            <p>📍 {r.address}</p>
            <p>📞 {r.contact_no || 'N/A'}</p>
            <button 
              className={isSelected ? 'btn' : 'btn btn-outline'}
              style={{ marginTop: '1.5rem' }}
              onClick={() => handleViewMenu(rId)}
            >
              {isSelected ? 'Viewing Menu' : 'View Menu'}
            </button>
          </div>
          );
        })}
      </div>

      {/* Menu Detail View */}
      {id && (
        <div id="menu-section" style={{ marginTop: '5rem', borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
          {selectedRestaurant ? (
            <>
              <div className="menu-header">
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Menu for {selectedRestaurant.name}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{menu.length} Items available</p>
                </div>
                <button className="back-btn" onClick={handleBackToList}>
                  ← Back to Restaurants
                </button>
              </div>

              {menuLoading ? (
                <div className="loader-container" style={{ minHeight: '200px' }}>
                  <div className="loader"></div>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menu.length > 0 ? menu.map(item => (
                        <tr key={item.item_id}>
                          <td style={{ fontWeight: 600 }}>{item.item_name}</td>
                          <td><span className="badge">{item.category}</span></td>
                          <td style={{ color: 'var(--secondary)', fontWeight: 800 }}>₹{item.price}</td>
                          <td>
                            <span className={`badge ${item.availability_status ? 'status-completed' : 'status-pending'}`}>
                              {item.availability_status ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                            No menu items found for this restaurant.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="error-container">
              <h3>Restaurant Not Found</h3>
              <p>The restaurant you are looking for does not exist or has been removed.</p>
              <button className="back-btn" onClick={handleBackToList} style={{ margin: '1.5rem auto' }}>
                Back to All Restaurants
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Restaurants;
