'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TourItem {
  id: string | number;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  img: string;
  group?: string;
}

const SAMPLE_TOURS: TourItem[] = [
  { id: 'seed-14', name: 'Kakheti 8,000-Vintage Qvevri Wine Trail', location: 'Kakheti, Telavi & Sighnaghi', duration: 'Full Day', price: 120, rating: 4.99, img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop', group: '2-8' },
  { id: 'seed-15', name: 'Kazbegi Gergeti Glacier 4x4 Alpine Trek', location: 'Stepantsminda, Kazbegi', duration: '6 Hours', price: 95, rating: 4.96, img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop', group: '2-12' },
  { id: 'tour-3', name: 'Old Tbilisi Sulfur Springs & Heritage Food Walk', location: 'Tbilisi, Old Town', duration: '3 Hours', price: 55, rating: 4.85, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', group: '1-10' },
  { id: 'tour-4', name: 'Upper Svaneti Glacier & Tower Expedition', location: 'Mestia & Ushguli', duration: '3 Days', price: 450, rating: 4.95, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop', group: '4-10' }
];

export default function ToursPage() {
  const [tours, setTours] = useState<TourItem[]>(SAMPLE_TOURS);

  useEffect(() => {
    async function loadTours() {
      try {
        const res = await fetch('/api/listings?category=tours&limit=50');
        if (res.ok) {
          const data = await res.json();
          if (data.listings && data.listings.length > 0) {
            const mapped: TourItem[] = data.listings.map((l: any) => ({
              id: l._id || l.id,
              name: l.title,
              location: l.location || l.city,
              duration: l.duration || 'Full Day',
              price: l.price_per_night || l.price || 120,
              rating: l.overall_rating || 4.9,
              img: (l.images && l.images[0]) || SAMPLE_TOURS[0].img,
              group: l.guests ? `Up to ${l.guests}` : '2-8',
            }));
            const existingNames = new Set(mapped.map(m => m.name));
            const remaining = SAMPLE_TOURS.filter(s => !existingNames.has(s.name));
            setTours([...mapped, ...remaining]);
          }
        }
      } catch (err) {
        console.error('Failed to load tours from MongoDB:', err);
      }
    }
    loadTours();
  }, []);

  return (
    <main style={{ background: 'var(--surface)', minHeight: '100vh', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px 60px' }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent, #d9653b)', fontWeight: 700, fontSize: '12px' }}>Exploration</span>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '8px 0 16px', color: 'var(--ink)' }}>Curated Tours & Adventures</h1>
          <p style={{ color: 'var(--text-secondary, #5a4538)', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Explore dramatic Caucasus ridges, natural qvevri wine cellars, and ancient fortress valleys with certified local guides.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
          {tours.map((tour) => (
            <div key={tour.id} className="card-3d-glow" style={{ borderRadius: '24px', overflow: 'hidden', background: 'var(--card-bg, rgba(255, 251, 246, 0.84))', border: '1px solid var(--glass-border, hsla(0,0%,100%,.35))', backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column' }}>
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
                  ₾{tour.price} / person
                </span>
              </div>
              
              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>📍 {tour.location}</span>
                    <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: '999px', fontWeight: 600, color: 'var(--ink)' }}>⏱ {tour.duration}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '18px', fontWeight: 600, margin: '4px 0 10px', color: 'var(--ink)' }}>{tour.name}</h3>
                  
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary, #5a4538)', margin: '0 0 18px', lineHeight: 1.5 }}>
                    Group size: {tour.group}. Certified local guide, tastings, and transport options included.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light, rgba(26,18,14,0.08))', paddingTop: '14px', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>★ {Number(tour.rating).toFixed(1)}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/listing/${tour.id}`} style={{ fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: '1px solid rgba(26,18,14,0.15)', color: 'var(--ink)', textDecoration: 'none', fontWeight: 600 }}>Details</Link>
                    <Link href={`/book/${tour.id}`} style={{ fontSize: '12px', padding: '8px 16px', borderRadius: '999px', background: 'var(--ink)', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Book Tour</Link>
                  </div>
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
