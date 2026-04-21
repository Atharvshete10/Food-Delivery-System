import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RegisterCustomer from './pages/RegisterCustomer';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Payment from './pages/Payment';
import Review from './pages/Review';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-brand">FDMS</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          {token ? (
            <>
              <Link to="/order" className="nav-link">Order</Link>
              <Link to="/review" className="nav-link">Review</Link>
              <button 
                onClick={handleLogout} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Logout ({user.name})
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<Restaurants />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterCustomer />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
