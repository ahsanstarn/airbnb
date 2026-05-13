'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AboutPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '3.2rem', fontWeight: 700, color: '#1a120e', marginBottom: '16px' }}>Reimagining Travel in Georgia</h1>
          <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '1.15rem', color: 'rgba(36,23,18,.58)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
            Kaya.ge is more than a marketplace. It&apos;s a tribute to Sakartvelo — a bridge between traditional hospitality and modern technology.
          </p>
        </div>

        <div className="rg-2" style={{ borderRadius: '28px', padding: '40px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)', marginBottom: '48px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(36,23,18,.58)' }}>Our Story</span>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '2rem', fontWeight: 700, color: '#1a120e', margin: '12px 0 16px' }}>Born in Tbilisi, Inspired by the Mountains</h2>
            <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)', lineHeight: 1.7 }}>
              Kaya started with a simple idea: how can we make the authentic Georgian experience accessible to the world without losing the soul of local hospitality? We built a platform where every guest house, winery, and tour guide is verified and treated as a partner, not just a listing.
            </p>
          </div>
          <div style={{ borderRadius: '28px', padding: '32px', background: 'linear-gradient(135deg, #f5e6d3, #e8d5c4)', textAlign: 'center', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ borderRadius: '20px', padding: '28px', background: 'rgba(255, 251, 246, 0.84)', backdropFilter: 'blur(24px)' }}>
              <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '3rem', fontWeight: 700, color: '#1a120e', margin: 0 }}>8,000+</h3>
              <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)' }}>Verified Listings</p>
            </div>
          </div>
        </div>

        <div style={{ borderRadius: '28px', padding: '40px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(36,23,18,.58)' }}>For Hosts</span>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '2rem', fontWeight: 700, color: '#1a120e', margin: '12px 0 8px' }}>How Hosting Works on Kaya</h2>
            <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)' }}>Join the community of thousands of hosts across Georgia.</p>
          </div>
          <div className="rg-3" style={{ gap: '24px' }}>
            {[
              { num: '1', title: 'List Your Property', desc: 'Upload photos, set your flat monthly fee, and tell your story.' },
              { num: '2', title: 'Chat with Guests', desc: 'Use our direct messaging system to coordinate with travelers.' },
              { num: '3', title: 'Keep 100% Earnings', desc: 'Since we don\'t charge commissions, every Lari goes to you.' }
            ].map((step) => (
              <div key={step.num} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '999px', background: 'linear-gradient(135deg, #d4a373, #bc8a5f)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display), serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 auto 16px' }}>{step.num}</div>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.2rem', fontWeight: 600, color: '#1a120e', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
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
