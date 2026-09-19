'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/lang-context';
import { SEED_LISTINGS } from '@/lib/seed-data';

// Authentic Georgian Destinations for Hero Carousel
const GEORGIA_DESTINATIONS = [
  {
    id: 'gergeti-kazbegi',
    title: 'Kazbegi',
    location: 'Stepantsminda, Georgia',
    tag: 'Caucasus Peak',
    description: 'Perched at 2,170 meters against the dramatic snowy pyramid of Mount Kazbek, Georgia\'s most iconic alpine sanctuary.',
    image: '/destinations/kazbegi.jpg',
    thumb: '/destinations/kazbegi.jpg',
  },
  {
    id: 'gudauri',
    title: 'Gudauri',
    location: 'Stepantsminda, Georgia',
    tag: 'Adventure Capital',
    description: 'Georgia\'s premier ski resort and paragliding hub, perched on the Cross Pass with panoramic Caucasus vistas and the iconic Friendship Monument.',
    image: '/destinations/gudauri.jpg',
    thumb: '/destinations/gudauri.jpg',
  },
  {
    id: 'svaneti-towers',
    title: 'Svaneti',
    location: 'Mestia, Georgia',
    tag: 'High Caucasus',
    description: 'Ancient UNESCO millennium-old defensive stone towers standing vigilant under towering glaciers in the heart of Svaneti.',
    image: '/destinations/svaneti.jpg',
    thumb: '/destinations/svaneti.jpg',
  },
  {
    id: 'batumi-boulevard',
    title: 'Batumi',
    location: 'Adjara Coast, Georgia',
    tag: 'Black Sea Coast',
    description: 'Lush subtropical palms meeting modern architectural silhouettes, magnetic Black Sea sunsets, and lively seaside promenades.',
    image: '/destinations/batumi.jpg',
    thumb: '/destinations/batumi.jpg',
  },
  {
    id: 'old-tbilisi',
    title: 'Tbilisi',
    location: 'Tbilisi, Georgia',
    tag: 'Silk Road Heart',
    description: 'Winding cobblestone alleyways, intricately carved wooden balconies, ancient fortress views, and atmospheric sulfur baths beneath the Mother of Georgia.',
    image: '/destinations/tbilisi.jpg',
    thumb: '/destinations/tbilisi.jpg',
  }
];

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeDestIdx, setActiveDestIdx] = useState(0); // Kazbegi as main
  const heroRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  // Search state
  const [searchCity, setSearchCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Categories & listings state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [listings, setListings] = useState<any[]>(SEED_LISTINGS);
  const [favorites, setFavorites] = useState<string[]>([]);

  const activeDestList = GEORGIA_DESTINATIONS;

  useEffect(() => {
    // Load favorites from local storage
    try {
      const favs = JSON.parse(localStorage.getItem('kaya_favorites') || '[]');
      setFavorites(favs);
    } catch {}

    // Fetch live listings from MongoDB / local-db API
    async function fetchListings() {
      try {
        const res = await fetch('/api/listings');
        if (res.ok) {
          const data = await res.json();
          if (data.listings && data.listings.length > 0) {
            setListings(data.listings);
          }
        }
      } catch {
        // Fallback to pre-seeded listings
      }
    }
    fetchListings();
  }, []);

  // Real-time polling: refresh listings every 30s + on window focus
  useEffect(() => {
    async function refreshListings() {
      try {
        const res = await fetch('/api/listings');
        if (res.ok) {
          const data = await res.json();
          if (data.listings && data.listings.length > 0) {
            setListings(data.listings);
          }
        }
      } catch {}
    }

    const pollInterval = setInterval(refreshListings, 30000);
    const handleFocus = () => refreshListings();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refreshListings();
    });

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem('kaya_favorites', JSON.stringify(updated));
    } catch {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const query = searchCity.trim();
    if (query) {
      params.append('q', query);
      params.append('city', query);
    }
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const setRevealRef = (i: number) => (el: HTMLElement | null) => { revealRefs.current[i] = el; };

  const filteredListings = selectedCategory === 'all'
    ? listings
    : selectedCategory === 'favorites'
    ? listings.filter(l => favorites.includes(String(l._id || l.id)))
    : listings.filter(l => l.category === selectedCategory);

  return (
    <div className="site-shell">
      {/* ========================================================
          ===== 1-TO-1 FULL-SCREEN HERO (media_1789317359953.jpg) =====
          ======================================================== */}
      <div className="hero-1to1-stage" ref={heroRef}>
        {/* Background Crossfade Layers */}
        {activeDestList.map((dest, idx) => (
          <div
            key={dest.id}
            className={`hero-1to1-media-layer ${idx === activeDestIdx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${dest.image})` }}
          />
        ))}

        {/* Cinematic Gradient Overlay */}
        <div className="hero-1to1-overlay" />

        {/* Integrated Frameless Top Navigation matching Mockup */}
        <div className="hero-1to1-nav">
          <Link href="/" className="hero-1to1-logo">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" />
              <path d="M12 18C12 14 18 10 18 18C18 26 24 22 24 18" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <span className="hero-1to1-logo-text">kaya.ge</span>
          </Link>

          <nav className="hero-1to1-menu">
            <Link href="/" className="hero-1to1-menu-item active">Home</Link>
            <Link href="/hotels" className="hero-1to1-menu-item">Destinations</Link>
            <Link href="/tours" className="hero-1to1-menu-item">Travel Packages</Link>
            <Link href="/about" className="hero-1to1-menu-item">About Us</Link>
            <Link href="/contact" className="hero-1to1-menu-item">Contact</Link>
          </nav>

          <div className="hero-1to1-actions">
            <Link href="/dashboard" className="hero-1to1-auth-pill">
              <span>Dashboard</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Main 1-to-1 Content Layout */}
        <div className="hero-1to1-content">
          {/* Left Column: Script Title, Subtitle, CTA */}
          <div className="hero-1to1-left">
            {/* Flowing Cursive Script Headline matching Image */}
            <h1 className="hero-script-title animate-slide-up animate-delay-2">
              Travel Beyond the Ordinary
            </h1>

            {/* Subtitle Paragraph */}
            <p className="hero-script-desc animate-slide-up animate-delay-3">
              Explore extraordinary places, compare travel options, and uncover experiences that match your travel style. Travel smarter, discover more, and make every moment count.
            </p>

            {/* Frosted Glass CTA Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/search" className="hero-explore-btn animate-slide-up animate-delay-4">
                <span>Explore Destinations</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="16" height="16">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>

            </div>
          </div>

          {/* Right Column: Signature 5-Circle Curved Vertical Arc with Active Halo & Vertical Dots */}
          <div className="hero-1to1-right">
            <div className="hero-arc-container">
              {activeDestList.map((dest, idx) => {
                const isActive = idx === activeDestIdx;
                return (
                  <div
                    key={dest.id}
                    className={`hero-arc-row pos-${idx} ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setActiveDestIdx(idx)}
                    onTouchStart={() => setActiveDestIdx(idx)}
                    onClick={() => setActiveDestIdx(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${dest.title}`}
                  >
                    {/* Circular Image Portal */}
                    <div
                      className="hero-arc-circle"
                      style={{ backgroundImage: `url(${dest.thumb || dest.image})` }}
                    />

                    {/* Title & Subtitle */}
                    <div className="hero-arc-label">
                      <div className="hero-arc-title">{dest.title}</div>
                      <div className="hero-arc-subtitle">{dest.location.split(',')[0]}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 5-Dot Vertical Indicator next to the active circle */}
            <div className="hero-v-dots" aria-label="Destination navigation dots">
              {activeDestList.map((dest, idx) => (
                <button
                  key={dest.id}
                  type="button"
                  className={`hero-v-dot ${idx === activeDestIdx ? 'active' : ''}`}
                  onMouseEnter={() => setActiveDestIdx(idx)}
                  onClick={() => setActiveDestIdx(idx)}
                  aria-label={`Go to ${dest.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="homepage-shell">

          {/* ========================================================
              ===== FEATURED OFFERS WITH CLEAN SVG CATEGORY RIBBON =====
              ======================================================== */}
          <section className="homepage-featured-section fade-up" ref={setRevealRef(0)} style={{ marginTop: '10px' }}>
            <div className="section-head">
              <div>
                <h2 className="section-title">{t('stays.title', 'Popular Stays & Offers')}</h2>
                <p className="section-copy">{t('stays.subtitle', 'Handpicked boutique lofts, mountain cabins, family guesthouses, and wine villas across Georgia.')}</p>
              </div>
              <Link href="/search" className="pill-link">
                {t('viewAll', 'View all stays')} &rarr;
              </Link>
            </div>

            {/* Category Ribbon with clean vector icons */}
            <div className="category-ribbon">
              {[
                {
                  id: 'all',
                  label: 'All Stays',
                  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                },
                {
                  id: 'favorites',
                  label: 'Favorites',
                  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                },
                {
                  id: 'hotels',
                  label: 'Boutique Hotels',
                  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M3 21h18M5 21V7l7-4 7 4v14M10 21v-3h4v3" /></svg>
                },
                {
                  id: 'apartments',
                  label: 'City Apartments',
                  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /></svg>
                },
                {
                  id: 'guesthouses',
                  label: 'Family Guesthouses',
                  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                },
                {
                  id: 'cabins',
                  label: 'Mountain Cabins',
                  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
                },
                {
                  id: 'villas',
                  label: 'Wine Villas',
                  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M8 2h8m-5 0v3m2-3v3M6 5h12c0 4-2 7-2 11 0 3-1.8 6-4 6s-4-3-4-6c0-4-2-7-2-11z" /></svg>
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>{cat.svg}</span>
                  <span>{t(`cat.${cat.id}`, cat.label)}</span>
                </button>
              ))}
            </div>

            {/* Listings Grid */}
            <div className="card-grid">
              {filteredListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '56px 20px', gridColumn: '1 / -1', background: 'rgba(255,251,246,0.85)', borderRadius: '24px', border: '1px dashed var(--border)', backdropFilter: 'blur(12px)' }}>
                  <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>
                    {selectedCategory === 'favorites' ? (
                      <svg viewBox="0 0 24 24" fill="var(--accent, #d9653b)" stroke="var(--accent, #d9653b)" strokeWidth="2" width="32" height="32"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" width="32" height="32"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    )}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--ink)', fontFamily: 'var(--font-display), Georgia, serif' }}>
                    {selectedCategory === 'favorites' ? 'No Saved Favorites Yet' : 'No stays found'}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                    {selectedCategory === 'favorites'
                      ? 'Tap the heart icon on any hotel, villa, or apartment across Kaya.ge to save your favorite Georgian stays here.'
                      : 'Try browsing our other curated categories or searching by destination.'}
                  </p>
                  {selectedCategory === 'favorites' && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="pill-link"
                      style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      Explore All Stays &rarr;
                    </button>
                  )}
                </div>
              ) : (
                filteredListings.slice(0, 9).map((item, idx) => {
                  const itemId = item._id || item.id || `seed-${idx}`;
                  const coverImage = (Array.isArray(item.images) && item.images[0]) || item.img || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop';
                  const isFav = favorites.includes(String(itemId));
                  const price = item.price_per_night || item.price || 180;
                  const rating = item.overall_rating || item.rating || 4.9;

                  return (
                    <Link href={`/listing/${itemId}`} key={itemId} className="listing-card hover-lift">
                      <div className="listing-card-media" style={{ backgroundImage: `url(${coverImage})` }}>
                        <div className="listing-card-top">
                          <span className="price-tag">{price} GEL {t('perNight', '/ night')}</span>
                          <button 
                            type="button" 
                            className="icon-badge" 
                            onClick={(e) => toggleFavorite(e, String(itemId))}
                            aria-label="Save to favorites"
                          >
                            <svg viewBox="0 0 24 24" fill={isFav ? 'var(--accent, #d9653b)' : 'none'} stroke={isFav ? 'var(--accent, #d9653b)' : 'currentColor'} strokeWidth="2" width="16" height="16">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="listing-card-body">
                        <h3>{item.title}</h3>
                        <div className="listing-meta">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                            <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"></path>
                            <circle cx="12" cy="9" r="2.5"></circle>
                          </svg>
                          <span>{item.location || item.city}</span>
                        </div>
                        <div className="rating-row">
                          <span className="rating-stars">★★★★★</span>
                          <span>{Number(rating).toFixed(1)}</span>
                          {item.review_count && (
                            <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '12px' }}>
                              ({item.review_count})
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </section>

          {/* ========================================================
              ===== KAYA CURATED ECOSYSTEM — LUXURY EDITORIAL COLLECTION =====
              ======================================================== */}
          <section className="unique-features-section fade-up" ref={setRevealRef(1)} style={{ padding: '48px 0 24px' }}>
            <div className="section-head" style={{ marginBottom: '32px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(217,101,59,0.08)', border: '1px solid rgba(217,101,59,0.22)', color: 'var(--accent, #d9653b)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
                  </svg>
                  {t('differentiators.badge', 'Only on Kaya.ge')}
                </div>
                <h2 className="section-title" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2rem, 3.4vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
                  {t('differentiators.title', "Georgia's All-in-One Travel Ecosystem")}
                </h2>
                <p className="section-copy" style={{ maxWidth: '640px', fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
                  {t('differentiators.desc', "Beyond ordinary bookings — experience verified hosts, deep local dining, Caucasian travel companions, and bespoke curated routes.")}
                </p>
              </div>
            </div>

            <div className="features-editorial-grid">
              {/* 1. Georgian Moment */}
              <Link href="/georgian-moment" className="editorial-feature-card hover-lift">
                <div className="editorial-card-media">
                  <img
                    src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=540&fit=crop"
                    alt="Georgian Wine & Qvevri Tradition"
                    className="editorial-card-img"
                    loading="lazy"
                  />
                  <span className="editorial-card-tag">Craft &amp; Tradition • 24–72h</span>
                </div>
                <div className="editorial-card-body">
                  <div className="editorial-card-kicker">Immersion</div>
                  <h3 className="editorial-card-title">{t('differentiators.gmTitle', 'Georgian Moment')}</h3>
                  <p className="editorial-card-desc">
                    {t('differentiators.gmDesc', 'Short-notice masterclasses: private polyphonic singing, mountain horse trekking, and clay qvevri cellars.')}
                  </p>
                  <span className="editorial-card-link">{t('learnMore', 'Explore immersions')} &rarr;</span>
                </div>
              </Link>

              {/* 2. Kaya Connect */}
              <Link href="/connect" className="editorial-feature-card hover-lift">
                <div className="editorial-card-media">
                  <img
                    src="/destinations/svaneti.jpg"
                    alt="Svaneti Mountain Guides"
                    className="editorial-card-img"
                    loading="lazy"
                  />
                  <span className="editorial-card-tag">Verified Companions</span>
                </div>
                <div className="editorial-card-body">
                  <div className="editorial-card-kicker">Community &amp; Guides</div>
                  <h3 className="editorial-card-title">{t('differentiators.connectTitle', 'Kaya Connect')}</h3>
                  <p className="editorial-card-desc">
                    {t('differentiators.connectDesc', 'Match with verified local guides, 4x4 alpine drivers, and travelers heading to Kazbegi, Svaneti, or Kakheti.')}
                  </p>
                  <span className="editorial-card-link">{t('learnMore', 'Meet companions')} &rarr;</span>
                </div>
              </Link>

              {/* 3. Bespoke Itineraries */}
              <Link href="/trip-planner" className="editorial-feature-card hover-lift">
                <div className="editorial-card-media">
                  <img
                    src="/destinations/tbilisi.jpg"
                    alt="Historic Tbilisi Architecture"
                    className="editorial-card-img"
                    loading="lazy"
                  />
                  <span className="editorial-card-tag">Bespoke Route Craft</span>
                </div>
                <div className="editorial-card-body">
                  <div className="editorial-card-kicker">Curated Journey</div>
                  <h3 className="editorial-card-title">{t('differentiators.tripTitle', 'Bespoke Itineraries')}</h3>
                  <p className="editorial-card-desc">
                    {t('differentiators.tripDesc', 'Handcrafted routes tailored to your travel tempo, season, and group. From hidden hamlets to wine valleys.')}
                  </p>
                  <span className="editorial-card-link">{t('learnMore', 'Design itinerary')} &rarr;</span>
                </div>
              </Link>

              {/* 4. Georgian Table */}
              <Link href="/georgian-table" className="editorial-feature-card hover-lift">
                <div className="editorial-card-media">
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=540&fit=crop"
                    alt="Georgian Table Supra Feast"
                    className="editorial-card-img"
                    loading="lazy"
                  />
                  <span className="editorial-card-tag">Family Feasts &amp; Cellars</span>
                </div>
                <div className="editorial-card-body">
                  <div className="editorial-card-kicker">Culinary Heritage</div>
                  <h3 className="editorial-card-title">{t('differentiators.gtTitle', 'Georgian Table')}</h3>
                  <p className="editorial-card-desc">
                    {t('differentiators.gtDesc', "Reserve authentic family supras, village qvevri wine cellars, and masterclasses across 12 Georgian regions.")}
                  </p>
                  <span className="editorial-card-link">{t('learnMore', 'Join a supra table')} &rarr;</span>
                </div>
              </Link>
            </div>
          </section>

          {/* ========================================================
              ===== COMPLETE MARKETPLACE CATEGORIES WITH LUXURY SVGs =====
              ===== (FIXED: NO DUPLICATE TITLE) =====
              ======================================================== */}
          <section className="homepage-categories-section fade-up" ref={setRevealRef(2)} style={{ padding: '36px 0 20px' }}>
            <div className="section-head">
              <div>
                <h2 className="section-title">{t('marketplace.title', "Explore Sakartvelo by Category")}</h2>
                <p className="section-copy">{t('marketplace.desc', 'Hotels, city apartments, wine cellars, 4x4 rentals, alpine treks, and thermal spas.')}</p>
              </div>
            </div>

            <div className="categories-grid-7">
              {/* 1. Boutique Hotels */}
              <Link href="/hotels" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                    <path d="M9 10h1m4 0h1M9 14h1m4 0h1M9 18h1m4 0h1" />
                    <path d="M10 21v-3h4v3" />
                  </svg>
                </div>
                <span className="category-tile-title">{t('cat.hotels', 'Boutique Hotels')}</span>
                <span className="category-tile-sub">Hotels & lodges</span>
              </Link>

              {/* 2. City Apartments */}
              <Link href="/apartments" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
                  </svg>
                </div>
                <span className="category-tile-title">{t('cat.apartments', 'City Apartments')}</span>
                <span className="category-tile-sub">City flats</span>
              </Link>

              {/* 3. Restaurants / Supra & Wine */}
              <Link href="/restaurants" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M18 2h-4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    <path d="M16 12v9m-3 0h6" />
                    <path d="M6 3v7a3 3 0 0 0 6 0V3M9 10v11m-3 0h6" />
                  </svg>
                </div>
                <span className="category-tile-title">{t('restaurants', 'Restaurants')}</span>
                <span className="category-tile-sub">Supra & cellars</span>
              </Link>

              {/* 4. 4x4 & Cars */}
              <Link href="/cars" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M5 17h14M3 13h18M5 13l2-6h10l2 6" />
                    <circle cx="7.5" cy="17.5" r="2.5" />
                    <circle cx="16.5" cy="17.5" r="2.5" />
                    <path d="M4 10h16M7 7l-2-2m14 2l2-2" />
                  </svg>
                </div>
                <span className="category-tile-title">4x4 & Cars</span>
                <span className="category-tile-sub">Mountain rentals</span>
              </Link>

              {/* 5. Tours */}
              <Link href="/tours" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                    <path d="M12 11l3 4" />
                  </svg>
                </div>
                <span className="category-tile-title">{t('tours', 'Tours')}</span>
                <span className="category-tile-sub">Treks & trips</span>
              </Link>

              {/* 6. Spas & Baths */}
              <Link href="/salons" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M4 19a8 8 0 0 1 16 0H4z" />
                    <path d="M12 3c-1.5 2-2 3.5-2 5 0 1.1.9 2 2 2s2-.9 2-2c0-1.5-.5-3-2-5z" />
                    <path d="M8 7c-.8 1-1 1.8-1 2.5 0 .6.4 1 1 1s1-.4 1-1c0-.7-.2-1.5-1-2.5zm8 0c-.8 1-1 1.8-1 2.5 0 .6.4 1 1 1s1-.4 1-1c0-.7-.2-1.5-1-2.5z" />
                  </svg>
                </div>
                <span className="category-tile-title">Spas & Baths</span>
                <span className="category-tile-sub">Sulfur baths</span>
              </Link>

              {/* 7. Services */}
              <Link href="/services" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    <circle cx="12" cy="2" r="1" />
                  </svg>
                </div>
                <span className="category-tile-title">Services</span>
                <span className="category-tile-sub">Chefs & guides</span>
              </Link>

              {/* 8. Muse Guide */}
              <Link href="/muse" className="category-tile hover-lift">
                <div className="cat-svg-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M9 7h6m-6 4h4" />
                  </svg>
                </div>
                <span className="category-tile-title">{t('muse', 'Muse Guide')}</span>
                <span className="category-tile-sub">Info & culture</span>
              </Link>
            </div>
          </section>

          {/* Business Host Banner (50 GEL one-time) */}
          <section className="business-cta-banner fade-up" ref={setRevealRef(3)} style={{ padding: '30px 0 60px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #241712 0%, #3a2218 100%)',
              borderRadius: '28px',
              padding: '44px 36px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 20px 50px rgba(36,23,18,0.25)'
            }}>
              <div style={{ maxWidth: '580px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4a373', display: 'block', marginBottom: '8px' }}>
                  {t('hostBanner.badge', 'For Property & Service Hosts')}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', margin: '0 0 10px', color: '#fff' }}>
                  {t('hostBanner.title', 'Host on Kaya.ge — 0% Commission, Flat 50 GEL One-Time')}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>
                  {t('hostBanner.desc', 'Keep 100% of what you earn. Unlike Booking.com (15–20%) or Airbnb (14–18%), Kaya charges a flat monthly subscription. Join Georgia\'s fastest growing travel platform.')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/business/register" className="pill-link" style={{ background: 'linear-gradient(135deg, #d9653b 0%, #c45228 100%)', color: '#fff', padding: '14px 28px', fontSize: '14px', boxShadow: '0 8px 24px -4px rgba(217, 101, 59, 0.5)' }}>
                  {t('hostBanner.cta', 'Register Your Business')} &rarr;
                </Link>
                <Link href="/pricing" style={{ padding: '14px 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                  {t('learnMore', 'Pricing Details')}
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Edge-to-Edge Full Width Footer */}
      <footer className="site-footer fade-up" ref={setRevealRef(4)}>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </div>
            <p className="footer-tagline">{t('footerDesc')}</p>
          </div>
          <div className="footer-links">
            <h4>Stays</h4>
            <Link href="/hotels">Hotels</Link>
            <Link href="/apartments">Apartments</Link>
            <Link href="/search?type=guesthouses">Guesthouses</Link>
            <Link href="/search?type=cabins">Cabins</Link>
          </div>
          <div className="footer-links">
            <h4>Discover</h4>
            <Link href="/muse">Where to go</Link>
            <Link href="/blog">Travel blog</Link>
            <Link href="/about">About us</Link>
            <Link href="/careers">Careers</Link>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <Link href="/tourist/dashboard">Tourist Dashboard</Link>
            <Link href="/dashboard">Affiliate Studio</Link>
            <Link href="/business/dashboard">{t('businessDashboard')}</Link>
            <Link href="/admin">{t('adminPanel')}</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="copyright">
          <span>© {new Date().getFullYear()} Kaya.ge — Discover Georgia</span>
          <span>Built around the Phase 1 brief</span>
        </div>
      </footer>
    </div>
  );
}
