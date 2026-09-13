'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CarListing {
  id: string;
  _id?: string;
  name: string;
  title?: string;
  type: string;
  price: number;
  img: string;
  location?: string;
  overall_rating?: number;
  amenities?: string[];
}

const fallbackCars: CarListing[] = [
  { id: 'seed-12', name: 'Toyota Land Cruiser Prado 4x4', type: 'Off-road', price: 180, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop', location: 'Tbilisi Delivery', overall_rating: 4.95 },
  { id: 'seed-13', name: 'Mitsubishi Delica 4WD Van', type: 'Van / 4x4', price: 140, img: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=400&fit=crop', location: 'Tbilisi & Kutaisi', overall_rating: 4.88 },
  { id: 'car-3', name: 'Lexus GX470 Overland', type: 'Luxury SUV', price: 200, img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop', location: 'Tbilisi & Batumi', overall_rating: 4.92 },
  { id: 'car-4', name: 'Hyundai Elantra Eco', type: 'Economy', price: 85, img: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&h=400&fit=crop', location: 'Tbilisi Airport', overall_rating: 4.75 },
];

export default function CarsPage() {
  const [carsList, setCarsList] = useState<CarListing[]>(fallbackCars);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeCarModal, setActiveCarModal] = useState<CarListing | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCars() {
      try {
        const res = await fetch('/api/listings?category=cars&limit=50');
        if (res.ok) {
          const data = await res.json();
          if (data.listings && data.listings.length > 0) {
            const mapped: CarListing[] = data.listings.map((item: any) => ({
              id: item._id || item.id,
              _id: item._id || item.id,
              name: item.title,
              title: item.title,
              type: item.type || '4x4 Off-Road',
              price: item.price_per_night || item.price || 150,
              img: (item.images && item.images[0]) || fallbackCars[0].img,
              location: item.location || 'Tbilisi',
              overall_rating: item.overall_rating || 4.9,
              amenities: item.amenities || ['4WD', 'Full Insurance', 'GPS'],
            }));
            // Merge unique with fallback
            const existingIds = new Set(mapped.map(m => m.name));
            const remaining = fallbackCars.filter(f => !existingIds.has(f.name));
            setCarsList([...mapped, ...remaining]);
          }
        }
      } catch (err) {
        console.error('Failed to load cars from MongoDB:', err);
      }
    }
    loadCars();
  }, []);

  const filteredCars = selectedType === 'All'
    ? carsList
    : carsList.filter(c => c.type.toLowerCase().includes(selectedType.toLowerCase()));

  const handleConfirmRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCarModal || !pickupDate || !returnDate) return;
    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('kaya_token')) : null;
      if (!token) {
        window.location.href = `/book/${activeCarModal.id}?checkIn=${encodeURIComponent(pickupDate)}&checkOut=${encodeURIComponent(returnDate)}&guests=2`;
        return;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing_id: activeCarModal.id,
          check_in: pickupDate,
          check_out: returnDate,
          guest_count: 2,
          payment_method: 'card',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const bId = data.booking?.id || data.booking?._id || 'OK';
        setBookingSuccess(`Rental confirmed! Code #KAYA-${String(bId).slice(-6).toUpperCase()}`);
        setActiveCarModal(null);
        setTimeout(() => setBookingSuccess(null), 5000);
      } else {
        // Fallback directly to book page
        window.location.href = `/book/${activeCarModal.id}?checkIn=${encodeURIComponent(pickupDate)}&checkOut=${encodeURIComponent(returnDate)}&guests=2`;
      }
    } catch {
      window.location.href = `/book/${activeCarModal.id}?checkIn=${encodeURIComponent(pickupDate)}&checkOut=${encodeURIComponent(returnDate)}&guests=2`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
          <header style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent, #d9653b)', fontWeight: 700, fontSize: '12px' }}>Expedition Vehicles</span>
            <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, letterSpacing: '0.04em', color: 'var(--ink)', margin: '8px 0 12px' }}>Car & 4x4 Rentals in Georgia</h1>
            <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'var(--text-secondary, #5a4538)', fontSize: '1.1rem', margin: 0 }}>Explore Sakartvelo at your own pace. From Kazbegi passes to Black Sea coastline.</p>
          </header>

          {/* Filter Chips */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {['All', 'Off-road', 'SUV', 'Van', 'Economy'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: selectedType === cat ? '1px solid #1a120e' : '1px solid rgba(26,18,14,0.12)',
                  background: selectedType === cat ? '#1a120e' : 'rgba(255,251,246,0.8)',
                  color: selectedType === cat ? '#fff8ef' : 'var(--ink)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="card-3d-glow"
                style={{
                  borderRadius: '20px',
                  background: 'var(--card-bg, rgba(255, 251, 246, 0.84))',
                  border: '1px solid var(--glass-border, hsla(0,0%,100%,.35))',
                  backdropFilter: 'blur(24px) saturate(120%)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <Image src={car.img} alt={car.name} fill style={{ objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,251,246,0.92)', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--ink)' }}>
                    ★ {car.overall_rating || 4.9}
                  </span>
                </div>
                <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.05rem', fontWeight: 500, margin: 0, color: 'var(--ink)' }}>{car.name}</h3>
                      <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7a6a', background: 'rgba(0,0,0,0.04)', borderRadius: '999px', padding: '4px 10px' }}>{car.type}</span>
                    </div>
                    {car.location && <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>📍 {car.location}</div>}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 500, color: 'var(--ink)' }}>₾{car.price}</span>
                      <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--text-secondary, #8a7a6a)' }}> / day</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/listing/${car.id}`}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '999px',
                        border: '1px solid rgba(26,18,14,0.15)',
                        background: 'transparent',
                        color: 'var(--ink)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        textAlign: 'center',
                      }}
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => setActiveCarModal(car)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'var(--ink, #1a120e)',
                        color: 'var(--bg, #fff)',
                        fontFamily: 'var(--font-body), system-ui, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, background 0.3s ease',
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {activeCarModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26,18,14,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}>
            <div style={{
              background: '#fffdfa',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display), serif', fontSize: '1.4rem' }}>Rent {activeCarModal.name}</h3>
                <button onClick={() => setActiveCarModal(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 20px' }}>Daily rate: <strong>₾{activeCarModal.price}</strong> / day. Includes insurance and GPS.</p>
              
              <form onSubmit={handleConfirmRental} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Pick-up Date</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setPickupDate(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(26,18,14,0.15)', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Return Date</label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setReturnDate(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(26,18,14,0.15)', fontSize: '14px' }}
                  />
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(217,101,59,0.08)', fontSize: '12px', color: '#8a4025' }}>
                  ✓ Instant confirmation via KAYA 4x4 Fleet.<br />
                  ✓ Free delivery in Tbilisi & airport pick-up.
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !pickupDate || !returnDate}
                  style={{
                    padding: '14px',
                    borderRadius: '999px',
                    background: '#1a120e',
                    color: '#fff8ef',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  {isSubmitting ? 'Confirming...' : 'Continue to Reservation'}
                </button>
              </form>
            </div>
          </div>
        )}

        {bookingSuccess && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '999px',
            background: '#166534',
            color: '#fff',
            padding: '14px 28px',
            fontFamily: 'var(--font-body), system-ui, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            zIndex: 1100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}>
            {bookingSuccess}
          </div>
        )}
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
