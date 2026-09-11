'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/lang-context';
import { SEED_LISTINGS } from '@/lib/seed-data';

const HERO_SLIDES = [
  {
    id: 'tbilisi',
    kicker: 'City Stay',
    eyebrow: 'Featured Stay',
    title: 'STAY IN',
    titleSpan: 'TBILISI',
    copyTitle: 'Discover Tbilisi',
    copyText: 'Ancient history, winding brick streets, cozy sulphur baths, and a vibrant modern culinary scene at the heart of Georgia.',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
    price: '180 GEL / night',
    location: 'Tbilisi, Old Town',
    rating: '4.9 rating',
    desc: 'kaya.ge helps you find Tbilisi stays fast, clearly and without extra steps.'
  },
  {
    id: 'kazbegi',
    kicker: 'Mountain Escape',
    eyebrow: 'Featured Stay',
    title: 'BREATHE IN',
    titleSpan: 'KAZBEGI',
    copyTitle: 'Discover Kazbegi',
    copyText: 'Snowline views, dramatic ridges, ancient church silhouettes and crisp alpine air make this the ultimate contrast to the capital.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    price: '280 GEL / night',
    location: 'Kazbegi, Gergeti',
    rating: '4.8 rating',
    desc: 'kaya.ge helps you find Kazbegi stays fast, clearly and without extra steps.'
  },
  {
    id: 'batumi',
    kicker: 'Sea View Stay',
    eyebrow: 'Featured Stay',
    title: 'WAVES OF',
    titleSpan: 'BATUMI',
    copyTitle: 'Discover Batumi',
    copyText: 'A light-filled stay framed around the promenade, sea-facing mornings, magnetic sunsets, and easy evening walks along the coast.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    price: '210 GEL / night',
    location: 'Batumi, Coastline',
    rating: '4.7 rating',
    desc: 'kaya.ge helps you find Batumi stays fast, clearly and without extra steps.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: '✨' },
  { id: 'hotels', label: 'Boutique Hotels', icon: '🏨' },
  { id: 'apartments', label: 'City Apartments', icon: '🏢' },
  { id: 'guesthouses', label: 'Family Guesthouses', icon: '🏡' },
  { id: 'cabins', label: 'Mountain Cabins', icon: '🏔️' },
  { id: 'villas', label: 'Wine Villas', icon: '🍷' },
];

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(1);
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
    if (searchCity) params.append('city', searchCity);
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

  const slide = HERO_SLIDES[activeSlide];
  const tTitle = t(slide.id + '_title');
  const tSpan = t(slide.id + '_span');
  const tCopyTitle = t(slide.id + '_copyTitle');
  const tCopyText = t(slide.id + '_copyText');

  const slideData = (idx: number) => {
    const s = HERO_SLIDES[idx];
    return { title: t(s.id + '_title'), span: t(s.id + '_span'), copyTitle: t(s.id + '_copyTitle'), copyText: t(s.id + '_copyText'), image: s.image };
  };

  const setRevealRef = (i: number) => (el: HTMLElement | null) => { revealRefs.current[i] = el; };

  const filteredListings = selectedCategory === 'all'
    ? listings
    : listings.filter(l => l.category === selectedCategory);

  return (
    <div className="site-shell">
      <div className="shell">
        <div className="homepage-shell">

          {/* Hero Stage */}
          <div className="hero-stage depth-scene">
            <div className="hero mouse-tilt-hero" ref={heroRef}>
              <div className="hero-media active" style={{ backgroundImage: `url(${slide.image})` }}></div>
              <div className="hero-mist depth-mid"></div>
              <div className="hero-content depth-fg" style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="hero-title-area">
                    <h1 className="hero-title animate-blur-in" style={{ perspective: '800px' }}>
                      {tTitle}<span className="animate-slide-up animate-delay-2">{tSpan}</span>
                    </h1>
                    <div className="hero-copy animate-slide-up animate-delay-3" style={{ maxWidth: '520px' }}>
                      <h2>{tCopyTitle}</h2>
                      <p>{tCopyText}</p>
                    </div>
                  </div>
                  
                  {/* Right side circular thumbnails */}
                  <div className="hero-thumbnails">
                    {HERO_SLIDES.map((s, i) => (
                      <div 
                        key={s.id} 
                        className={`hero-thumb ${i === activeSlide ? 'active' : ''}`} 
                        style={{ backgroundImage: `url(${s.image})` }} 
                        onClick={() => setActiveSlide(i)} 
                        aria-label={s.copyTitle}
                      />
                    ))}
                  </div>
                </div>

                {/* Airbnb-style Floating Glass Search Bar */}
                <div className="hero-search-container animate-slide-up animate-delay-4">
                  <form onSubmit={handleSearch} className="hero-search-glass">
                    <div className="search-field-unit">
                      <label>Where</label>
                      <input 
                        type="text" 
                        placeholder="Tbilisi, Batumi, Kazbegi..." 
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                      />
                    </div>
                    <div className="search-divider-v"></div>
                    <div className="search-field-unit">
                      <label>Check In</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div className="search-divider-v"></div>
                    <div className="search-field-unit">
                      <label>Check Out</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                    <div className="search-divider-v"></div>
                    <div className="search-field-unit">
                      <label>Guests</label>
                      <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                        <option value="1">1 guest</option>
                        <option value="2">2 guests</option>
                        <option value="3">3 guests</option>
                        <option value="4">4+ guests</option>
                      </select>
                    </div>
                    <button type="submit" className="hero-search-submit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                      Search
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>

          {/* Mobile Hero Carousel */}
          <div className="mobile-hero-banner-carousel">
            <div className="mobile-hero-banner-carousel-track">
              {HERO_SLIDES.map((s, i) => {
                const sd = slideData(i);
                return (
                  <div key={s.id} className="hero-side-card hero-side-card-listing card-3d-glow" style={{ minWidth: '280px', scrollSnapAlign: 'start' }} onClick={() => setActiveSlide(i)}>
                    <div className="hero-side-card-listing-overlay depth-bg" style={{ backgroundImage: `url(${sd.image})` }}></div>
                    <div className="hero-side-card-listing-rail depth-fg">
                      <div className="hero-side-card-listing-top">
                        <span className="hero-side-card-kicker">{s.kicker}</span>
                        <span className="hero-side-price">{s.price}</span>
                      </div>
                      <div className="hero-side-card-listing-bottom">
                        <h3>{sd.copyTitle}</h3>
                        <p>{sd.copyText.slice(0, 60)}...</p>
                      </div>
                      <div className="hero-side-listing-footer">
                        <span>{s.rating}</span>
                        <span>{t('seeListing')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mobile-hero-banner-carousel-dot">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} className={i === activeSlide ? 'active' : ''} onClick={() => setActiveSlide(i)} />
              ))}
            </div>
          </div>

          {/* Featured Offers Section with Category Ribbon and Listings Grid */}
          <section className="homepage-featured-section fade-up" ref={setRevealRef(0)}>
            <div className="section-head">
              <div>
                <h2 className="section-title">{t('popularOffers')}</h2>
                <p className="section-copy">Handpicked boutique lofts, mountain cabins, family guesthouses, and wine villas across Georgia.</p>
              </div>
              <Link href="/search" className="pill-link">
                View all stays &rarr;
              </Link>
            </div>

            {/* Category Ribbon */}
            <div className="category-ribbon">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Listings Grid */}
            <div className="card-grid">
              {filteredListings.slice(0, 9).map((item, idx) => {
                const itemId = item._id || item.id || `seed-${idx}`;
                const coverImage = (Array.isArray(item.images) && item.images[0]) || item.img || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop';
                const isFav = favorites.includes(String(itemId));
                const price = item.price_per_night || item.price || 180;
                const rating = item.overall_rating || item.rating || 4.9;

                return (
                  <Link href={`/listing/${itemId}`} key={itemId} className="listing-card hover-lift">
                    <div className="listing-card-media" style={{ backgroundImage: `url(${coverImage})` }}>
                      <div className="listing-card-top">
                        <span className="price-tag">{price} GEL / night</span>
                        <button 
                          type="button" 
                          className="icon-badge" 
                          onClick={(e) => toggleFavorite(e, String(itemId))}
                          aria-label="Save to favorites"
                        >
                          <svg viewBox="0 0 24 24" fill={isFav ? 'var(--accent, #c22c57)' : 'none'} stroke={isFav ? 'var(--accent, #c22c57)' : 'currentColor'} strokeWidth="2" width="16" height="16">
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
              })}
            </div>
          </section>

          {/* Footer */}
          <footer className="footer fade-up" ref={setRevealRef(1)}>
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
                <Link href="/dashboard">{t('touristDashboard')}</Link>
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
      </div>
    </div>
  );
}
