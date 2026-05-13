'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BlogPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const posts = [
    { title: 'Top 10 Hidden Gems in Kazbegi', category: 'Travel', date: 'May 10, 2025', color: '#d4a373' },
    { title: 'How to Host the Perfect Georgian Supra', category: 'Culture', date: 'May 8, 2025', color: '#bc8a5f' },
    { title: 'Summer in Batumi: A Locals Guide', category: 'Guides', date: 'May 5, 2025', color: '#a8c5a0' },
    { title: 'The Rise of Digital Nomads in Tbilisi', category: 'News', date: 'May 1, 2025', color: '#86b3d9' }
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '160px 24px 60px', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      {/* Glass nav */}
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

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '3rem', fontWeight: 700, color: '#1a120e', marginBottom: '12px' }}>Kaya Blog</h1>
          <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '1.1rem', color: 'rgba(36,23,18,.58)' }}>Stories, guides, and news from the heart of Georgia.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {posts.map((post) => (
            <div key={post.title} style={{ borderRadius: '28px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)', overflow: 'hidden' }}>
              <div style={{ height: '180px', background: `linear-gradient(135deg, ${post.color}, ${post.color}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem', opacity: 0.2 }}>✦</span>
              </div>
              <div style={{ padding: '24px' }}>
                <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(36,23,18,.58)' }}>{post.category}</span>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.15rem', fontWeight: 600, color: '#1a120e', margin: '8px 0', lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.85rem', color: 'rgba(36,23,18,.58)', margin: 0 }}>{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline footer */}
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
  );
}
