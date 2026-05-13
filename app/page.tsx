'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [listings, setListings] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(1);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollF, setScrollF] = useState(0);

  useEffect(() => {
    fetch('/api/listings?sort=recommended&limit=4')
      .then(r => r.json())
      .then(d => { if (d.listings?.length) setListings(d.listings); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollF(Math.min(window.scrollY / 300, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      <div className="cursor-glow" style={{ transform: `translate(${cursorPos.x - 60}px, ${cursorPos.y - 60}px)` }} />
      <div className="shell">
        {/* Navbar */}
        <div className="sticky-nav-shell visible" style={{ transform: `translateX(-50%) translateY(${-38 * scrollF}px)` }}>
          <nav className="nav nav-sticky-bar" style={{ transform: `scale(${1.08 - 0.08 * scrollF})` }}>
            <Link href="/" className="nav-brand">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </Link>
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
            <div className="nav-links">
              <Link href="/klara">KLARA</Link>
              <Link href="/search">Visitors</Link>
              <Link href="/hotels">Stays</Link>
              <Link href="/muse">Where to go</Link>
              <Link href="/contact">Contact us</Link>
            </div>
            <div className="nav-spacer"></div>
            <div className="nav-right">
              <Link href="/login">Become a host</Link>
              <Link href="/login" className="nav-icon" aria-label="Login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path></svg>
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
          <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
          <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
          <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
          <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>Stays</Link>
          <Link href="/muse" onClick={() => setMobileNavOpen(false)}>Where to go</Link>
          <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact us</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)}>Become a host</Link>
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
                <h2>Discover {HERO_SLIDES[activeSlide].name}</h2>
                <p>Amber wine, vineyard roads, family tables and slow countryside afternoons.</p>
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
              <div className="search-text"><strong>Tbilisi</strong><span>Choose the destination</span></div>
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
            <button className="search-action" type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"></path></svg>
            </button>
          </form>
        </section>

        {/* Recommended Places */}
        <section className="section animate-section">
          <div className="section-head">
            <div>
              <h2 className="section-title">Recommended Places to Stay</h2>
            </div>
            <Link className="pill-link" href="/search">See all</Link>
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
              <h2 className="section-title">Browse by Category</h2>
            </div>
            <Link className="pill-link" href="/search">View all</Link>
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

        {/* Muse */}
        <section className="section animate-section">
          <div className="muse-grid">
            <div className="muse-visual animate-slide-right hover-glow"></div>
            <div className="muse-copy animate-slide-left">
              <p className="section-kicker">Kaya Muse</p>
              <h2>Open the guide before you book the trip.</h2>
              <p>Region guides, cultural context, weather, phrasebook, emergency contacts and practical travel notes are all part of the basic Muse experience described for Phase 1.</p>
              <Link className="btn-primary" href="/muse">
                Explore Muse
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="brandmark-dot"></span>
                <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
              </div>
              <p className="footer-tagline">Discover Georgia, your way.</p>
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
              <h4>Support</h4>
              <Link href="/contact">Contact us</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/resources">Resources</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; crafted in Tbilisi</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
