'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SEED_LISTINGS } from '@/lib/seed-data';

type DashboardTab = 'bookings' | 'favorites' | 'affiliate' | 'itineraries' | 'settings';

export default function TouristDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('bookings');
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>(SEED_LISTINGS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch user profile
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);

        // 2. Fetch real bookings from MongoDB
        const bookingsRes = await fetch('/api/bookings');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          if (Array.isArray(bookingsData)) {
            setBookings(bookingsData);
          }
        }

        // 3. Fetch all listings for wishlist mapping
        const listingsRes = await fetch('/api/listings');
        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          if (listingsData.listings && listingsData.listings.length > 0) {
            setAllListings(listingsData.listings);
          }
        }

        // 4. Load favorites from localStorage
        try {
          const storedFavs = JSON.parse(localStorage.getItem('kaya_favorites') || '[]');
          setFavorites(storedFavs);
        } catch {}
      } catch (err) {
        setError('Failed to load user dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('kaya_token');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const copyReferral = () => {
    if (user?.affiliateCode) {
      navigator.clipboard.writeText(`https://kaya.ge/signup?ref=${user.affiliateCode}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2400);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel');
      }
    } catch {
      alert('Error cancelling reservation');
    } finally {
      setActionLoading(null);
    }
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f !== id);
    setFavorites(updated);
    try {
      localStorage.setItem('kaya_favorites', JSON.stringify(updated));
    } catch {}
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--surface, #fff7ef)',
        color: 'var(--ink, #241712)',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(217, 101, 59, 0.2)',
          borderTopColor: 'var(--accent, #d9653b)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.25rem', fontWeight: 600 }}>
          Opening your KAYA Traveler Dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--surface, #fff7ef)', color: 'var(--accent, #d9653b)' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) return null;

  const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');
  const favoriteItems = allListings.filter(l => favorites.includes(String(l._id || l.id)));
  const totalSpent = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((acc, b) => acc + (b.total_price || 0), 0);

  // Pre-configured curated AI itineraries
  const sampleItineraries = [
    {
      id: 'iti-1',
      title: 'Kazbegi Alpine & Monastery Trail',
      tag: 'Mountain Explorer',
      duration: '3 Days • 2 Nights',
      vibe: 'Scenic & Hiking',
      locations: ['Tbilisi', 'Ananuri Fortress', 'Gudauri Panorama', 'Gergeti Trinity Church'],
      cover: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    },
    {
      id: 'iti-2',
      title: 'Kakheti Ancient Qvevri & Amber Harvest',
      tag: 'Wine & Gastronomy',
      duration: '2 Days • 1 Night',
      vibe: 'Slow Travel & Supras',
      locations: ['Signagi', 'Kindzmarauli Marani', 'Tsinandali Estate', 'Telavi Bazaar'],
      cover: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    },
    {
      id: 'iti-3',
      title: 'Bohemian Old Tbilisi & Sulfur Haven',
      tag: 'Culture & Heritage',
      duration: '4 Days • 3 Nights',
      vibe: 'Architecture & Cafés',
      locations: ['Abanotubani Baths', 'Narikala Fortress', 'Fabrika Courtyard', 'Vera Antique Flea'],
      cover: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
    }
  ];

  return (
    <div style={{
      background: 'radial-gradient(1200px circle at 10% 8%, rgba(255, 215, 188, 0.42), transparent 55%), radial-gradient(900px circle at 90% 90%, hsla(21, 76%, 82%, 0.3), transparent 60%), linear-gradient(180deg, var(--surface, #fff7ef) 0%, var(--surface-warm, #f8e2cb) 50%, var(--surface-deep, #f3d1b3) 100%)',
      color: 'var(--ink, #241712)',
      minHeight: '100vh',
      padding: '110px 24px 80px',
      fontFamily: 'var(--font-body), system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

        {/* Top Header Banner with Luxury Glassmorphic Aesthetic */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '28px',
          padding: '28px 32px',
          marginBottom: '28px',
          boxShadow: '0 16px 40px -12px rgba(36, 24, 19, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar Portal */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent, #d9653b), #f59e0b)',
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff',
              fontSize: '26px',
              fontWeight: 800,
              fontFamily: 'var(--font-display), serif',
              boxShadow: '0 8px 24px rgba(217, 101, 59, 0.35)',
              border: '3px solid #ffffff'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display), serif',
                  margin: 0,
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--ink, #241712)',
                  letterSpacing: '-0.01em'
                }}>
                  Gamarjoba, {user.name}
                </h1>
                <span style={{
                  backgroundColor: 'rgba(217, 101, 59, 0.12)',
                  color: 'var(--accent, #d9653b)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {user.role || 'Tourist'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontSize: '13.5px' }}>
                {user.email} &bull; Member of KAYA Travel Network
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(26, 18, 14, 0.12)',
                color: 'var(--ink, #241712)',
                fontSize: '13.5px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Explore Georgia
            </Link>

            {user.email === 'ahsanstarn@gmail.com' && (
              <Link
                href="/business/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)'
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                Host Suite
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '999px',
                background: 'rgba(217, 101, 59, 0.08)',
                border: '1px solid rgba(217, 101, 59, 0.25)',
                color: 'var(--accent, #d9653b)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>

        {/* 4 Luxury KPI Stat Cards with Bespoke SVGs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          {/* Card 1: Active Trips */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '22px',
            padding: '20px 22px',
            boxShadow: '0 8px 24px -6px rgba(36, 24, 19, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(217, 101, 59, 0.12)',
              color: 'var(--accent, #d9653b)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontWeight: 600 }}>Upcoming Trips</div>
              <div style={{ fontFamily: 'var(--font-display), serif', fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
                {activeBookings.length}
              </div>
            </div>
          </div>

          {/* Card 2: Total Stays */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '22px',
            padding: '20px 22px',
            boxShadow: '0 8px 24px -6px rgba(36, 24, 19, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(44, 157, 111, 0.12)',
              color: '#2c9d6f',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M10 11h2M10 15h2M14 11h2M14 15h2M18 11h2M18 15h2M9 3h6v4H9z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontWeight: 600 }}>Total Bookings</div>
              <div style={{ fontFamily: 'var(--font-display), serif', fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
                {bookings.length}
              </div>
            </div>
          </div>

          {/* Card 3: Saved Favorites */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '22px',
            padding: '20px 22px',
            boxShadow: '0 8px 24px -6px rgba(36, 24, 19, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="none"><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontWeight: 600 }}>Wishlist Stays</div>
              <div style={{ fontFamily: 'var(--font-display), serif', fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
                {favorites.length}
              </div>
            </div>
          </div>

          {/* Card 4: Total Travel Investment */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '22px',
            padding: '20px 22px',
            boxShadow: '0 8px 24px -6px rgba(36, 24, 19, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#d97706',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontWeight: 600 }}>Total Spent</div>
              <div style={{ fontFamily: 'var(--font-display), serif', fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
                ₾{totalSpent} <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>GEL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          padding: '6px',
          marginBottom: '28px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'bookings', label: 'My Trips & Bookings', count: bookings.length, icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg> },
            { id: 'favorites', label: 'Saved Wishlist', count: favorites.length, icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> },
            { id: 'affiliate', label: 'Affiliate & Rewards', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
            { id: 'itineraries', label: 'Trip AI Itineraries', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> },
            { id: 'settings', label: 'Account & Preferences', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '14px',
                  border: 'none',
                  background: isActive ? 'var(--ink, #241712)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--ink, #241712)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(26,18,14,0.08)',
                    color: isActive ? '#ffffff' : 'var(--ink)',
                    fontWeight: 700
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: MY TRIPS & BOOKINGS
            ======================================================== */}
        {activeTab === 'bookings' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '26px',
            padding: '32px',
            boxShadow: '0 16px 40px -12px rgba(36, 24, 19, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>
                  Your Reservations &amp; Stays ({bookings.length})
                </h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
                  Live booking confirmations synchronized directly with host calendars
                </p>
              </div>

              <Link
                href="/hotels"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent, #d9653b)',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                + Book Another Experience &rarr;
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div style={{
                padding: '60px 24px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                borderRadius: '20px',
                border: '1.5px dashed rgba(26, 18, 14, 0.15)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(217, 101, 59, 0.1)',
                  color: 'var(--accent, #d9653b)',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px'
                }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '20px', margin: '0 0 8px 0', color: 'var(--ink)' }}>
                  No reservations booked yet
                </h3>
                <p style={{ color: 'var(--muted)', maxWidth: '420px', margin: '0 auto 20px', fontSize: '14px', lineHeight: 1.5 }}>
                  Discover mountain chalets in Kazbegi, vineyard estates in Kakheti, or sea-view penthouses in Batumi.
                </p>
                <Link
                  href="/hotels"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 26px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, var(--accent, #d9653b), var(--accent-deep, #be4f27))',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 6px 20px rgba(217, 101, 59, 0.35)'
                  }}
                >
                  Explore Georgian Stays
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map((booking) => {
                  const isCancelled = booking.status === 'CANCELLED';
                  return (
                    <div
                      key={booking._id}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 24px',
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(26, 18, 14, 0.08)',
                        borderRadius: '18px',
                        gap: '20px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                        opacity: isCancelled ? 0.7 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '260px' }}>
                        {booking.listing_image ? (
                          <img
                            src={booking.listing_image}
                            alt={booking.listing_title}
                            style={{ width: '92px', height: '72px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{
                            width: '92px',
                            height: '72px',
                            borderRadius: '12px',
                            background: 'rgba(217, 101, 59, 0.1)',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'var(--accent, #d9653b)',
                            flexShrink: 0
                          }}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M10 11h2M10 15h2M14 11h2M14 15h2M18 11h2M18 15h2M9 3h6v4H9z"/></svg>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            REF: {booking._id ? String(booking._id).slice(-8).toUpperCase() : 'KAYA-BK'}
                          </div>
                          <h4 style={{ fontFamily: 'var(--font-display), serif', margin: '2px 0 4px 0', fontSize: '18px', color: 'var(--ink)', fontWeight: 700 }}>
                            {booking.listing_title || 'Boutique Stay in Georgia'}
                          </h4>
                          <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                            {booking.listing_location || 'Georgia'}
                          </p>
                          <p style={{ margin: 0, color: 'var(--text-secondary, #64748b)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {booking.check_in} &rarr; {booking.check_out} ({booking.nights || 1} nights, {booking.guest_count || 2} guests)
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
                            ₾{booking.total_price} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>{booking.currency || 'GEL'}</span>
                          </div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(44, 157, 111, 0.15)' : (isCancelled ? 'rgba(0,0,0,0.06)' : 'rgba(217, 101, 59, 0.15)'),
                            color: booking.status === 'CONFIRMED' ? '#2c9d6f' : (isCancelled ? 'var(--muted)' : 'var(--accent, #d9653b)'),
                          }}>
                            {booking.status === 'CONFIRMED' && <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            {booking.status || 'CONFIRMED'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            href={`/listing/${booking.listing_id || 'sample'}`}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '999px',
                              background: 'rgba(26, 18, 14, 0.05)',
                              color: 'var(--ink)',
                              fontSize: '13px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            View
                          </Link>

                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={actionLoading === booking._id}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '999px',
                                background: 'transparent',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {actionLoading === booking._id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: SAVED WISHLIST & FAVORITES
            ======================================================== */}
        {activeTab === 'favorites' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '26px',
            padding: '32px',
            boxShadow: '0 16px 40px -12px rgba(36, 24, 19, 0.06)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>
                Your Saved Georgian Wishlist ({favorites.length})
              </h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
                All listings and experiences you heart across Kaya.ge are saved here
              </p>
            </div>

            {favoriteItems.length === 0 ? (
              <div style={{
                padding: '60px 24px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                borderRadius: '20px',
                border: '1.5px dashed rgba(26, 18, 14, 0.15)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px'
                }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '20px', margin: '0 0 8px 0', color: 'var(--ink)' }}>
                  Your wishlist is empty
                </h3>
                <p style={{ color: 'var(--muted)', maxWidth: '400px', margin: '0 auto 20px', fontSize: '14px', lineHeight: 1.5 }}>
                  Click the heart icon on any hotel, cabin, 4x4 car, or wine experience to save it for your itinerary.
                </p>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 26px',
                    borderRadius: '999px',
                    background: 'var(--ink, #241712)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}
                >
                  Browse Georgia Marketplace
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
                {favoriteItems.map((item) => {
                  const itemId = String(item._id || item.id);
                  return (
                    <div
                      key={itemId}
                      style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid rgba(26, 18, 14, 0.08)',
                        boxShadow: '0 8px 24px -8px rgba(36, 24, 19, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                    >
                      <div style={{ position: 'relative', height: '180px' }}>
                        <img
                          src={item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80'}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          onClick={() => removeFavorite(itemId)}
                          title="Remove from favorites"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#ef4444',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                      </div>

                      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {item.location || item.city || 'Georgia'}
                          </div>
                          <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '18px', margin: '4px 0 8px 0', color: 'var(--ink)' }}>
                            {item.title}
                          </h3>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(26, 18, 14, 0.06)' }}>
                          <div>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)' }}>
                              ₾{item.price_per_night || item.price || 180}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}> / {item.price_unit || 'night'}</span>
                          </div>

                          <Link
                            href={`/listing/${itemId}`}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '999px',
                              background: 'var(--accent, #d9653b)',
                              color: '#ffffff',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                          >
                            Book Stay
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: AFFILIATE & REWARDS HUB
            ======================================================== */}
        {activeTab === 'affiliate' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '26px',
            padding: '32px',
            boxShadow: '0 16px 40px -12px rgba(36, 24, 19, 0.06)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(217, 101, 59, 0.12)',
                  color: 'var(--accent, #d9653b)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/></svg>
                  KAYA Partner Rewards
                </span>

                <h2 style={{ fontFamily: 'var(--font-display), serif', margin: '0 0 10px 0', fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
                  Invite Travelers &amp; Earn 10% Lifetime Commission
                </h2>
                <p style={{ color: 'var(--text-secondary, #64748b)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  Every time someone books a hotel, car, or tour using your link, or registers as a host on Kaya.ge, you receive a direct cash payout to your Georgian bank account.
                </p>

                {/* Referral Link Capsule */}
                <div style={{
                  background: 'rgba(26, 18, 14, 0.04)',
                  border: '1px solid rgba(26, 18, 14, 0.12)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px'
                }}>
                  <input
                    type="text"
                    readOnly
                    value={`https://kaya.ge/signup?ref=${user.affiliateCode || 'KAYA2026'}`}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--ink)',
                      fontSize: '13.5px',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={copyReferral}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      background: copySuccess ? '#16a34a' : 'var(--ink, #241712)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {copySuccess ? (
                      <>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy Link
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Social Share Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out Kaya.ge to book incredible boutique stays and mountain tours in Georgia: https://kaya.ge/signup?ref=${user.affiliateCode || 'KAYA'}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      background: '#25D366',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Share WhatsApp
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`https://kaya.ge/signup?ref=${user.affiliateCode || 'KAYA'}`)}&text=${encodeURIComponent('Discover boutique hotels and experiences in Georgia on Kaya.ge!')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      background: '#0088cc',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Share Telegram
                  </a>
                </div>
              </div>

              {/* Commission Stats Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(217, 101, 59, 0.06), rgba(245, 158, 11, 0.08))',
                borderRadius: '20px',
                border: '1px solid rgba(217, 101, 59, 0.2)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '20px', margin: '0 0 16px 0', color: 'var(--ink)' }}>
                    Referral Performance
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid rgba(26,18,14,0.08)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Total Clicks</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)' }}>48</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid rgba(26,18,14,0.08)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Active Referrals</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a' }}>6</div>
                    </div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid rgba(26,18,14,0.08)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Pending Commission</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent, #d9653b)' }}>₾140.00 GEL</div>
                  </div>
                </div>

                <Link
                  href="/dashboard/affiliates"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '20px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--ink, #241712)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    textDecoration: 'none'
                  }}
                >
                  View Full Affiliate Funnel &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: TRIP MOOD AI ITINERARIES
            ======================================================== */}
        {activeTab === 'itineraries' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '26px',
            padding: '32px',
            boxShadow: '0 16px 40px -12px rgba(36, 24, 19, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>
                  Curated Georgian Itineraries
                </h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
                  Handcrafted roadmaps generated by Trip Mood AI tailored to your travel vibe
                </p>
              </div>

              <Link
                href="/trip-planner"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, var(--accent, #d9653b), #f59e0b)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(217, 101, 59, 0.3)'
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Generate New AI Trip
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {sampleItineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(26, 18, 14, 0.08)',
                    boxShadow: '0 8px 24px -8px rgba(36, 24, 19, 0.08)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ position: 'relative', height: '170px' }}>
                    <img
                      src={itinerary.cover}
                      alt={itinerary.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {itinerary.duration}
                    </div>
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--accent, #d9653b)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {itinerary.tag} &bull; {itinerary.vibe}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '19px', margin: '6px 0 12px 0', color: 'var(--ink)', fontWeight: 700 }}>
                        {itinerary.title}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {itinerary.locations.map((loc, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11.5px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'rgba(26, 18, 14, 0.05)',
                              color: 'var(--ink)'
                            }}
                          >
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/search"
                      style={{
                        padding: '10px',
                        textAlign: 'center',
                        borderRadius: '12px',
                        background: 'rgba(217, 101, 59, 0.1)',
                        color: 'var(--accent, #d9653b)',
                        fontWeight: 700,
                        fontSize: '13px',
                        textDecoration: 'none'
                      }}
                    >
                      Book Matching Stays Along Route &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ACCOUNT & SETTINGS
            ======================================================== */}
        {activeTab === 'settings' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '26px',
            padding: '32px',
            boxShadow: '0 16px 40px -12px rgba(36, 24, 19, 0.06)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>
                Account Settings &amp; Preferences
              </h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
                Manage your personal profile and display options
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '24px', border: '1px solid rgba(26, 18, 14, 0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '18px', margin: '0 0 16px 0', color: 'var(--ink)' }}>
                  Profile Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>FULL NAME</label>
                    <input type="text" readOnly value={user.name || ''} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>EMAIL ADDRESS</label>
                    <input type="email" readOnly value={user.email || ''} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>ROLE PERMISSION</label>
                    <input type="text" readOnly value={user.role || 'Tourist'} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px' }} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '24px', border: '1px solid rgba(26, 18, 14, 0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '18px', margin: '0 0 16px 0', color: 'var(--ink)' }}>
                  Regional Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>DEFAULT CURRENCY</label>
                    <select defaultValue="GEL" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '14px' }}>
                      <option value="GEL">GEL — Georgian Lari (₾)</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="USD">USD — US Dollar ($)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>NOTIFICATIONS</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', marginTop: '6px' }}>
                      <input type="checkbox" defaultChecked id="notif-email" />
                      <label htmlFor="notif-email">Email confirmations for bookings</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
