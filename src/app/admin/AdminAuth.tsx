'use client';

import React, { useState } from 'react';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // The secret password for the admin page
  const SECRET_PASSWORD = "adil"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', padding: '2rem' }}>
      <div style={{ backgroundColor: '#111', padding: '3rem', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', maxWidth: '400px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#fff' }}>
          <span style={{ color: '#00e5ff' }}>Admin</span> Studio
        </h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', fontSize: '1rem', outline: 'none' }}
          />
          {error && <p style={{ color: '#ff3b30', fontSize: '0.875rem', margin: 0, textAlign: 'left' }}>{error}</p>}
          <button type="submit" style={{ padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#00e5ff', color: '#000', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            Unlock Studio <i className="fas fa-lock-open" style={{marginLeft: '0.5rem'}}></i>
          </button>
        </form>
        <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.875rem', display: 'block', marginTop: '1.5rem', transition: 'color 0.3s' }}>
          &larr; Back to Site
        </a>
      </div>
    </div>
  );
}
