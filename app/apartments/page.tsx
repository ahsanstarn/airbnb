'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Listing {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  img: string;
  images?: string[];
  type?: string;
}

const staticListings: Listing[] = [
  { id: 3, title: 'Modern Seaside Flat', location: 'Batumi, Georgia', price: 95, rating: 4.72, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=800&fit=crop' },
  { id: 5, title: 'Old Town Guesthouse', location: 'Tbilisi, Georgia', price: 65, rating: 4.85, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=800&fit=crop' },
];

export default function ApartmentsPage() {
  const [liveListings, setLiveListings] = useState<Listing[]>(staticListings);
  const [showMap, setShowMap] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setLiveListings(staticListings);
      } catch {
        setLiveListings(staticListings);
      }
    }
    init();
  }, []);

  return (
    <>
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
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

      <main style={{ background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)', minHeight: '100vh' }}>
        <section style={{ position: 'relative', padding: '120px 24px 80px', background: 'linear-gradient(135deg, #7a9b76 0%, #6b8b67 30%, #5a7a56 60%, #4a6a46 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(200,230,190,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(80,120,70,0.15) 0%, transparent 50%)' }} />
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', padding: '48px 40px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'var(--font-display), serif'", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 400, letterSpacing: '0.06em', margin: '0 0 8px', color: '#1a120e' }}>APARTMENTS</h1>
              <p style={{ fontFamily: "'var(--font-body), system-ui, sans-serif'", color: '#5a4538', fontSize: '1.15rem', margin: '0 0 28px' }}>Homes and flats across Georgia</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', background: 'rgba(255, 251, 246, 0.6)', borderRadius: '999px', padding: '6px', maxWidth: '680px', margin: '0 auto' }}>
                <Link href="/search?focus=region" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontFamily: "'var(--font-body), system-ui, sans-serif'", fontSize: '0.9rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Location</span>
                  <span style={{ display: 'block', fontWeight: 500 }}>Where to?</span>
                </Link>
                <Link href="/search?focus=dates" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontFamily: "'var(--font-body), system-ui, sans-serif'", fontSize: '0.9rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Check in</span>
                  <span style={{ display: 'block', fontWeight: 500 }}>Add dates</span>
                </Link>
                <Link href="/search?focus=guests" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontFamily: "'var(--font-body), system-ui, sans-serif'", fontSize: '0.9rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Guests</span>
                  <span style={{ display: 'block', fontWeight: 500 }}>Add visitors</span>
                </Link>
                <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#1a120e', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }} aria-label="Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5L21 21"></path></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: "'var(--font-display), serif'", fontSize: '1.8rem', fontWeight: 400, color: '#1a120e', margin: 0 }}>Featured Apartments</h2>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              style={{ padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(26,18,14,0.2)', background: 'rgba(255,251,246,0.7)', cursor: 'pointer', fontFamily: "'var(--font-body), system-ui, sans-serif'", fontSize: '0.85rem', transition: 'all 0.2s' }}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          {showMap && (
            <div style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', padding: '40px', marginBottom: '32px', textAlign: 'center', color: '#5a4538' }}>
              <p>Map view coming soon...</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {liveListings.map((listing) => (
              <div
                key={listing.id}
                style={{
                  borderRadius: '20px',
                  background: 'rgba(255, 251, 246, 0.84)',
                  border: '1px solid hsla(0,0%,100%,.35)',
                  backdropFilter: 'blur(24px) saturate(120%)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: 'translateY(0)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                  <Image src={listing.images?.[0] || listing.img} alt={listing.title} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,251,246,0.9)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.95rem', fontWeight: 600, color: '#1a120e' }}>₾{listing.price}</div>
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <h3 style={{ fontFamily: "'var(--font-display), serif'", fontSize: '1.15rem', fontWeight: 500, margin: '0 0 8px', color: '#1a120e' }}>{listing.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'var(--font-body), system-ui, sans-serif'", fontSize: '0.9rem', color: '#5a4538' }}>
                    <span>{listing.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {listing.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

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
    </>
  );
}
