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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0e0e10', color: '#f5f5f5' }}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0e0e10', color: '#f5f5f5' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) return null;

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px'
  };

  const buttonStyle = {
    backgroundColor: '#E8604C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const secondaryButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');

  return (
    <div style={{ backgroundColor: '#0e0e10', color: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Welcome back, {user.name}</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {user.role || 'Tourist'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                Ref Code: <strong style={{ color: '#E8604C' }}>{user.affiliateCode}</strong>
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
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Profile Information</h2>
            <p style={{ margin: '8px 0', color: 'rgba(255,255,255,0.7)' }}><strong>Name:</strong> {user.name}</p>
            <p style={{ margin: '8px 0', color: 'rgba(255,255,255,0.7)' }}><strong>Email:</strong> {user.email}</p>
            <p style={{ margin: '8px 0', color: 'rgba(255,255,255,0.7)' }}><strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Affiliate Program</h2>
            <p style={{ margin: '0 0 16px 0', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              Share your link with travelers or hosts to earn affiliate commissions!
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text" 
                readOnly 
                value={`https://kaya.ge/signup?ref=${user.affiliateCode || 'PENDING'}`}
                style={{ 
                  flex: 1, 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}
              />
              <button onClick={copyReferral} style={secondaryButtonStyle}>
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button onClick={() => router.push('/dashboard/affiliates')} style={{ ...buttonStyle, width: '100%', backgroundColor: 'transparent', border: '1px solid #E8604C', color: '#E8604C' }}>
              View Full Affiliate Stats & Earnings &rarr;
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {[
            { label: 'Active Trips', val: activeBookings.length.toString() },
            { label: 'Total Bookings', val: bookings.length.toString() },
            { label: 'Total Spent', val: `${bookings.filter(b => b.status !== 'CANCELLED').reduce((acc, b) => acc + (b.total_price || 0), 0)} GEL` }
          ].map((stat, i) => (
            <div key={i} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 'normal' }}>{stat.label}</h3>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Bookings Section */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Your Stays & Reservations ({bookings.length})</h2>
            <Link href="/hotels" style={{ color: '#E8604C', fontSize: '14px', textDecoration: 'none' }}>+ Book Another Stay</Link>
          </div>

          {bookings.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 16px 0', fontSize: '16px' }}>
                No reservations yet. Discover the most unique stays in Georgia!
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
                    padding: '16px',
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
                    {booking.listing_image && (
                      <img 
                        src={booking.listing_image} 
                        alt={booking.listing_title} 
                        style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{booking.listing_title}</h4>
                      <p style={{ margin: '0 0 4px 0', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                        📍 {booking.listing_location}
                      </p>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                        📅 {booking.check_in} &rarr; {booking.check_out} ({booking.nights || 1} nights, {booking.guest_count} guests)
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                        {booking.total_price} {booking.currency || 'GEL'}
                      </div>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(44, 157, 111, 0.2)' : (booking.status === 'CANCELLED' ? 'rgba(255,255,255,0.1)' : 'rgba(232, 96, 76, 0.2)'),
                        color: booking.status === 'CONFIRMED' ? '#2c9d6f' : (booking.status === 'CANCELLED' ? '#999' : '#E8604C'),
                      }}>
                        {booking.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link 
                        href={`/listing/${booking.listing_id}`}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '12px'
                        }}
                      >
                        View Stay
                      </Link>
                      {booking.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={actionLoading === booking._id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#E8604C',
                            cursor: 'pointer',
                            fontSize: '12px'
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
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Quick Explore</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/hotels" style={buttonStyle}>Browse Hotels & Stays</Link>
            <Link href="/tours" style={buttonStyle}>Browse Georgian Tours</Link>
            <Link href="/restaurants" style={buttonStyle}>Explore Georgian Cuisine</Link>
            <Link href="/muse" style={secondaryButtonStyle}>Visit Muse Guide</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
