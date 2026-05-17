'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';

const HERO_SLIDES = [
  {
    id: 'tbilisi',
    kicker: 'City Stay',
    eyebrow: 'Featured Stay',
    title: 'STAY IN',
    titleSpan: 'TBILISI',
    copyTitle: 'Discover Tbilisi',
    copyText: 'Ancient history, winding brick streets, cozy sulphur baths, and a vibrant modern culinary scene at the heart of Georgia.',
    image: 'https://kaya-rent.vercel.app/_next/static/media/tbilis.be5749ab.jpeg',
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
    image: 'https://kaya-rent.vercel.app/_next/static/media/kazbegi.721f4951.jpeg',
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
    image: 'https://kaya-rent.vercel.app/_next/static/media/batumi.d3932802.jpeg',
    price: '210 GEL / night',
    location: 'Batumi, Coastline',
    rating: '4.7 rating',
    desc: 'kaya.ge helps you find Batumi stays fast, clearly and without extra steps.'
  }
];

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeSlide, setActiveSlide] = useState(1); // default Kazbegi to match target site load
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  // Monitor scroll for nav styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className="site-shell">
      <div className="shell">
        <div className="homepage-shell">
          
          {/* Header / Sticky Nav */}
          <div 
            className="sticky-nav-shell visible" 
            style={{ 
              top: scrolled ? '16px' : '54px', 
              transform: 'translateX(-50%)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
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
                    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                    <path d="M15 5.764v15"></path>
                    <path d="M9 3.236v15"></path>
                  </svg>
                  Tours
                </Link>
                <Link href="/guides" className="nav-link-button">
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
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
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

          {/* Mobile Hero Banner Carousel (Visual Parity) */}
          <div className="mobile-hero-banner-carousel" aria-live="polite" aria-label="Platform highlights">
            <div className="mobile-hero-banner-carousel-track">
              <div className="hero-side-card-link">
                <div className="hero-side-card hero-side-card-listing" style={{ position: 'relative' }}>
                  <img 
                    alt={slide.copyTitle}
                    loading="eager"
                    className="hero-side-card-image" 
                    style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, objectFit: 'cover', zIndex: 0 }}
                    src={slide.image}
                  />
                  <div className="hero-side-card-listing-overlay" style={{ zIndex: 1 }}></div>
                  <div className="hero-side-card-listing-rail" aria-hidden="true" style={{ zIndex: 2 }}>
                    <span className={activeSlide === 0 ? 'active' : ''}></span>
                    <span className={activeSlide === 1 ? 'active' : ''}></span>
                    <span className={activeSlide === 2 ? 'active' : ''}></span>
                  </div>
                  <div className="hero-side-card-listing-top" style={{ zIndex: 2 }}>
                    <span className="hero-side-eyebrow">{slide.eyebrow}</span>
                    <span className="hero-side-price">{slide.price}</span>
                  </div>
                  <div className="hero-side-card-listing-bottom" style={{ zIndex: 2 }}>
                    <span className="hero-side-card-kicker">{slide.location}</span>
                    <h3>{slide.copyTitle}</h3>
                    <p>{slide.desc}</p>
                    <div className="hero-side-listing-footer">
                      <strong>{slide.rating}</strong>
                      <small>Open stay</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mobile-hero-banner-carousel-dots" role="tablist" aria-label="Platform highlights">
              {HERO_SLIDES.map((s, idx) => (
                <button 
                  key={s.id}
                  type="button" 
                  role="tab" 
                  aria-selected={idx === activeSlide} 
                  aria-label={s.copyTitle} 
                  className={`mobile-hero-banner-carousel-dot ${idx === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                ></button>
              ))}
            </div>
          </div>

          {/* Desktop Hero Stage */}
          <div className="hero-stage">
            {/* Left side card */}
            <aside className="hero-side-banner hero-side-banner-left" aria-live="polite" aria-label="Guest highlights">
              <div className="hero-side-card-link">
                <div className="hero-side-card hero-side-card-listing">
                  <img 
                    alt={HERO_SLIDES[2].copyTitle} 
                    loading="lazy" 
                    className="hero-side-card-image" 
                    style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, objectFit: 'cover' }}
                    src={HERO_SLIDES[2].image}
                  />
                  <div className="hero-side-card-listing-overlay"></div>
                  <div className="hero-side-card-listing-rail" aria-hidden="true"><span></span><span></span><span></span></div>
                  <div className="hero-side-card-listing-top">
                    <span className="hero-side-eyebrow">Featured Stay</span>
                    <span className="hero-side-price">{HERO_SLIDES[2].price}</span>
                  </div>
                  <div className="hero-side-card-listing-bottom">
                    <span className="hero-side-card-kicker">{HERO_SLIDES[2].location}</span>
                    <h3>{HERO_SLIDES[2].copyTitle}</h3>
                    <p>{HERO_SLIDES[2].copyText}</p>
                    <div className="hero-side-listing-footer">
                      <strong>{HERO_SLIDES[2].rating}</strong>
                      <small>See listing</small>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Stage Carousel */}
            <section className="hero">
              <div className="hero-media">
                <img 
                  alt={slide.copyTitle} 
                  fetchPriority="high" 
                  className="hero-media-image" 
                  style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, objectFit: 'cover' }}
                  src={slide.image}
                />
              </div>
              <div className="hero-mist"></div>
              
              <div className="hero-content">
                <div className="hero-grid">
                  <div>
                    <h1 className="display hero-title">
                      {slide.title}<span>{slide.titleSpan}</span>
                    </h1>
                  </div>
                  <div className="hero-copy" style={{ transform: 'translate(-80px, -84px)' }}>
                    <h2>{slide.copyTitle}</h2>
                    <p>{slide.copyText}</p>
                  </div>
                </div>
              </div>

              {/* Interaction Chips */}
              <div className="hero-chips" aria-label="Hero slides">
                {HERO_SLIDES.map((s, idx) => (
                  <button 
                    key={s.id}
                    type="button" 
                    className={`hero-chip ${idx === activeSlide ? 'active' : ''}`}
                    aria-label={`Discover ${s.copyTitle}`}
                    onClick={() => setActiveSlide(idx)}
                  >
                    <img 
                      alt={s.copyTitle} 
                      loading="lazy" 
                      className="hero-chip-image" 
                      style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, objectFit: 'cover' }}
                      src={s.image}
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* Right side banner */}
            <aside className="hero-side-banner hero-side-banner-right" aria-live="polite" aria-label="Platform highlights">
              <div className="hero-side-card-link">
                <div className="hero-side-card hero-side-card-tip">
                  <div className="hero-side-card-stack">
                    <div className="hero-side-visual">
                      <div className="hero-side-visual-image">
                        <img 
                          alt="Lock airport transfer before peak weekends" 
                          loading="lazy" 
                          className="hero-side-visual-image-media" 
                          style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, objectFit: 'cover' }}
                          src={HERO_SLIDES[2].image}
                        />
                      </div>
                    </div>
                    <div className="hero-side-card-copy">
                      <span className="hero-side-eyebrow">Travel Tip</span>
                      <h3>Lock airport transfer before peak weekends</h3>
                      <p>If your first stop is the coast, plan the handoff early so the Batumi arrival stays smooth from airport to check-in.</p>
                    </div>
                    <div className="hero-side-card-footer">
                      <strong>Best booked 24h ahead</strong>
                      <small>Especially helpful in Tbilisi and Batumi</small>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Best & Most Popular Offers */}
          <section className="section homepage-featured-section">
            <div className="section-head homepage-empty-head">
              <div>
                <h2 className="section-title">Best &amp; Most Popular Offers</h2>
              </div>
            </div>
            
            <article className="dashboard-stat-card empty-state-card empty-state-card-compact homepage-empty-card">
              <strong>First live offers will appear here</strong>
              <p>This section shows only real listings coming from the database.</p>
            </article>
          </section>

          {/* Footer */}
          <footer className="footer">
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
            <Link className="mobile-bottom-nav-item active" aria-current="page" href="/">
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
