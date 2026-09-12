'use client';

import Link from 'next/link';

const SAMPLE_TOURS = [
  { id: 1, name: 'Kakheti Wine Tour', location: 'Kakheti Region', duration: 'Full Day', price: 120, rating: 4.9, img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop', group: '2-8' },
  { id: 2, name: 'Kazbegi Mountain Hike', location: 'Stepantsminda', duration: '6 Hours', price: 85, rating: 4.8, img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop', group: '2-12' },
  { id: 3, name: 'Tbilisi Food Walk', location: 'Tbilisi, Old Town', duration: '3 Hours', price: 55, rating: 4.7, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', group: '1-10' },
  { id: 4, name: 'Svaneti Expedition', location: 'Mestia, Svaneti', duration: '3 Days', price: 450, rating: 4.9, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop', group: '4-10' }
];

export default function ToursPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px 60px' }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent, #d9653b)', fontWeight: 700, fontSize: '12px' }}>Exploration</span>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '8px 0 16px', color: 'var(--ink)' }}>Curated Tours</h1>
          <p style={{ color: 'var(--text-secondary, #5a4538)', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Explore the dramatic ridges, wine valleys, and ancient monuments of Georgia with expert certified local operators.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
          {SAMPLE_TOURS.map((tour) => (
            <div key={tour.id} className="card-3d-glow" style={{ borderRadius: '24px', overflow: 'hidden', background: 'var(--card-bg, rgba(255, 251, 246, 0.84))', border: '1px solid var(--glass-border, hsla(0,0%,100%,.35))', backdropFilter: 'blur(24px)' }}>
              <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <img 
                  src={tour.img} 
                  alt={tour.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  right: '16px', 
                  background: 'rgba(255,251,246,0.92)', 
                  padding: '6px 14px', 
                  borderRadius: '999px', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  color: 'var(--ink)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  ₾{tour.price}
                </span>
              </div>
              
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>📍 {tour.location}</span>
                  <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: '999px', fontWeight: 600, color: 'var(--ink)' }}>⏱ {tour.duration}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '18px', fontWeight: 600, margin: '4px 0 10px', color: 'var(--ink)' }}>{tour.name}</h3>
                
                <p style={{ fontSize: '13px', color: 'var(--text-secondary, #5a4538)', margin: '0 0 18px', lineHeight: 1.5 }}>
                  Perfect group setup for {tour.group} people. Guided excursions and local support included.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light, rgba(26,18,14,0.08))', paddingTop: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>★ {tour.rating.toFixed(1)}</span>
                  <Link href="/search?type=tour" style={{ fontSize: '12px', padding: '8px 16px', borderRadius: '999px', background: 'var(--ink)', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Explore tour</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </main>
  );
}
