'use client';

import { useState } from 'react';
import Link from 'next/link';

const REGIONS = [
  { name: 'Tbilisi', desc: 'The vibrant capital where East meets West', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop', listings: 1200 },
  { name: 'Batumi', desc: 'Black Sea resort city with modern architecture', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop', listings: 800 },
  { name: 'Kakheti', desc: "The cradle of wine — Georgia's vineyard heartland", img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=300&fit=crop', listings: 450 },
  { name: 'Kazbegi', desc: 'Dramatic mountains and the iconic Gergeti Church', img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop', listings: 200 }
];

const PHRASES = [
  { ka: 'გამარჯობა', en: 'Gamarjoba', meaning: 'Hello' },
  { ka: 'მადლობა', en: 'Madloba', meaning: 'Thank you' },
  { ka: 'გაუმარჯოს', en: 'Gaumarjos', meaning: 'Cheers! (toast)' },
  { ka: 'ბოდიში', en: 'Bodishi', meaning: 'Sorry / Excuse me' }
];

export default function GuidesPage() {
  // Tab states: 'tips' or 'muse'
  const [activeTab, setActiveTab] = useState<'tips' | 'muse'>('tips');

  return (
    <div className="site-shell">
      <div className="shell">
        <div className="homepage-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* Main Body Content */}
          <main style={{ flexGrow: 1, padding: '100px 24px 80px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '99px', padding: '4px', marginBottom: '32px' }}>
              <button 
                onClick={() => setActiveTab('tips')}
                style={{
                  padding: '8px 24px',
                  borderRadius: '99px',
                  border: 0,
                  background: activeTab === 'tips' ? 'var(--bg-secondary)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'tips' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Local Tips
              </button>
              <button 
                onClick={() => setActiveTab('muse')}
                style={{
                  padding: '8px 24px',
                  borderRadius: '99px',
                  border: 0,
                  background: activeTab === 'muse' ? 'var(--bg-secondary)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'muse' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Travel Muse
              </button>
            </div>

            {activeTab === 'tips' ? (
              /* Exact 1:1 Visual Parity matching Screenshot 2 */
              <div 
                className="dashboard-stat-card empty-state-card empty-state-card-compact" 
                style={{ 
                  margin: '40px auto', 
                  width: '100%',
                  maxWidth: '500px', 
                  padding: '64px 32px', 
                  textAlign: 'center', 
                  borderRadius: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  border: '1px dashed rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: 'rgba(92,56,41,0.06)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#5c3829'
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <strong style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display), serif' }}>No live guides yet.</strong>
                <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                  Local tips are on the way. Come back soon.
                </p>
              </div>
            ) : (
              /* Curated Muse guide block */
              <div style={{ width: '100%' }}>
                
                {/* Phrasebook Section */}
                <section style={{ marginBottom: '40px', width: '100%' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display), serif', marginBottom: '16px' }}>Georgian Phrasebook</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                    {PHRASES.map(p => (
                      <div key={p.en} style={{ padding: '16px', borderRadius: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>{p.ka}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.en}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.meaning}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Region Guides */}
                <section style={{ width: '100%' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display), serif', marginBottom: '16px' }}>Explore Regions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {REGIONS.map(r => (
                      <div key={r.name} className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden', padding: 0 }}>
                        <div style={{ height: '140px', width: '100%', background: '#ccc' }}>
                          <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '16px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px' }}>{r.name}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

          </main>
        </div>
      </div>

      {/* Full Width Footer */}
      <footer className="site-footer" style={{ marginTop: 'auto' }}>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </div>
            <p className="footer-tagline">Discover Georgia through curated offers, services, structured platform flows and thoughtful local context.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <Link href="/offers">Offers</Link>
            <Link href="/restaurants">Restaurants</Link>
            <Link href="/tours">Tours</Link>
            <Link href="/guides">Guides</Link>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <Link href="/dashboard">Tourist dashboard</Link>
            <Link href="/business/dashboard">Business dashboard</Link>
            <Link href="/admin">Admin panel</Link>
          </div>
        </div>
        <div className="copyright">
          <span>© 2026 Kaya.ge — Discover Georgia</span>
          <span>Built around the Phase 1 brief</span>
        </div>
      </footer>
    </div>
  );
}
