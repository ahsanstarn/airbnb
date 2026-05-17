'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/lang-context';

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
  const { lang: currentLang, setLang, t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langOpen && !(e.target as HTMLElement).closest('.nav-right')) setLangOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [langOpen]);

  const slide = HERO_SLIDES[activeSlide];
  const tTitle = t(slide.id + '_title');
  const tSpan = t(slide.id + '_span');
  const tCopyTitle = t(slide.id + '_copyTitle');
  const tCopyText = t(slide.id + '_copyText');

  const slideData = (idx: number) => {
    const s = HERO_SLIDES[idx];
    return { title: t(s.id + '_title'), span: t(s.id + '_span'), copyTitle: t(s.id + '_copyTitle'), copyText: t(s.id + '_copyText'), image: s.image };
  };

  return (
    <div className="site-shell">
      <div className="shell">
        <div className="homepage-shell">
          
          {/* Sticky Nav */}
          <div className={`sticky-nav-shell ${scrolled ? 'visible' : ''}`} style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <nav className="nav nav-sticky-bar" style={{ transform: scrolled ? 'scale(1)' : 'scale(1.08)' }}>
              <Link className="nav-brand" href="/">
                <span className="brandmark-dot"></span>
                <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
              </Link>
              
              <div className="nav-links">
                <Link href="/offers" className="nav-link-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                  {t('offers')}
                </Link>
                <Link href="/tours" className="nav-link-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
                  {t('tours')}
                </Link>
                <Link href="/guides" className="nav-link-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>
                  {t('guides')}
                </Link>
              </div>
              
              <div className="nav-spacer"></div>
              
              <div className="nav-right" style={{ position: 'relative' }}>
                <button type="button" className="nav-icon nav-action-btn" onClick={() => setLangOpen(!langOpen)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg>
                  <span style={{ fontSize: '10px', marginLeft: '2px', fontWeight: 'bold' }}>{currentLang}</span>
                </button>
                
                {langOpen && (
                  <div className="nav-dropdown" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0 }}>
                    <button className="nav-dropdown-button" onClick={() => { setLang('EN'); setLangOpen(false); }}>🇬🇧 English (GEL)</button>
                    <button className="nav-dropdown-button" onClick={() => { setLang('KA'); setLangOpen(false); }}>🇬🇪 ქართული (GEL)</button>
                    <button className="nav-dropdown-button" onClick={() => { setLang('RU'); setLangOpen(false); }}>🇷🇺 Русский (GEL)</button>
                  </div>
                )}

                <button type="button" className="nav-icon nav-action-btn nav-theme-icon" onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z"/></svg>
                  )}
                </button>
                
                <Link className="nav-auth-link" href="/login">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                  {t('login')}
                </Link>
              </div>
            </nav>
          </div>

          {/* Hero Stage - 3 Column Layout */}
          <div className="hero-stage">
            {/* Left Side Card */}
            <div className="hero-side-banner hero-side-banner-left">
              <Link href="/offers" className="hero-side-card-link">
                <div className="hero-side-card hero-side-card-listing">
                  <div className="hero-side-card-listing-overlay" style={{ backgroundImage: `url(${HERO_SLIDES[2].image})` }}></div>
                  <div className="hero-side-card-listing-rail">
                    <div className="hero-side-card-listing-top">
                      <span className="hero-side-card-kicker">{HERO_SLIDES[2].kicker}</span>
                      <span className="hero-side-price">{HERO_SLIDES[2].price}</span>
                    </div>
                    <div className="hero-side-card-listing-bottom">
                      <h3>{t('batumi_copyTitle')}</h3>
                      <p>{t('batumi_copyText').slice(0, 80)}...</p>
                    </div>
                    <div className="hero-side-listing-footer">
                      <span>{HERO_SLIDES[2].rating}</span>
                      <span>{t('seeListing')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Center Hero */}
            <div className="hero" ref={heroRef}>
              <div className="hero-media" style={{ backgroundImage: `url(${slide.image})` }}></div>
              <div className="hero-mist"></div>
              <div className="hero-content">
                <div className="hero-grid">
                  <div>
                    <h1 className="display hero-title">
                      {tTitle}<span>{tSpan}</span>
                    </h1>
                  </div>
                  <div className="hero-copy">
                    <h2>{tCopyTitle}</h2>
                    <p>{tCopyText}</p>
                  </div>
                </div>
              </div>
              <div className="hero-chips">
                {HERO_SLIDES.map((s, i) => (
                  <button key={s.id} className={`hero-chip ${i === activeSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${s.image})` }} onClick={() => setActiveSlide(i)} aria-label={s.copyTitle} />
                ))}
              </div>
            </div>

            {/* Right Side Card - Travel Tip */}
            <div className="hero-side-banner hero-side-banner-right">
              <div className="hero-side-card hero-side-card-tip">
                <div className="hero-side-card-stack">
                  <div className="hero-side-visual">
                    <div className="hero-side-visual-image" style={{ backgroundImage: `url(${HERO_SLIDES[2].image})` }}></div>
                  </div>
                  <div className="hero-side-card-copy">
                    <span className="hero-side-eyebrow">{t('travelTip')}</span>
                    <h3>{t('lockAirport')}</h3>
                    <p>{t('lockAirportDesc')}</p>
                  </div>
                  <div className="hero-side-card-footer">
                    <span>{t('bestBooked')}</span>
                    <span>{t('helpfulTbilisiBatumi')}</span>
                  </div>
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
                  <div key={s.id} className="hero-side-card hero-side-card-listing" style={{ minWidth: '280px', scrollSnapAlign: 'start' }} onClick={() => setActiveSlide(i)}>
                    <div className="hero-side-card-listing-overlay" style={{ backgroundImage: `url(${sd.image})` }}></div>
                    <div className="hero-side-card-listing-rail">
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

          {/* Featured Offers Section */}
          <section className="homepage-featured-section">
            <div className="section-head">
              <div>
                <h2 className="section-title">{t('popularOffers')}</h2>
                <p className="section-copy">{t('offersDesc')}</p>
              </div>
            </div>
            <div className="homepage-empty-card">
              <strong>{t('noOffersYet')}</strong>
              <p>{t('noOffersDesc')}</p>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brandmark">
                  <span className="brandmark-dot"></span>
                  <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
                </div>
                <p className="footer-tagline">{t('footerDesc')}</p>
              </div>
              <div>
                <h4>{t('offers')}</h4>
                <ul>
                  <li><Link href="/offers">{t('offers')}</Link></li>
                  <li><Link href="/restaurants">{t('restaurants')}</Link></li>
                  <li><Link href="/tours">{t('tours')}</Link></li>
                  <li><Link href="/muse">{t('muse')}</Link></li>
                </ul>
              </div>
              <div>
                <h4>{t('company')}</h4>
                <ul>
                  <li><Link href="/about">{t('about')}</Link></li>
                  <li><Link href="/contact">{t('contact')}</Link></li>
                  <li><Link href="/blog">{t('blog')}</Link></li>
                </ul>
              </div>
              <div>
                <h4>{t('platform')}</h4>
                <ul>
                  <li><Link href="/dashboard">{t('touristDashboard')}</Link></li>
                  <li><Link href="/business/dashboard">{t('businessDashboard')}</Link></li>
                  <li><Link href="/admin">{t('adminPanel')}</Link></li>
                </ul>
              </div>
            </div>
            <div className="copyright">
              <span>© 2026 Kaya.ge — Discover Georgia</span>
              <span>Built around the Phase 1 brief</span>
            </div>
          </footer>

        </div>
      </div>
      
      {/* Mobile Top Bar */}
      <header className="mobile-guest-topbar">
        <Link className="mobile-guest-topbar-brand" href="/">
          <span className="brandmark-dot"></span>
          <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
        </Link>
        <div className="mobile-guest-topbar-actions">
          <button type="button" className="mobile-guest-topbar-btn" onClick={() => setLangOpen(!langOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg>
          </button>
          <button type="button" className="mobile-guest-topbar-btn" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <ul className="mobile-bottom-nav-list" style={{ '--mobile-bottom-nav-columns': 5 } as React.CSSProperties}>
          <li>
            <Link className="mobile-bottom-nav-item active" href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              <span>{t('homepage')}</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item" href="/offers">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
              <span>{t('offers')}</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item" href="/tours">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
              <span>{t('tours')}</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item" href="/guides">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>
              <span>{t('guides')}</span>
            </Link>
          </li>
          <li>
            <Link className="mobile-bottom-nav-item" href="/login">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              <span>{t('login')}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
