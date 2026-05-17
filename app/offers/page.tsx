'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/lang-context';

const SAMPLE_OFFERS = [
  {
    id: 'tbilisi-nest',
    title: 'Tbilisi Old Town Nest',
    category: 'stay',
    price: 180,
    unit: 'night',
    rating: 4.9,
    location: 'Tbilisi, Old Town',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
    amenities: ['WiFi', 'Air Conditioning', 'Sulphur Bath Access']
  },
  {
    id: 'kazbegi-glass',
    title: 'Kazbegi A-Frame Glass Cabin',
    category: 'stay',
    price: 280,
    unit: 'night',
    rating: 4.8,
    location: 'Kazbegi, Gergeti',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=400&fit=crop',
    amenities: ['Mountain View', 'Fireplace', 'Outdoor Deck']
  },
  {
    id: 'kakheti-chateau',
    title: 'Chateau Wine Cellar & Resort',
    category: 'restaurant',
    price: 120,
    unit: 'person',
    rating: 4.95,
    location: 'Kakheti, Telavi',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
    amenities: ['Wine Tasting', 'Supra Menu', 'Vineyard Tour']
  },
  {
    id: 'batumi-cruiser',
    title: 'Tesla Model Y Long Range',
    category: 'car',
    price: 150,
    unit: 'day',
    rating: 4.7,
    location: 'Batumi, Coastline',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop',
    amenities: ['Autopilot', 'Unlimited KM', 'Airport Handoff']
  }
];

export default function OffersPage() {
  const { theme, toggleTheme } = useTheme();
  const { lang: currentLang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(400);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredOffers = SAMPLE_OFFERS.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          offer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesPrice = offer.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

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
                <Link href="/offers" className="nav-link-button active">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles nav-link-icon" aria-hidden="true">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                    <path d="M20 3v4"></path>
                    <path d="M22 5h-4"></path>
                    <path d="M4 17v2"></path>
                    <path d="M5 18H3"></path>
                  </svg>
                  {t('offers')}
                </Link>
                <Link href="/tours" className="nav-link-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map nav-link-icon" aria-hidden="true">
                    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                    <path d="M15 5.764v15"></path>
                    <path d="M9 3.236v15"></path>
                  </svg>
                  {t('tours')}
                </Link>
                <Link href="/guides" className="nav-link-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-compass nav-link-icon" aria-hidden="true">
                    <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  {t('guides')}
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
                    <button className="nav-dropdown-button" onClick={() => { setLang('EN'); setLangOpen(false); }}>🇬🇧 English (GEL)</button>
                    <button className="nav-dropdown-button" onClick={() => { setLang('KA'); setLangOpen(false); }}>🇬🇪 ქართული (GEL)</button>
                    <button className="nav-dropdown-button" onClick={() => { setLang('RU'); setLangOpen(false); }}>🇷🇺 Русский (GEL)</button>
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
                  {t('login')}
                </Link>
              </div>
            </nav>
          </div>

          {/* Main Body Content */}
          <main style={{ flexGrow: 1, padding: '120px 24px 80px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
            
            {/* Header Title Section */}
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="hero-side-eyebrow" style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>{t('visitors')}</span>
              <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '8px 0 16px' }}>{t('curatedOffers')}</h1>
              <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                {t('offersDesc')}
              </p>
            </header>

            {/* Premium Filter Interface */}
            <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', marginBottom: '40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
                
                {/* Search query */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>{t('whereWhat')}</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Search Tbilisi, Batumi, Kazbegi..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        borderRadius: '99px', 
                        background: 'rgba(0,0,0,0.03)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '99px', 
                      background: 'rgba(0,0,0,0.03)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">{t('allCategories')}</option>
                    <option value="stay">{t('hotelsStays')}</option>
                    <option value="restaurant">{t('wineFeast')}</option>
                    <option value="car">{t('carRentals')}</option>
                  </select>
                </div>

                {/* Price Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)' }}>{t('maxPrice')}</label>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{priceRange} GEL</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    style={{ 
                      width: '100%',
                      cursor: 'pointer',
                      accentColor: 'var(--accent)'
                    }}
                  />
                </div>

              </div>
            </div>

            {/* Offers Grid */}
            {filteredOffers.length > 0 ? (
              <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredOffers.map((offer) => (
                  <div key={offer.id} className="glass-card hover-lift" style={{ borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
                    <div style={{ position: 'relative', height: '200px', width: '100%', background: '#ccc' }}>
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{ 
                        position: 'absolute', 
                        top: '16px', 
                        right: '16px', 
                        background: 'rgba(255,255,255,0.9)', 
                        padding: '6px 12px', 
                        borderRadius: '99px', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: '#000',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {offer.price} GEL / {offer.unit}
                      </span>
                    </div>
                    
                    <div style={{ padding: '20px' }}>
                      <span className="hero-side-card-kicker" style={{ fontSize: '11px', color: 'var(--muted)' }}>{offer.location}</span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 12px' }}>{offer.title}</h3>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {offer.amenities.map((am) => (
                          <span key={am} style={{ fontSize: '10px', background: 'rgba(0,0,0,0.04)', padding: '4px 8px', borderRadius: '4px' }}>{am}</span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>★ {offer.rating.toFixed(1)}</span>
                        <Link href={`/listing/${offer.id}`} className="pill-link" style={{ fontSize: '11px', padding: '6px 12px' }}>{t('bookStay')}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Perfect 1:1 Empty State card matching Screenshot 2 */
              <div 
                className="dashboard-stat-card empty-state-card empty-state-card-compact" 
                style={{ 
                  margin: '40px auto', 
                  maxWidth: '500px', 
                  padding: '48px 32px', 
                  textAlign: 'center', 
                  borderRadius: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: 'rgba(0,0,0,0.03)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <strong style={{ fontSize: '18px', fontWeight: 700 }}>{t('noOffersFound')}</strong>
                <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {t('noOffersFoundDesc')}
                </p>
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
            <Link className="mobile-bottom-nav-item active" aria-current="page" href="/offers">
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
            <Link className="mobile-bottom-nav-item" href="/guides">
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
