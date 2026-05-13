'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user?.email) {
        router.replace('/login');
        return;
      }
      setEmail(session.user.email);
      setLoading(false);
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const nav = (
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
    </>
  );

  const footer = (
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
  );

  const pageBg = { minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' };

  const glassCard = {
    borderRadius: '28px',
    padding: '40px 36px',
    background: 'rgba(255, 251, 246, 0.84)',
    border: '1px solid hsla(0,0%,100%,.35)',
    backdropFilter: 'blur(24px) saturate(120%)',
    boxShadow: '0 40px 80px rgba(48,26,16,0.12)',
    width: 'min(400px, calc(100% - 32px))',
  };

  if (loading) {
    return (
      <div style={pageBg}>
        {nav}
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 100px)', padding: '40px 16px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(36,23,18,.58)', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>Loading…</p>
        </main>
        {footer}
      </div>
    );
  }

  return (
    <div style={pageBg}>
      {nav}
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 100px)', padding: '40px 16px' }}>
        <div style={glassCard}>
          <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontFamily: 'var(--font-display), serif', fontWeight: 700, lineHeight: 1.05, textAlign: 'center' }}>
            Your account
          </h1>
          <p style={{ textAlign: 'center', color: 'rgba(36,23,18,.58)', fontSize: '14px', margin: '0 0 24px', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>{email}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <Link href="/search" style={{
              display: 'block', textAlign: 'center', padding: '14px 22px', borderRadius: '999px',
              background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              fontFamily: 'var(--font-body), system-ui, sans-serif',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -8px rgba(26,18,14,.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >Search stays</Link>
            <Link href="/chat" style={{
              display: 'block', textAlign: 'center', padding: '14px 22px', borderRadius: '999px',
              background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              fontFamily: 'var(--font-body), system-ui, sans-serif',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -8px rgba(26,18,14,.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >Trip planning chat</Link>
            <Link href="/cars" style={{
              display: 'block', textAlign: 'center', padding: '14px 22px', borderRadius: '999px',
              background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              fontFamily: 'var(--font-body), system-ui, sans-serif',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -8px rgba(26,18,14,.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >Car rentals</Link>
          </div>

          <button type="button" onClick={handleSignOut} style={{
            display: 'block', width: '100%', textAlign: 'center', padding: '14px 22px', borderRadius: '999px',
            border: '1px solid rgba(36,23,18,.14)',
            background: 'transparent', color: '#1a120e', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-body), system-ui, sans-serif',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(26,18,14,.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >Sign out</button>
        </div>
      </main>
      {footer}
    </div>
  );
}
