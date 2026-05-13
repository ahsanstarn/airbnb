'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
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

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '3rem', fontWeight: 700, color: '#1a120e', marginBottom: '16px' }}>Simple, Transparent Pricing</h1>
          <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '1.1rem', color: 'rgba(36,23,18,.58)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Join Georgia&apos;s fastest-growing travel marketplace. No commissions, no hidden fees. Just one flat monthly rate.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '64px' }}>
          <div style={{ borderRadius: '28px', padding: '40px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 16px', borderRadius: '999px', background: 'linear-gradient(135deg, #d4a373, #bc8a5f)', color: '#fff' }}>Most Popular</span>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)', margin: '0 0 8px' }}>Professional Host</p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '1.5rem', color: '#1a120e' }}>₾</span>
                <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '4rem', fontWeight: 700, color: '#1a120e', lineHeight: 1 }}>20</span>
                <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)' }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {[
                'Unlimited listings',
                '0% commission on bookings',
                'Direct contact with guests',
                'Verified host badge',
                '24/7 priority support',
                'AI-powered visibility boost'
              ].map((feat) => (
                <li key={feat} style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: '#1a120e', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(36,23,18,.06)' }}>
                  <span style={{ color: '#bc8a5f', fontWeight: 700 }}>✓</span> {feat}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body), system-ui, sans-serif', fontWeight: 600, padding: '14px 32px', borderRadius: '999px', background: 'linear-gradient(135deg, #d4a373, #bc8a5f)', color: '#fff', textDecoration: 'none', fontSize: '0.95rem' }}>
              Get Started Now
            </Link>
          </div>
        </div>

        <div style={{ borderRadius: '28px', padding: '40px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)' }}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.6rem', fontWeight: 700, color: '#1a120e', textAlign: 'center', marginBottom: '32px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              { q: 'Why is there no commission?', a: 'We believe in a fair marketplace. By charging a flat monthly fee, we allow you to keep 100% of your earnings and maintain lower prices for guests.' },
              { q: 'Can I cancel anytime?', a: 'Yes, there are no long-term contracts. You can pause or cancel your subscription at any time directly from your host dashboard.' },
              { q: 'How do I pay?', a: 'We support all major Georgian banks, Apple Pay, and credit cards. Payments are securely processed via Stripe.' },
              { q: 'What if I have 100+ listings?', a: 'The price remains the same! Whether you have one guest house or a chain of hotels, it\'s still just ₾20/month per host account.' }
            ].map((faq) => (
              <div key={faq.q} style={{ padding: '16px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.05rem', fontWeight: 600, color: '#1a120e', margin: '0 0 8px' }}>{faq.q}</h3>
                <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)', lineHeight: 1.6, margin: 0, fontSize: '0.9rem' }}>{faq.a}</p>
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
