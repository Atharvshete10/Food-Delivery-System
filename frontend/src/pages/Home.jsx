import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Food Delivery Management System</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        A premium full-stack demonstration of robust database management systems, utilizing comprehensive SQL schemas, foreign key relationships, and dynamic queries to handle complex real-world data flows.
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/restaurants" style={{textDecoration: 'none'}}>
          <div className="card" style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3rem', margin: '1rem 0' }}>🍽️</span>
            <h3>Restaurants</h3>
            <p style={{textAlign: 'center', fontSize:'0.9rem'}}>Explore food menus and available dining options.</p>
          </div>
        </Link>
        
        <Link to="/register" style={{textDecoration: 'none'}}>
          <div className="card" style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3rem', margin: '1rem 0' }}>👤</span>
            <h3>Customer</h3>
            <p style={{textAlign: 'center', fontSize:'0.9rem'}}>Register as a new user in the database system.</p>
          </div>
        </Link>

        <Link to="/order" style={{textDecoration: 'none'}}>
          <div className="card" style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3rem', margin: '1rem 0' }}>🛒</span>
            <h3>Orders</h3>
            <p style={{textAlign: 'center', fontSize:'0.9rem'}}>Execute table JOINs by creating new food orders.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
