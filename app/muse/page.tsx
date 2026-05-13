'use client';
import Link from 'next/link';
import { useState } from 'react';

const regions = [
  { name: 'Tbilisi', desc: 'The vibrant capital where East meets West', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop', listings: 1200 },
  { name: 'Batumi', desc: 'Black Sea resort city with modern architecture', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop', listings: 800 },
  { name: 'Kakheti', desc: "The cradle of wine — Georgia's vineyard heartland", img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=300&fit=crop', listings: 450 },
  { name: 'Kazbegi', desc: 'Dramatic mountains and the iconic Gergeti Church', img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop', listings: 200 },
  { name: 'Kutaisi', desc: 'Ancient capital with caves and monasteries', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', listings: 300 },
  { name: 'Mestia', desc: 'Medieval towers in the heart of Svaneti', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop', listings: 150 },
];

const phrases = [
  { ka: 'გამარჯობა', en: 'Gamarjoba', meaning: 'Hello' },
  { ka: 'მადლობა', en: 'Madloba', meaning: 'Thank you' },
  { ka: 'გაუმარჯოს', en: 'Gaumarjos', meaning: 'Cheers! (toast)' },
  { ka: 'კი / არა', en: 'Ki / Ara', meaning: 'Yes / No' },
  { ka: 'რამდენი ღირს?', en: 'Ramdeni ghirs?', meaning: 'How much does it cost?' },
  { ka: 'სად არის...?', en: 'Sad aris...?', meaning: 'Where is...?' },
  { ka: 'კარგად', en: 'Kargad', meaning: 'Good / Well' },
  { ka: 'ბოდიში', en: 'Bodishi', meaning: 'Sorry / Excuse me' },
];

const essentials = [
  { icon: '🚨', title: 'Emergency', info: 'Dial 112 for police, ambulance, or fire' },
  { icon: '💱', title: 'Currency', info: 'Georgian Lari (GEL ₾). Cards accepted widely in cities.' },
  { icon: '⛪', title: 'Churches', info: 'Cover shoulders and knees. Headscarves for women.' },
  { icon: '🍷', title: 'Wine', info: "8,000 years of winemaking. Try qvevri wines!" },
  { icon: '🚕', title: 'Transport', info: 'Use Bolt app for taxis. Marshrutkas for intercity.' },
  { icon: '💰', title: 'Tipping', info: '10% in restaurants. Not expected in taxis.' },
  { icon: '🔌', title: 'Power', info: 'Type C/F plugs, 220V. Same as Europe.' },
  { icon: '🌡️', title: 'Weather', info: 'Best: May-June, Sep-Oct. Winters cold in mountains.' },
];

export default function MusePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const nav = (
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

  const sectionTitle = {
    fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
    fontFamily: 'var(--font-display), serif',
    fontWeight: 700,
    color: '#1a120e',
    margin: '0 0 8px',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      {nav}

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
      <section style={{ padding: '80px 16px 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'var(--font-display), serif', fontWeight: 700, color: '#1a120e', margin: '0 0 12px' }}>Discover Georgia</h1>
        <p style={{ fontSize: '14px', color: 'rgba(36,23,18,.58)', fontFamily: 'var(--font-body), system-ui, sans-serif', maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          Your complete guide to traveling in the country where Europe meets Asia
        </p>
      </section>

      {/* Regions */}
      <section style={{ padding: '0 16px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={sectionTitle}>Explore by Region</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {regions.map(r => (
            <Link key={r.name} href={`/search?region=${r.name}`} style={{ textDecoration: 'none', borderRadius: '28px', overflow: 'hidden', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 24px 48px rgba(48,26,16,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 32px 64px rgba(48,26,16,0.14)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(48,26,16,0.08)'; }}
            >
              <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', background: '#d4c9be' }}>
                <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '16px 20px 20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontWeight: 700, fontSize: '16px', color: '#1a120e', margin: '0 0 4px' }}>{r.name}</h3>
                <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '13px', color: 'rgba(36,23,18,.58)', margin: '0 0 8px', lineHeight: 1.4 }}>{r.desc}</p>
                <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '12px', fontWeight: 600, color: 'rgba(36,23,18,.4)' }}>{r.listings} listings</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <hr style={{ border: 0, height: '1px', background: 'rgba(36,23,18,.08)' }} />
      </div>

      {/* Phrasebook */}
      <section style={{ padding: '48px 16px', maxWidth: 1100, margin: '0 auto' }} id="phrasebook">
        <h2 style={sectionTitle}>Georgian Phrasebook</h2>
        <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '13px', color: 'rgba(36,23,18,.58)', margin: '0 0 24px' }}>
          Essential phrases to get by — locals will love you for trying!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {phrases.map(p => (
            <div key={p.en} style={{
              padding: '20px', borderRadius: '20px',
              background: 'rgba(255, 251, 246, 0.84)',
              border: '1px solid hsla(0,0%,100%,.35)',
              backdropFilter: 'blur(24px) saturate(120%)',
            }}>
              <div style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '20px', fontWeight: 600, color: '#1a120e', marginBottom: '4px' }}>{p.ka}</div>
              <div style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1a120e' }}>{p.en}</div>
              <div style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '12px', color: 'rgba(36,23,18,.4)' }}>{p.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <hr style={{ border: 0, height: '1px', background: 'rgba(36,23,18,.08)' }} />
      </div>

      {/* Essentials */}
      <section style={{ padding: '48px 16px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={sectionTitle}>Travel Essentials</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {essentials.map(e => (
            <div key={e.title} style={{
              padding: '18px 20px', borderRadius: '20px',
              background: 'rgba(255, 251, 246, 0.84)',
              border: '1px solid hsla(0,0%,100%,.35)',
              backdropFilter: 'blur(24px) saturate(120%)',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
            }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{e.icon}</span>
              <div>
                <strong style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '14px', color: '#1a120e' }}>{e.title}</strong>
                <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '12px', color: 'rgba(36,23,18,.58)', margin: '2px 0 0', lineHeight: 1.4 }}>{e.info}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {footer}
    </div>
  );
}
