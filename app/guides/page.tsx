'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

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
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  
  // Tab states: 'tips' or 'muse'
  const [activeTab, setActiveTab] = useState<'tips' | 'muse'>('tips');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="site-shell">
      <div className="shell">
        <div className="homepage-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Sticky Header */}
          <div 
            className="sticky-nav-shell visible" 
            style={{ 
              top: scrolled ? '16px' : '54px', 
              transform: 'translateX(-50%)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 100
            }}
          >
            <nav 
              className="nav nav-sticky-bar" 
              aria-label="Primary navigation" 
              style={{ transform: scrolled ? 'scale(1)' : 'scale(1.08)' }}
            >
              <Link className="nav-brand" href="/">
                <span className="brandmark-dot"></span>
                <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
              </Link>
              
              <div className="nav-links">
                <Link href="/offers" className="nav-link-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles nav-link-icon" aria-hidden="true">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                    <path d="M20 3v4"></path>
                    <path d="M22 5h-4"></path>
                    <path d="M4 17v2"></path>
                    <path d="M5 18H3"></path>
                  </svg>
                  Offers
                </Link>
                <Link href="/tours" className="nav-link-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map nav-link-icon" aria-hidden="true">
                    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l-4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                    <path d="M15 5.764v15"></path>
                    <path d="M9 3.236v15"></path>
                  </svg>
                  Tours
                </Link>
                <Link href="/guides" className="nav-link-button active">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-compass nav-link-icon" aria-hidden="true">
                    <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  Guides
                </Link>
              </div>
              
              <div className="nav-spacer"></div>
              
              <div className="nav-right" style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className="nav-icon nav-action-btn" 
                  aria-label="Language and currency"
                  onClick={() => setLangOpen(!langOpen)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"></path>
                  </svg>
                  <span style={{ fontSize: '10px', marginLeft: '2px', fontWeight: 'bold' }}>{currentLang}</span>
                </button>
                
                {langOpen && (
                  <div className="nav-dropdown nav-dropdown-compact" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0 }}>
                    <button className="nav-dropdown-button" onClick={() => { setCurrentLang('EN'); setLangOpen(false); }}>🇬🇧 English (GEL)</button>
                    <button className="nav-dropdown-button" onClick={() => { setCurrentLang('KA'); setLangOpen(false); }}>🇬🇪 ქართული (GEL)</button>
                    <button className="nav-dropdown-button" onClick={() => { setCurrentLang('RU'); setLangOpen(false); }}>🇷🇺 Русский (GEL)</button>
                  </div>
                )}

                <button 
                  type="button" 
                  className="nav-icon nav-action-btn nav-theme-icon" 
                  aria-label="Switch theme"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                      <path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z"></path>
                    </svg>
                  )}
                </button>
                
                <Link className="nav-auth-link" href="/login">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in nav-link-icon" aria-hidden="true">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" x2="3" y1="12" y2="12"></line>
                  </svg>
                  Sign up/Login
                </Link>
              </div>
            </nav>
          </div>

          {/* Main Body Content */}
          <main style={{ flexGrow: 1, padding: '120px 24px 80px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
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

          {/* Footer */}
          <footer className="footer" style={{ marginTop: 'auto' }}>
            <div>
              <h3>kaya<span style={{ opacity: 0.5 }}>.ge</span></h3>
              <p>Discover Georgia through curated offers, services, structured platform flows and thoughtful local context.</p>
            </div>
            <div>
              <h4>Product</h4>
              <ul>
                <li><Link href="/offers">Offers</Link></li>
                <li><Link href="/restaurants">Restaurants</Link></li>
                <li><Link href="/tours">Tours</Link></li>
                <li><Link href="/guides">Muse</Link></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4>Platform</h4>
              <ul>
                <li><Link href="/dashboard">Tourist dashboard</Link></li>
                <li><Link href="/business/dashboard">Business dashboard</Link></li>
                <li><Link href="/admin">Admin panel</Link></li>
              </ul>
            </div>
            <div className="copyright">
              <span>© 2026 Kaya.ge — Discover Georgia</span>
              <span>Built around the Phase 1 brief</span>
            </div>
          </footer>

        </div>
      </div>
      
      {/* Mobile Top Bar */}
      <header className="mobile-guest-topbar" aria-label="Primary navigation">
        <Link className="mobile-guest-topbar-brand" aria-label="Kaya home" href="/">
          <span className="brandmark-dot" aria-hidden="true"></span>
          <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
        </Link>
        <div className="mobile-guest-topbar-actions">
          <button 
            type="button" 
            className="mobile-guest-topbar-btn" 
            aria-label="Language and currency"
            onClick={() => setLangOpen(!langOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"></path>
            </svg>
          </button>
          
          <button 
            type="button" 
            className="mobile-guest-topbar-btn" 
            aria-label="Switch to dark theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z"></path>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Primary navigation">
        <ul className="mobile-bottom-nav-list" style={{ '--mobile-bottom-nav-columns': 5 } as React.CSSProperties}>
          <li>
            <Link className="mobile-bottom-nav-item" href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-house" aria-hidden="true">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <span>Homepage</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item" href="/offers">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles" aria-hidden="true">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                <path d="M20 3v4"></path>
                <path d="M22 5h-4"></path>
                <path d="M4 17v2"></path>
                <path d="M5 18H3"></path>
              </svg>
              <span>Offers</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item" href="/tours">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map" aria-hidden="true">
                <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                <path d="M15 5.764v15"></path>
                <path d="M9 3.236v15"></path>
              </svg>
              <span>Tours</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item active" aria-current="page" href="/guides">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-compass" aria-hidden="true">
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span>Guides</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item" href="/login">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in" aria-hidden="true">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" x2="3" y1="12" y2="12"></line>
              </svg>
              <span>Sign up/Login</span>
            </Link>
          </li>
        </ul>
      </nav>

    </div>
  );
}
