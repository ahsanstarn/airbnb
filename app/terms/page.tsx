'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '110px 24px 60px', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ borderRadius: '28px', padding: '40px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)' }}>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '3rem', fontWeight: 700, color: '#1a120e', marginBottom: '24px' }}>Terms of Service</h1>
          <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', lineHeight: 1.8, color: 'rgba(36,23,18,.58)', fontSize: '1.05rem' }}>
            By using Kaya.ge, you agree to follow our community guidelines and respect the traditional hospitality values of Sakartvelo.
          </p>
          <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', lineHeight: 1.8, color: 'rgba(36,23,18,.58)', fontSize: '1.05rem', marginTop: '20px' }}>
            Hosts must provide accurate information about their listings, and guests are expected to respect the properties and local culture during their stay.
          </p>
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
