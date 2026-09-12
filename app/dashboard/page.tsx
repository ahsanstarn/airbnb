'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TouristDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
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
      } catch (err) {
        setError('Failed to load user data');
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
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const copyReferral = () => {
    if (user?.affiliateCode) {
      navigator.clipboard.writeText(`https://kaya.ge/signup?ref=${user.affiliateCode}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--surface, #fff7ef)', color: 'var(--ink, #241712)' }}>
        <p style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.2rem' }}>Loading your dashboard...</p>
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

  const cardStyle = {
    backgroundColor: 'var(--card-bg, rgba(255, 252, 248, 0.94))',
    border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))',
    borderRadius: '24px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 12px 32px -8px rgba(36, 24, 19, 0.08)',
    backdropFilter: 'blur(16px)',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, var(--accent, #d9653b), var(--accent-deep, #be4f27))',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '12px 22px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 6px 18px -3px rgba(217, 101, 59, 0.35)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const secondaryButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.85)',
    color: 'var(--ink, #241712)',
    border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
    borderRadius: '999px',
    padding: '10px 18px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13.5px',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background 0.2s, transform 0.2s',
  };

  const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');

  return (
    <div style={{ background: 'radial-gradient(900px circle at 8% 8%, rgba(255, 215, 188, 0.45), transparent 60%), radial-gradient(700px circle at 92% 96%, hsla(21, 76%, 82%, 0.35), transparent 60%), linear-gradient(180deg, var(--surface, #fff7ef), var(--surface-warm, #f8e2cb) 65%, var(--surface-deep, #f3d1b3))', color: 'var(--ink, #241712)', minHeight: '100vh', padding: '100px 24px 60px', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display), serif', margin: '0 0 8px 0', fontSize: '32px', fontWeight: 700, color: 'var(--ink)' }}>Welcome back, {user.name}</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ 
                backgroundColor: 'rgba(217, 101, 59, 0.12)', 
                color: 'var(--accent, #d9653b)',
                padding: '4px 14px', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {user.role || 'Tourist'}
              </span>
              <span style={{ color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontSize: '13px' }}>
                Ref Code: <strong style={{ color: 'var(--accent, #d9653b)' }}>{user.affiliateCode}</strong>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/" style={secondaryButtonStyle}>Browse Listings</Link>
            <button onClick={handleLogout} style={secondaryButtonStyle}>Logout</button>
          </div>
        </div>

        {/* Top 2 Cards: Profile & Affiliate */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', marginTop: 0, marginBottom: '16px', fontSize: '20px', color: 'var(--ink)' }}>Profile Information</h2>
            <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}><strong>Name:</strong> {user.name}</p>
            <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}><strong>Email:</strong> {user.email}</p>
            <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}><strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', marginTop: 0, marginBottom: '16px', fontSize: '20px', color: 'var(--ink)' }}>Affiliate Program</h2>
            <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
              Share your personal referral link to invite travelers or hosts and earn commissions!
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text" 
                readOnly 
                value={`https://kaya.ge/signup?ref=${user.affiliateCode || 'PENDING'}`}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#fff', 
                  border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', 
                  color: 'var(--ink)',
                  padding: '10px 14px', 
                  borderRadius: '12px',
                  fontSize: '13px'
                }}
              />
              <button onClick={copyReferral} style={secondaryButtonStyle}>
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button onClick={() => router.push('/dashboard/affiliates')} style={{ ...buttonStyle, width: '100%', background: 'none', border: '1.5px solid var(--accent, #d9653b)', color: 'var(--accent, #d9653b)', boxShadow: 'none' }}>
              View Full Affiliate Stats & Earnings &rarr;
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {[
            { label: 'Active Trips', val: activeBookings.length.toString() },
            { label: 'Total Bookings', val: bookings.length.toString() },
            { label: 'Total Spent', val: `₾${bookings.filter(b => b.status !== 'CANCELLED').reduce((acc, b) => acc + (b.total_price || 0), 0)} GEL` }
          ].map((stat, i) => (
            <div key={i} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontSize: '13.5px', fontWeight: 600 }}>{stat.label}</h3>
              <p style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--ink)' }}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Bookings Section */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '22px', color: 'var(--ink)' }}>Your Stays &amp; Reservations ({bookings.length})</h2>
            <Link href="/hotels" style={{ color: 'var(--accent, #d9653b)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>+ Book Another Stay</Link>
          </div>

          {bookings.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '16px', border: '1px dashed var(--border-mid)' }}>
              <p style={{ color: 'var(--muted)', margin: '0 0 16px 0', fontSize: '15px' }}>
                No reservations yet. Discover the most unique boutique stays in Georgia!
              </p>
              <Link href="/hotels" style={buttonStyle}>
                Explore Georgian Stays
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((booking) => (
                <div 
                  key={booking._id} 
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    backgroundColor: '#fff',
                    border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))',
                    borderRadius: '16px',
                    gap: '16px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
                    {booking.listing_image && (
                      <img 
                        src={booking.listing_image} 
                        alt={booking.listing_title} 
                        style={{ width: '80px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display), serif', margin: '0 0 4px 0', fontSize: '17px', color: 'var(--ink)' }}>{booking.listing_title}</h4>
                      <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '13px' }}>
                        📍 {booking.listing_location}
                      </p>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '12px' }}>
                        📅 {booking.check_in} &rarr; {booking.check_out} ({booking.nights || 1} nights, {booking.guest_count} guests)
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--ink)' }}>
                        ₾{booking.total_price} {booking.currency || 'GEL'}
                      </div>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(44, 157, 111, 0.15)' : (booking.status === 'CANCELLED' ? 'rgba(0,0,0,0.06)' : 'rgba(217, 101, 59, 0.15)'),
                        color: booking.status === 'CONFIRMED' ? '#2c9d6f' : (booking.status === 'CANCELLED' ? 'var(--muted)' : 'var(--accent, #d9653b)'),
                      }}>
                        {booking.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link 
                        href={`/listing/${booking.listing_id}`}
                        style={secondaryButtonStyle}
                      >
                        View Stay
                      </Link>
                      {booking.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={actionLoading === booking._id}
                          style={{
                            ...secondaryButtonStyle,
                            color: '#d04a3b',
                            borderColor: 'rgba(208, 74, 59, 0.3)'
                          }}
                        >
                          {actionLoading === booking._id ? '...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', marginTop: 0, marginBottom: '16px', fontSize: '20px', color: 'var(--ink)' }}>Quick Explore</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/hotels" style={buttonStyle}>Browse Hotels &amp; Stays</Link>
            <Link href="/tours" style={buttonStyle}>Browse Georgian Tours</Link>
            <Link href="/restaurants" style={buttonStyle}>Explore Georgian Cuisine</Link>
            <Link href="/muse" style={secondaryButtonStyle}>Visit Muse Guide</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
