'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  { id: 1, name: 'Professional Photography', location: 'Tbilisi', type: 'Photography', price: 150, rating: 4.9, img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop' },
  { id: 2, name: 'Private Chef Experience', location: 'Tbilisi & Kakheti', type: 'Catering', price: 200, rating: 4.8, img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop' },
  { id: 3, name: 'English-Russian Translation', location: 'Online / Tbilisi', type: 'Translation', price: 40, rating: 4.7, img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop' },
  { id: 4, name: 'Babysitting & Childcare', location: 'Tbilisi', type: 'Childcare', price: 25, rating: 4.6, img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop' },
  { id: 5, name: 'Massage & Wellness', location: 'Tbilisi', type: 'Wellness', price: 80, rating: 4.8, img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop' },
  { id: 6, name: 'Driver & Guide', location: 'Any city', type: 'Transport', price: 120, rating: 4.7, img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop' },
];

export default function ServicesPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <>
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></Link>
          <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
          <div className="nav-links"><Link href="/klara">KLARA</Link><Link href="/search">Visitors</Link><Link href="/hotels">Stays</Link><Link href="/muse">Where to go</Link><Link href="/contact">Contact us</Link></div>
          <div className="nav-spacer"></div>
          <div className="nav-right"><Link href="/login">Become a host</Link><Link href="/login" className="nav-icon" aria-label="Login"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path></svg></Link></div>
        </nav>
      </div>
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
        <section style={{ position: 'relative', padding: '120px 24px 80px', background: 'linear-gradient(135deg, #4a6fa5, #5a82b8 30%, #3a5f8e 60%, #2a4f78 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(200,220,255,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(80,130,200,0.15) 0%, transparent 50%)' }} />
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', padding: '48px 40px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'var(--font-display), serif'", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 400, letterSpacing: '0.06em', margin: '0 0 8px', color: '#1a120e' }}>SERVICES</h1>
              <p style={{ color: '#5a4538', fontSize: '1.15rem', margin: '0 0 28px' }}>On-demand services for travelers — photographers, chefs, drivers & more</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', background: 'rgba(255, 251, 246, 0.6)', borderRadius: '999px', padding: '6px', maxWidth: '680px', margin: '0 auto' }}>
                <Link href="/search?focus=type" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontSize: '0.9rem' }}><span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Service</span><span style={{ display: 'block', fontWeight: 500 }}>What need?</span></Link>
                <Link href="/search?focus=city" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontSize: '0.9rem' }}><span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>City</span><span style={{ display: 'block', fontWeight: 500 }}>Where?</span></Link>
                <Link href="/search?focus=price" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontSize: '0.9rem' }}><span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Budget</span><span style={{ display: 'block', fontWeight: 500 }}>Price range</span></Link>
                <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#1a120e', color: '#fff', textDecoration: 'none' }} aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5L21 21"></path></svg></Link>
              </div>
            </div>
          </div>
        </section>
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
          <h2 style={{ fontFamily: "'var(--font-display), serif'", fontSize: '1.8rem', fontWeight: 400, color: '#1a120e', margin: '0 0 32px' }}>On-Demand Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {services.map((s) => (
              <div key={s.id} className="card-3d-glow" style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <Image src={s.img} alt={s.name} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,251,246,0.9)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, color: '#1a120e' }}>₾{s.price}/hr</div>
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: "'var(--font-display), serif'", fontSize: '1.05rem', fontWeight: 500, margin: 0, color: '#1a120e' }}>{s.name}</h3>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7a6a', background: 'rgba(0,0,0,0.04)', borderRadius: '999px', padding: '4px 10px' }}>{s.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#5a4538' }}>
                    <span>{s.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>{s.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="footer-grid shell">
        <div className="footer-brand"><div className="footer-logo"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></div><p className="footer-tagline">Discover Georgia, your way.</p></div>
        <div className="footer-links"><h4>Stays</h4><Link href="/hotels">Hotels</Link><Link href="/apartments">Apartments</Link><Link href="/search?type=guesthouses">Guesthouses</Link><Link href="/search?type=cabins">Cabins</Link></div>
        <div className="footer-links"><h4>Discover</h4><Link href="/muse">Where to go</Link><Link href="/blog">Travel blog</Link><Link href="/about">About us</Link><Link href="/careers">Careers</Link></div>
        <div className="footer-links"><h4>Support</h4><Link href="/contact">Contact us</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/resources">Resources</Link></div>
      </div><div className="footer-bottom shell"><span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; crafted in Tbilisi</span></div></footer>
    </>
  );
}
