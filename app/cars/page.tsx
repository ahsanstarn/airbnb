'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cars = [
  { id: 1, name: 'Toyota Hilux 4x4', type: 'Off-road', price: 150, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop' },
  { id: 2, name: 'Lexus GX470', type: 'Luxury SUV', price: 200, img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop' },
  { id: 3, name: 'Hyundai Elantra', type: 'Economy', price: 80, img: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&h=400&fit=crop' },
  { id: 4, name: 'Mitsubishi Delica', type: 'Van / 4x4', price: 120, img: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=400&fit=crop' },
];

export default function CarsPage() {
  const [bookingCar, setBookingCar] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleBook = (name: string) => {
    setBookingCar(name);
    setTimeout(() => setBookingCar(null), 3000);
  };

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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 60px' }}>
          <header style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontFamily: "'var(--font-display), serif'", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, letterSpacing: '0.04em', color: '#1a120e', margin: '0 0 12px' }}>Car Rentals in Georgia</h1>
            <p style={{ fontFamily: "'var(--font-body), system-ui, sans-serif'", color: '#5a4538', fontSize: '1.1rem', margin: 0 }}>Explore Sakartvelo at your own pace. From Tbilisi to the mountains.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {cars.map((car) => (
              <div
                key={car.id}
                className="card-3d-glow"
                style={{
                  borderRadius: '20px',
                  background: 'rgba(255, 251, 246, 0.84)',
                  border: '1px solid hsla(0,0%,100%,.35)',
                  backdropFilter: 'blur(24px) saturate(120%)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <Image src={car.img} alt={car.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: "'var(--font-display), serif'", fontSize: '1.05rem', fontWeight: 500, margin: 0, color: '#1a120e' }}>{car.name}</h3>
                    <span style={{ fontFamily: "'var(--font-body), system-ui, sans-serif'", fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7a6a', background: 'rgba(0,0,0,0.04)', borderRadius: '999px', padding: '4px 10px' }}>{car.type}</span>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontFamily: "'var(--font-display), serif'", fontSize: '1.3rem', fontWeight: 500, color: '#1a120e' }}>₾{car.price}</span>
                    <span style={{ fontFamily: "'var(--font-body), system-ui, sans-serif'", fontSize: '0.85rem', color: '#8a7a6a' }}> / day</span>
                  </div>
                  <button
                    onClick={() => handleBook(car.name)}
                    disabled={bookingCar !== null}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '999px',
                      border: 'none',
                      background: bookingCar === car.name ? '#2a6e3a' : '#1a120e',
                      color: '#fff',
                      fontFamily: "'var(--font-body), system-ui, sans-serif'",
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      cursor: bookingCar !== null ? 'default' : 'pointer',
                      transition: 'transform 0.2s ease, background 0.3s ease',
                    }}
                    onMouseEnter={e => { if (bookingCar !== car.name && bookingCar === null) e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    {bookingCar === car.name ? '✓ Request Sent' : 'Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {bookingCar && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '999px',
            background: 'rgba(255, 251, 246, 0.92)',
            border: '1px solid hsla(0,0%,100%,.35)',
            backdropFilter: 'blur(24px) saturate(120%)',
            padding: '14px 28px',
            fontFamily: "'var(--font-body), system-ui, sans-serif'",
            color: '#1a120e',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            zIndex: 100,
          }}>
            <p style={{ margin: 0 }}>Booking request for <strong>{bookingCar}</strong> has been sent to the host!</p>
          </div>
        )}
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
