'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const restaurants = [
  { id: 1, name: 'Khinkalnia Tbilisi', location: 'Tbilisi, Old Town', cuisine: 'Georgian', price: 25, rating: 4.8, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop' },
  { id: 2, name: 'Porto Franco Batumi', location: 'Batumi, Seaside', cuisine: 'Seafood', price: 45, rating: 4.7, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop' },
  { id: 3, name: 'Café Literaturuli', location: 'Tbilisi, Vera', cuisine: 'European', price: 20, rating: 4.6, img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop' },
  { id: 4, name: 'Wine Garden Kakheti', location: 'Sighnaghi, Kakheti', cuisine: 'Georgian', price: 35, rating: 4.9, img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51a3a?w=600&h=400&fit=crop' },
];

export default function RestaurantsPage() {
  return (
    <>
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '80px' }}>
        <section style={{ position: 'relative', padding: '80px 24px 60px', background: 'linear-gradient(135deg, #943d22 0%, #c45632 35%, #9b3d20 70%, #69220e 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(255,225,200,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(217,101,59,0.2) 0%, transparent 50%)' }} />
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.88)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', padding: '48px 40px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 400, letterSpacing: '0.06em', margin: '0 0 8px', color: '#1a120e' }}>RESTAURANTS</h1>
              <p style={{ color: '#5a4538', fontSize: '1.15rem', margin: '0 0 28px' }}>Dine across Georgia — from Tbilisi cafes to Kakheti wine gardens</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', background: 'rgba(255, 251, 246, 0.6)', borderRadius: '999px', padding: '6px', maxWidth: '680px', margin: '0 auto' }}>
                <Link href="/search?focus=cuisine" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontSize: '0.9rem' }}><span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Cuisine</span><span style={{ display: 'block', fontWeight: 500 }}>What craving?</span></Link>
                <Link href="/search?focus=location" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontSize: '0.9rem' }}><span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Location</span><span style={{ display: 'block', fontWeight: 500 }}>Where to?</span></Link>
                <Link href="/search?focus=guests" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontSize: '0.9rem' }}><span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Guests</span><span style={{ display: 'block', fontWeight: 500 }}>How many?</span></Link>
                <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#1a120e', color: '#fff', textDecoration: 'none' }} aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5L21 21"></path></svg></Link>
              </div>
            </div>
          </div>
        </section>
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--ink)', margin: '0 0 32px' }}>Featured Restaurants</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {restaurants.map((r) => (
              <Link key={r.id} href={`/search?cuisine=${encodeURIComponent(r.cuisine)}`} className="card-3d-glow" style={{ textDecoration: 'none', color: 'inherit', display: 'block', borderRadius: '20px', background: 'var(--card-bg, rgba(255, 251, 246, 0.84))', border: '1px solid var(--glass-border, hsla(0,0%,100%,.35))', backdropFilter: 'blur(24px) saturate(120%)', overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                  <Image src={r.img} alt={r.name} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,251,246,0.92)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-terracotta, #D9653B)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>₾{r.price}/person</div>
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>{r.name}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7a6a', background: 'rgba(0,0,0,0.04)', borderRadius: '999px', padding: '4px 10px' }}>{r.cuisine}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary, #5a4538)' }}>
                    <span>{r.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>{r.rating}</span>
                  </div>
                </div>
              </Link>
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
