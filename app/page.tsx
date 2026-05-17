'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/lang-context';
import { useTheme } from '@/lib/theme-context';

const LANG_FLAGS: Record<string, string> = { EN: '🇬🇧', KA: '🇬🇪', RU: '🇷🇺' };
const LANGS = ['EN', 'KA', 'RU'] as const;
const PLACEHOLDER_LISTINGS = [
  { id: 1, title: 'Old Town Courtyard', location: 'Tbilisi, Old Town', price: 300, rating: 4.8, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=70' },
  { id: 2, title: 'Kakheti Vineyard House', location: 'Signagi, Kakheti', price: 240, rating: 4.9, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=70' },
  { id: 3, title: 'Batumi Sea View Loft', location: 'Batumi, Coastline', price: 210, rating: 4.7, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=70' },
  { id: 4, title: 'Kazbegi Ridge Cabin', location: 'Stepantsminda', price: 420, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=70' },
];

const HERO_SLIDES = [
  { name: 'Tbilisi', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=70' },
  { name: 'Kakheti', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70' },
  { name: 'Batumi', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70' },
];

const CATEGORIES = [
  { label: 'Hotels', title: 'Hotels', link: '/hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=70' },
  { label: 'Apartments', title: 'Apartments', link: '/apartments', image: 'https://images.unsplash.com/photo-1560448204-603bcece0ebd?auto=format&fit=crop&w=600&q=70' },
  { label: 'Guesthouses', title: 'Guesthouses', link: '/search?type=guesthouses', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70' },
  { label: 'Cabins', title: 'Cabins', link: '/search?type=cabins', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=70' },
  { label: 'Resorts', title: 'Resorts', link: '/search?type=resorts', image: 'https://images.unsplash.com/photo-1571893544028-06b07af6dade?auto=format&fit=crop&w=600&q=70' },
  { label: 'Villas', title: 'Villas', link: '/search?type=villas', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=70' },
];

export default function Home() {
  const router = useRouter();
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [listings, setListings] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/listings?sort=recommended&limit=4')
      .then(r => r.json())
      .then(d => { if (d.listings?.length) setListings(d.listings); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 60}px, ${e.clientY - 60}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Visitor tracking ping
  useEffect(() => {
    const getVisitorId = () => {
      let id = localStorage.getItem('kaya_visitor_id');
      if (!id) {
        id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('kaya_visitor_id', id);
      }
      return id;
    };
    const ping = () => {
      fetch('/api/analytics/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: getVisitorId(),
          page_path: window.location.pathname,
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 60000);
    return () => clearInterval(interval);
  }, []);

  const display = listings.length > 0 ? listings : PLACEHOLDER_LISTINGS;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/search');
  };

  return (
    <div className="site-shell">
      <div ref={cursorRef} className="cursor-glow" />
      <div className="shell">
        {/* Navbar */}
        <div ref={shellRef} className="sticky-nav-shell visible">
          <nav ref={navRef} className="nav nav-sticky-bar">
            <Link href="/" className="nav-brand" style={{ color: 'var(--text-primary)' }}>
              <span className="brandmark-dot" style={{ background: 'var(--text-primary)', boxShadow: '0 0 0 4px var(--border-light)' }}></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </Link>
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
            <div className="nav-links">
              <Link href="/klara">{t('nav.klara')}</Link>
              <Link href="/search">{t('nav.visitors')}</Link>
              <Link href="/hotels">{t('nav.stays')}</Link>
              <Link href="/georgian-moment">{t('nav.experiences')}</Link>
              <Link href="/georgian-table">{t('nav.food')}</Link>
              <Link href="/shop">{t('nav.shop')}</Link>
              <Link href="/agency">{t('nav.agency')}</Link>
              <Link href="/connect">{t('nav.connect')}</Link>
              <Link href="/muse">{t('nav.guide')}</Link>
              <Link href="/contact">{t('nav.contact')}</Link>
            </div>
            <div className="nav-spacer"></div>
            <div className="nav-right" style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(!langOpen)} style={{ padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'rgba(255,251,246,.7)', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                {lang}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10" style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="M6 9l6 6 6-6"></path></svg>
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '6px', padding: '6px', borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(24px)', boxShadow: '0 8px 24px rgba(0,0,0,.08)', zIndex: 100, minWidth: '140px' }}>
                  {LANGS.map(code => (
                    <button key={code} onClick={() => { setLang(code); setLangOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', borderRadius: '10px', border: '0', background: lang === code ? 'var(--border-light)' : 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: lang === code ? 700 : 500, color: 'var(--text-primary)', textAlign: 'left', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-light)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = lang === code ? 'var(--border-light)' : 'transparent'; }}>
                      <span>{LANG_FLAGS[code]}</span> {t(`lang.${code.toLowerCase()}`)} {lang === code && <span style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleTheme} 
              className="nav-icon" 
              aria-label="Toggle theme"
              style={{ width: '34px', height: '34px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '999px', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <Link href="/login" style={{ color: 'var(--text-primary)' }}>Become a host</Link>
            <button onClick={() => { const t = localStorage.getItem('kaya_token'); if (t) router.push('/dashboard'); else router.push('/login'); }} className="nav-icon" aria-label="Account" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path></svg>
            </button>
            </div>
          </nav>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
          <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
          <Link href="/klara" onClick={() => setMobileNavOpen(false)}>{t('nav.klara')}</Link>
          <Link href="/search" onClick={() => setMobileNavOpen(false)}>{t('nav.visitors')}</Link>
          <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>{t('nav.stays')}</Link>
          <Link href="/georgian-moment" onClick={() => setMobileNavOpen(false)}>✨ {t('nav.experiences')}</Link>
          <Link href="/georgian-table" onClick={() => setMobileNavOpen(false)}>🍽️ {t('nav.food')}</Link>
          <Link href="/shop" onClick={() => setMobileNavOpen(false)}>🛍️ {t('nav.shop')}</Link>
          <Link href="/agency" onClick={() => setMobileNavOpen(false)}>🚀 {t('nav.agency')}</Link>
          <Link href="/connect" onClick={() => setMobileNavOpen(false)}>🤝 {t('nav.connect')}</Link>
          <Link href="/trip-planner" onClick={() => setMobileNavOpen(false)}>🧠 {t('trip.title')}</Link>
          <Link href="/muse" onClick={() => setMobileNavOpen(false)}>{t('footer.whereToGo')}</Link>
          <Link href="/contact" onClick={() => setMobileNavOpen(false)}>{t('nav.contact')}</Link>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', margin: '8px 0', padding: '8px 0' }}>
            {LANGS.map(code => (
              <button key={code} onClick={() => { setLang(code); setMobileNavOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 24px', border: '0', background: 'transparent', color: '#fff8ef', fontSize: '14px', fontWeight: lang === code ? 700 : 400, cursor: 'pointer', textAlign: 'left' }}>
                {LANG_FLAGS[code]} {t(`lang.${code.toLowerCase()}`)} {lang === code && ' ✓'}
              </button>
            ))}
          </div>
          <Link href="/login" onClick={() => setMobileNavOpen(false)}>{t('nav.becomeHost')}</Link>
        </div>

        {/* Hero */}
        <section className="hero animate-hero">
          <div className="hero-media" style={{ backgroundImage: `url(${HERO_SLIDES[activeSlide].image})` }}></div>
          <div className="hero-mist"></div>
          <div className="hero-content">
            <div className="hero-grid">
              <div>
                <h1 className="display hero-title animate-hero-title">
                  FIND PLACE TO<span>STAY</span>
                </h1>
              </div>
              <div className="hero-copy animate-hero-sub" style={{ transform: 'translate(-80px, -84px)' }}>
                <h2>{t('hero.title')}</h2>
                <p>{t('hero.subtitle')}</p>
              </div>
            </div>
          </div>
          <div className="hero-chips" aria-label="Hero slides">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.name}
                className={`hero-chip animate-float ${i === activeSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-label={`Discover ${slide.name}`}
                onClick={() => setActiveSlide(i)}
              />
            ))}
          </div>
          <form className="search-bar animate-hero-search" onSubmit={handleSearch}>
            <button type="button" className="search-field search-field-button" onClick={() => router.push('/search')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>
              <div className="search-text"><strong>Tbilisi</strong><span>{t('hero.searchPlaceholder')}</span></div>
            </button>
            <button type="button" className="search-field search-field-button" onClick={() => router.push('/search')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 3v4M16 3v4"></path></svg>
              <div className="search-text"><strong>Check in</strong><span>Add date</span></div>
            </button>
            <button type="button" className="search-field search-field-button" onClick={() => router.push('/search')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 3v4M16 3v4"></path></svg>
              <div className="search-text"><strong>Check out</strong><span>Add date</span></div>
            </button>
            <button type="button" className="search-field search-field-button" onClick={() => router.push('/search')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="9" cy="9" r="3.5"></circle><path d="M2.5 20c.8-3.4 3.5-5 6.5-5s5.7 1.6 6.5 5"></path><circle cx="17" cy="8" r="2.5"></circle><path d="M15 14c2-.5 4 .5 5 2.5"></path></svg>
              <div className="search-text"><strong>Visitors</strong><span>2 guests</span></div>
            </button>
            <button className="search-action" type="submit" aria-label={t('hero.search')}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"></path></svg>
            </button>
          </form>
        </section>

        {/* Recommended Places */}
        <section className="section animate-section">
          <div className="section-head">
            <div>
              <h2 className="section-title">{t('recommended.title')}</h2>
            </div>
            <Link className="pill-link" href="/search">{t('seeAll')}</Link>
          </div>
          <div className="card-grid">
            {display.slice(0, 4).map((listing: any) => (
              <Link key={listing.id} href={`/listing/${listing.id}`} className="listing-card animate-card hover-lift">
                <div
                  className="listing-card-media"
                  style={{
                    backgroundImage: `url(${listing.images?.[0] || listing.image})`,
                  }}
                />
                <div className="listing-card-top">
                  <span className="price-tag">{listing.price_per_night || listing.price} GEL / night</span>
                  <span className="icon-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 21s-7-4.5-9.3-9.2C1 8.5 3 5 6.5 5 8.7 5 10.5 6 12 7.7 13.5 6 15.3 5 17.5 5 21 5 23 8.5 21.3 11.8 19 16.5 12 21 12 21Z"></path></svg>
                  </span>
                </div>
                <div className="listing-card-body">
                  <h3>{listing.title}</h3>
                  <div className="listing-meta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11"><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>
                    {listing.location}
                  </div>
                  <div className="rating-row">
                    <span className="rating-stars">★★★★★</span>{listing.overall_rating?.toFixed(1) || listing.rating}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="section-head">
            <div>
              <h2 className="section-title">{t('categories.title')}</h2>
            </div>
            <Link className="pill-link" href="/search">{t('seeAll')}</Link>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.link} className="category-card hover-lift" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.55)), url(${cat.image})` }}>
                <small>{cat.label}</small>
                <h3>{cat.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Phase 2 Features */}
        <section className="section animate-section">
          <div className="section-head">
            <div>
              <h2 className="section-title">{t('features.title')}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '4px 0 0' }}>{t('features.subtitle')}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '8px' }}>
            {[
              { href: '/georgian-moment', emoji: '✨', tTitle: 'features.gmTitle', tDesc: 'features.gmDesc' },
              { href: '/georgian-table', emoji: '🍽️', tTitle: 'features.gtTitle', tDesc: 'features.gtDesc' },
              { href: '/shop', emoji: '🛍️', tTitle: 'features.shopTitle', tDesc: 'features.shopDesc' },
              { href: '/agency', emoji: '🚀', tTitle: 'features.agencyTitle', tDesc: 'features.agencyDesc' },
              { href: '/connect', emoji: '🤝', tTitle: 'features.connectTitle', tDesc: 'features.connectDesc' },
              { href: '/trip-planner', emoji: '🧠', tTitle: 'features.tripTitle', tDesc: 'features.tripDesc' },
            ].map(f => (
              <Link key={f.href} href={f.href} className="glass-card hover-lift" style={{ padding: '28px 24px', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>{t(f.tTitle)}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{t(f.tDesc)}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Muse */}
        <section className="section animate-section">
          <div className="muse-grid">
            <div className="muse-visual animate-slide-right hover-glow"></div>
            <div className="muse-copy animate-slide-left">
              <p className="section-kicker">Kaya Muse</p>
              <h2>{t('muse.title')}</h2>
              <p>{t('muse.desc')}</p>
              <Link className="btn-primary" href="/muse">
                {t('muse.cta')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo" style={{ color: 'var(--text-primary)' }}>
                <span className="brandmark-dot" style={{ background: 'var(--text-primary)', boxShadow: '0 0 0 4px var(--border-light)' }}></span>
                <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
              </div>
              <p className="footer-tagline">{t('footer.tagline')}</p>
            </div>
            <div className="footer-links">
              <h4>{t('footer.stays')}</h4>
              <Link href="/hotels">{t('footer.hotels')}</Link>
              <Link href="/apartments">{t('footer.apartments')}</Link>
              <Link href="/search?type=guesthouses">{t('footer.guesthouses')}</Link>
              <Link href="/search?type=cabins">{t('footer.cabins')}</Link>
            </div>
            <div className="footer-links">
              <h4>{t('footer.discover')}</h4>
              <Link href="/muse">{t('footer.whereToGo')}</Link>
              <Link href="/georgian-moment">{t('footer.georgianMoment')}</Link>
              <Link href="/georgian-table">{t('footer.georgianTable')}</Link>
              <Link href="/shop">{t('footer.kayaSupply')}</Link>
              <Link href="/agency">{t('footer.kayaAgency')}</Link>
              <Link href="/trip-planner">{t('footer.tripPlanner')}</Link>
              <Link href="/connect">{t('footer.kayaConnect')}</Link>
            </div>
            <div className="footer-links">
              <h4>{t('footer.support')}</h4>
              <Link href="/contact">{t('footer.contact')}</Link>
              <Link href="/privacy">{t('footer.privacy')}</Link>
              <Link href="/terms">{t('footer.terms')}</Link>
              <Link href="/resources">{t('footer.resources')}</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; {t('footer.copyright')}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
