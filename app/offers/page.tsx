'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  const { t } = useLanguage();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(400);

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

          {/* Main Body Content */}
          <main style={{ flexGrow: 1, padding: '100px 24px 80px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
            
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
                  <div key={offer.id} className="glass-card hover-lift card-3d-glow" style={{ borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
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
