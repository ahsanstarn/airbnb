'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Listing {
  id: number | string;
  title: string;
  location: string;
  price: number;
  rating: number;
  img: string;
  images?: string[];
  type?: string;
}

const staticListings: Listing[] = [
  { id: 1, title: 'Panoramic Suite Vera', location: 'Tbilisi, Georgia', price: 280, rating: 4.96, img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=800&fit=crop' },
  { id: 6, title: 'Boutique Rustaveli', location: 'Tbilisi, Georgia', price: 195, rating: 4.91, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=800&fit=crop' },
  { id: 7, title: 'Rooms Hotel Kazbegi', location: 'Kazbegi, Georgia', price: 320, rating: 4.98, img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=800&fit=crop' },
  { id: 8, title: 'Batumi Boulevard Grand Hotel', location: 'Batumi, Georgia', price: 240, rating: 4.92, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=800&fit=crop' },
  { id: 9, title: 'Chateau Kakheti Wine Estate', location: 'Kakheti, Georgia', price: 310, rating: 4.97, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=800&fit=crop' },
  { id: 10, title: 'Svaneti Alpine Boutique', location: 'Mestia, Georgia', price: 160, rating: 4.88, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=800&fit=crop' },
];

export default function HotelsPage() {
  const [liveListings, setLiveListings] = useState<Listing[]>(staticListings);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/listings?category=hotels&limit=50');
        if (res.ok) {
          const data = await res.json();
          if (data.listings && data.listings.length > 0) {
            const mapped = data.listings.map((l: any) => ({
              id: l._id || l.id,
              title: l.title,
              location: l.location || l.city,
              price: l.price_per_night || l.price,
              rating: l.overall_rating || 4.9,
              img: (l.images && l.images[0]) || staticListings[0].img,
              images: l.images,
              type: l.type || l.category,
            }));
            const existingTitles = new Set(mapped.map((m: any) => m.title));
            const remaining = staticListings.filter(s => !existingTitles.has(s.title));
            setLiveListings([...mapped, ...remaining]);
            return;
          }
        }
        setLiveListings(staticListings);
      } catch {
        setLiveListings(staticListings);
      }
    }
    init();
  }, []);

  return (
    <>
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '80px' }}>
        <section style={{ position: 'relative', padding: '80px 24px 60px', background: 'linear-gradient(135deg, #d4a373 0%, #c78a5c 30%, #b4713f 60%, #a05d30 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(255,230,200,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(180,100,50,0.15) 0%, transparent 50%)' }} />
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.88)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', padding: '48px 40px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 400, letterSpacing: '0.06em', margin: '0 0 8px', color: '#1a120e' }}>HOTELS</h1>
              <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: '#5a4538', fontSize: '1.15rem', margin: '0 0 28px' }}>Curated stays across Georgia</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', background: 'rgba(255, 251, 246, 0.6)', borderRadius: '999px', padding: '6px', maxWidth: '680px', margin: '0 auto' }}>
                <Link href="/search?focus=region" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.9rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Location</span>
                  <span style={{ display: 'block', fontWeight: 500 }}>Where to?</span>
                </Link>
                <Link href="/search?focus=dates" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.9rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Check in</span>
                  <span style={{ display: 'block', fontWeight: 500 }}>Add dates</span>
                </Link>
                <Link href="/search?focus=guests" style={{ flex: '1 1 auto', minWidth: '120px', padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', color: '#1a120e', fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.9rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Guests</span>
                  <span style={{ display: 'block', fontWeight: 500 }}>Add visitors</span>
                </Link>
                <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#1a120e', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }} aria-label="Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5L21 21"></path></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>Featured Hotels</h2>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              style={{ padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(26,18,14,0.2)', background: 'rgba(255,251,246,0.7)', cursor: 'pointer', fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.85rem', transition: 'all 0.2s' }}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          {showMap && (
            <div style={{ borderRadius: '20px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', padding: '40px', marginBottom: '32px', textAlign: 'center', color: '#5a4538' }}>
              <p>Map view coming soon...</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {liveListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="card-3d-glow"
                style={{
                  borderRadius: '20px',
                  background: 'var(--card-bg, rgba(255, 251, 246, 0.84))',
                  border: '1px solid var(--glass-border, hsla(0,0%,100%,.35))',
                  backdropFilter: 'blur(24px) saturate(120%)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'block',
                  color: 'inherit',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                  <Image src={listing.images?.[0] || listing.img} alt={listing.title} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,251,246,0.92)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-terracotta, #D9653B)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>₾{listing.price}</div>
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.15rem', fontWeight: 500, margin: '0 0 8px', color: 'var(--ink)' }}>{listing.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.9rem', color: 'var(--text-secondary, #5a4538)' }}>
                    <span>{listing.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {listing.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

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
    </>
  );
}
