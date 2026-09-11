'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const salons = [
  { id: 1, name: 'Tbilisi Spa & Hammam', location: 'Tbilisi, Vera', type: 'Spa', price: 90, rating: 4.8, img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop' },
  { id: 2, name: 'Batumi Beauty Lounge', location: 'Batumi, Seaside', type: 'Beauty', price: 45, rating: 4.6, img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=400&fit=crop' },
  { id: 3, name: 'Kakheti Wellness Retreat', location: 'Kakheti, Sighnaghi', type: 'Wellness', price: 120, rating: 4.9, img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop' },
  { id: 4, name: 'Kutaisi Hair & Barber', location: 'Kutaisi, City Centre', type: 'Barber', price: 25, rating: 4.5, img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop' },
  { id: 5, name: 'Sulfur Bath Massage', location: 'Tbilisi, Abanotubani', type: 'Massage', price: 60, rating: 4.7, img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop' },
  { id: 6, name: 'Nail Art Studio', location: 'Tbilisi, Rustaveli', type: 'Nails', price: 35, rating: 4.6, img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop' },
];

export default function SalonsPage() {
  return (
    <>
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '80px' }}>
        <section style={{ position: 'relative', padding: '80px 24px 60px', background: 'linear-gradient(135deg, #9b4a7a, #b85a96 30%, #8a3a6a 60%, #6e2a54 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(255,200,240,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(200,80,160,0.15) 0%, transparent 50%)' }} />
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.88)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', padding: '48px 40px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 400, letterSpacing: '0.06em', margin: '0 0 8px', color: '#1a120e' }}>SALONS & SPA</h1>
              <p style={{ color: '#5a4538', fontSize: '1.15rem', margin: '0 0 28px' }}>Beauty, wellness, and relaxation across Georgia</p>
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
          <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--ink)', margin: '0 0 32px' }}>Salons & Spas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {salons.map((s) => (
              <div key={s.id} className="card-3d-glow" style={{ borderRadius: '20px', background: 'var(--card-bg, rgba(255, 251, 246, 0.84))', border: '1px solid var(--glass-border, hsla(0,0%,100%,.35))', backdropFilter: 'blur(24px) saturate(120%)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <Image src={s.img} alt={s.name} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,251,246,0.9)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, color: '#1a120e' }}>₾{s.price}</div>
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.05rem', fontWeight: 500, margin: 0, color: 'var(--ink)' }}>{s.name}</h3>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7a6a', background: 'rgba(0,0,0,0.04)', borderRadius: '999px', padding: '4px 10px' }}>{s.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary, #5a4538)' }}>
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
