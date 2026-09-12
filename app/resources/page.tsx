'use client';

import Link from 'next/link';

export default function ResourcesPage() {

  const resources = [
    {
      title: 'Georgian Hospitality Guide',
      desc: 'Learn the secrets of traditional Georgian hospitality and how to provide a world-class supra experience for your guests.',
      icon: '🍷',
      link: '#'
    },
    {
      title: 'Legal & Tax Basics',
      desc: 'Everything you need to know about registering your tourism business in Georgia and handling taxes correctly.',
      icon: '⚖️',
      link: '#'
    },
    {
      title: 'Photography Tips',
      desc: 'A guide on how to take stunning photos of your property that will stand out in the Kaya.ge search results.',
      icon: '📸',
      link: '#'
    },
    {
      title: 'Managing Seasonal Demand',
      desc: 'Strategies for maximizing your bookings during the peak summer in Batumi and winter seasons in Gudauri.',
      icon: '🏔️',
      link: '#'
    },
    {
      title: 'Kaya AI Optimization',
      desc: 'Learn how to use KLARA AI to optimize your listing description and reach more international travelers.',
      icon: '🤖',
      link: '#'
    },
    {
      title: 'Sustainability in Tourism',
      desc: 'How to make your guest house eco-friendly and attract the growing number of conscious travelers visiting Georgia.',
      icon: '🌿',
      link: '#'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '110px 24px 60px', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '3rem', fontWeight: 700, color: '#1a120e', marginBottom: '12px' }}>Host Resources</h1>
          <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '1.1rem', color: 'rgba(36,23,18,.58)' }}>
            Everything you need to build and grow your tourism business in Georgia.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {resources.map((res) => (
            <div key={res.title} style={{ borderRadius: '28px', padding: '28px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{res.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.15rem', fontWeight: 600, color: '#1a120e', margin: '0 0 8px' }}>{res.title}</h3>
              <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)', lineHeight: 1.6, margin: '0 0 16px', flex: 1, fontSize: '0.9rem' }}>{res.desc}</p>
              <a href={res.link} style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontWeight: 600, color: '#bc8a5f', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Read Guide <span>→</span>
              </a>
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
