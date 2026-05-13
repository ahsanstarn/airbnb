'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="site-shell">
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

      <section className="hero" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 24px 60px', position: 'relative', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
        <div className="hero-mist"></div>
        <div className="hero-mist" style={{ top: '30%', width: '50%', opacity: 0.3 }}></div>

        <div style={{ width: 'min(900px, 100%)', position: 'relative', zIndex: 2 }}>
          <div style={{
            background: 'rgba(255, 251, 246, 0.88)',
            border: '1px solid hsla(0,0%,100%,.35)',
            borderRadius: '32px',
            padding: '56px 48px',
            backdropFilter: 'blur(24px) saturate(120%)',
            boxShadow: '0 40px 80px rgba(48,26,16,0.12)',
          }}>
            <div className="rg-2">
              {/* Left - contact info */}
              <div style={{ paddingTop: '8px' }}>
                <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontFamily: 'var(--font-display), serif', fontWeight: 700, lineHeight: 1.05, margin: '0 0 8px' }}>
                  How can we help?
                </h1>
                <p style={{ fontSize: '15px', color: 'var(--muted)', margin: '0 0 40px', lineHeight: 1.5 }}>
                  Get in touch with our team in Tbilisi.
                </p>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(36,23,18,.5)', margin: '0 0 12px' }}>Support</h3>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>support@kaya.ge</p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(36,23,18,.5)', margin: '0 0 12px' }}>Office</h3>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>12 Rustaveli Ave, Tbilisi, Georgia</p>
                </div>

                <div style={{ marginBottom: 0 }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(36,23,18,.5)', margin: '0 0 12px' }}>Phone</h3>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>+995 32 2XX XXXX</p>
                </div>
              </div>

              {/* Right - form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{
                    padding: '16px 18px', borderRadius: '16px',
                    border: '1px solid rgba(36,23,18,.12)',
                    background: 'hsla(0,0%,100%,.84)',
                    fontSize: '14px', color: 'var(--ink)', outline: 'none',
                    transition: 'border-color .2s, box-shadow .2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(180,84,45,.5)'; e.target.style.boxShadow = '0 0 0 4px rgba(180,84,45,.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(36,23,18,.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  style={{
                    padding: '16px 18px', borderRadius: '16px',
                    border: '1px solid rgba(36,23,18,.12)',
                    background: 'hsla(0,0%,100%,.84)',
                    fontSize: '14px', color: 'var(--ink)', outline: 'none',
                    transition: 'border-color .2s, box-shadow .2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(180,84,45,.5)'; e.target.style.boxShadow = '0 0 0 4px rgba(180,84,45,.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(36,23,18,.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <textarea
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  style={{
                    padding: '16px 18px', borderRadius: '16px',
                    border: '1px solid rgba(36,23,18,.12)',
                    background: 'hsla(0,0%,100%,.84)',
                    fontSize: '14px', color: 'var(--ink)', outline: 'none', resize: 'vertical',
                    fontFamily: 'var(--font-body), system-ui, sans-serif',
                    transition: 'border-color .2s, box-shadow .2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(180,84,45,.5)'; e.target.style.boxShadow = '0 0 0 4px rgba(180,84,45,.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(36,23,18,.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '16px 22px', border: '0', borderRadius: '999px',
                    background: '#1a120e',
                    color: '#fff8ef', fontSize: '15px', fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    marginTop: '4px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -8px rgba(26,18,14,.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {sent ? 'Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

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
          <span>&copy; {new Date().getFullYear()} Kaya.ge — crafted in Tbilisi</span>
        </div>
      </footer>
    </div>
  );
}
