import React from 'react';
import { getPortfolioItems, getMessages, deleteMessage, deletePortfolioItem } from '../actions';
import AdminClient from './AdminClient';
import AdminAuth from './AdminAuth';
import '../globals.css';

export default async function AdminPage() {
  const items = await getPortfolioItems();
  const messages = await getMessages();

  return (
    <AdminAuth>
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              <span style={{ color: '#00e5ff' }}>Adil.</span> Studio
            </h1>
            <a href="/" style={{ padding: '0.75rem 1.5rem', border: '1px solid #333', borderRadius: '100px', color: '#ccc', textDecoration: 'none' }}>
              &larr; Back to Site
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Upload Section */}
            <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>Upload New Work</h2>
              <AdminClient />
            </div>

            {/* Messages Section */}
            <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>Contact Messages</h2>
              {messages.length === 0 ? (
                <p style={{ color: '#666' }}>No messages yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((msg: any) => (
                    <div key={msg.id} style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '3px solid #00e5ff', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#fff' }}>{msg.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(msg.date).toLocaleDateString()}</span>
                      </div>
                      <a href={`mailto:${msg.email}`} style={{ color: '#00e5ff', fontSize: '0.9rem', display: 'block', marginBottom: '0.75rem' }}>{msg.email}</a>
                      <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.message}</p>
                      <form action={deleteMessage.bind(null, msg.id)} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <button type="submit" style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Portfolio Management */}
          <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #222', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>Current Portfolio Items</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {items.map((item: any) => (
                <div key={item.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0a0a0a', border: '1px solid #333' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#00e5ff' }}>{item.categoryLabel}</span>
                    <form action={deletePortfolioItem.bind(null, item.id)} style={{ marginTop: '0.5rem' }}>
                      <button type="submit" style={{ background: 'rgba(255,59,48,0.2)', border: '1px solid #ff3b30', color: '#ff3b30', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', width: '100%' }}>Delete Work</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminAuth>
  );
}
