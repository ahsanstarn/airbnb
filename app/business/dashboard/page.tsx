'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New listing form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'apartments',
    type: 'Entire apartment',
    price_per_night: '',
    location: '',
    city: 'Tbilisi',
    beds: '2',
    baths: '1',
    guests: '4',
    amenities: 'WiFi, Kitchen, Air conditioning, Mountain view',
    images: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop',
  });

  const fetchData = async () => {
    try {
      // 1. Fetch user
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'business' && data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);

      // 2. Fetch business listings from MongoDB
      const listingsRes = await fetch('/api/listings?mine=true');
      if (listingsRes.ok) {
        const listData = await listingsRes.json();
        setListings(listData.listings || []);
      }

      // 3. Fetch incoming bookings
      const bookingsRes = await fetch('/api/bookings');
      if (bookingsRes.ok) {
        const bookData = await bookingsRes.json();
        setBookings(Array.isArray(bookData) ? bookData : []);
      }
    } catch {
      setError('Failed to load business dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price_per_night: parseFloat(formData.price_per_night),
          amenities: formData.amenities.split(',').map(s => s.trim()),
          images: [formData.images],
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setListings(prev => [result.listing, ...prev]);
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          category: 'apartments',
          type: 'Entire apartment',
          price_per_night: '',
          location: '',
          city: 'Tbilisi',
          beds: '2',
          baths: '1',
          guests: '4',
          amenities: 'WiFi, Kitchen, Air conditioning, Mountain view',
          images: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop',
        });
        alert('Listing published successfully to Kaya.ge!');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create listing');
      }
    } catch {
      alert('Error creating listing');
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/confirm`, { method: 'PUT' });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'CONFIRMED' } : b));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    if (!confirm('Decline this booking?')) return;
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PUT' });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--surface, #fff7ef)', color: 'var(--ink, #241712)' }}>
        <p style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.2rem' }}>Loading Business Dashboard...</p>
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

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((acc, b) => acc + (b.total_price || 0), 0);

  return (
    <div style={{ background: 'radial-gradient(900px circle at 8% 8%, rgba(255, 215, 188, 0.45), transparent 60%), radial-gradient(700px circle at 92% 96%, hsla(21, 76%, 82%, 0.35), transparent 60%), linear-gradient(180deg, var(--surface, #fff7ef), var(--surface-warm, #f8e2cb) 65%, var(--surface-deep, #f3d1b3))', color: 'var(--ink, #241712)', minHeight: '100vh', padding: '100px 24px 60px', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display), serif', margin: '0 0 8px 0', fontSize: '32px', fontWeight: 700, color: 'var(--ink)' }}>Business Host Portal</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '15px', color: 'var(--text-secondary, rgba(36,23,18,0.72))' }}>Welcome, {user.name}</span>
              <span style={{ 
                backgroundColor: 'rgba(217, 101, 59, 0.12)', 
                color: 'var(--accent, #d9653b)',
                padding: '4px 14px', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Verified Host
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShowCreateModal(true)} style={buttonStyle}>+ Create Listing</button>
            <button onClick={handleLogout} style={secondaryButtonStyle}>Logout</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {[
            { label: 'Active Listings', val: listings.length.toString() }, 
            { label: 'Incoming Bookings', val: bookings.length.toString() }, 
            { label: 'Total Host Revenue', val: `₾${totalRevenue} GEL` },
            { label: 'Subscription Plan', val: '20 GEL/mo (Active)' }
          ].map((stat, i) => (
            <div key={i} style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontSize: '13px', fontWeight: 600 }}>{stat.label}</h3>
              <p style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '26px', fontWeight: 'bold', color: 'var(--ink)' }}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Main Content: My Listings */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '22px', color: 'var(--ink)' }}>Your Properties &amp; Listings ({listings.length})</h2>
            <button onClick={() => setShowCreateModal(true)} style={{ ...buttonStyle, padding: '8px 16px', fontSize: '13px' }}>
              + Add Property
            </button>
          </div>

          {listings.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '16px', border: '1px dashed var(--border-mid)' }}>
              <p style={{ color: 'var(--muted)', margin: '0 0 16px 0', fontSize: '15px' }}>No listings created yet. Publish your first property on Kaya.ge!</p>
              <button onClick={() => setShowCreateModal(true)} style={buttonStyle}>Create Listing Now</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {listings.map((l) => (
                <div key={l._id} style={{ backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                  <img 
                    src={l.images?.[0] || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop'} 
                    alt={l.title} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent, #d9653b)', fontWeight: 'bold' }}>{l.category}</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)' }}>₾{l.price_per_night} / night</span>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-display), serif', margin: '0 0 6px 0', fontSize: '16px', color: 'var(--ink)' }}>{l.title}</h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--muted)' }}>📍 {l.location}</p>
                    <Link href={`/listing/${l._id}`} style={{ ...secondaryButtonStyle, width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                      View on Kaya.ge
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming Guest Bookings */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', marginTop: 0, marginBottom: '20px', fontSize: '22px', color: 'var(--ink)' }}>Incoming Guest Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '16px', border: '1px dashed var(--border-mid)' }}>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: '15px' }}>No guest bookings yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bookings.map(b => (
                <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))', borderRadius: '16px', flexWrap: 'wrap', gap: '14px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display), serif', margin: '0 0 4px 0', fontSize: '17px', color: 'var(--ink)' }}>{b.listing_title}</h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Guest: <strong>{b.tourist_name || b.tourist_email || 'Guest'}</strong> ({b.guest_count} guests)
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                      Dates: {b.check_in} &rarr; {b.check_out} ({b.nights || 1} nights)
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--ink)' }}>₾{b.total_price} GEL</div>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: b.status === 'CONFIRMED' ? 'rgba(44, 157, 111, 0.15)' : 'rgba(217, 101, 59, 0.15)',
                        color: b.status === 'CONFIRMED' ? '#2c9d6f' : 'var(--accent, #d9653b)'
                      }}>
                        {b.status}
                      </span>
                    </div>
                    {b.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleConfirmBooking(b._id)} disabled={actionLoading === b._id} style={{ ...buttonStyle, padding: '8px 14px', fontSize: '12px' }}>
                          Accept
                        </button>
                        <button onClick={() => handleDeclineBooking(b._id)} disabled={actionLoading === b._id} style={{ ...secondaryButtonStyle, padding: '8px 14px', fontSize: '12px' }}>
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Affiliate Program Widget */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', marginTop: 0, marginBottom: '16px', fontSize: '20px', color: 'var(--ink)' }}>Host Referral &amp; Affiliate Program</h2>
          <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            Earn bonuses by inviting other property owners and tourists to register on Kaya.ge!
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
          <button onClick={() => router.push('/dashboard/affiliates')} style={{ ...buttonStyle, background: 'none', border: '1.5px solid var(--accent, #d9653b)', color: 'var(--accent, #d9653b)', boxShadow: 'none' }}>
            View Affiliate Referrals &amp; Stats &rarr;
          </button>
        </div>

      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(26, 18, 14, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg, #fffdf9)',
            border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display), serif', margin: 0, fontSize: '24px', color: 'var(--ink)' }}>Add New Listing</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--ink)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Property Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Modern Loft in Old Tbilisi" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                  >
                    <option value="apartments">Apartment</option>
                    <option value="hotels">Hotel / Suite</option>
                    <option value="guesthouses">Guesthouse</option>
                    <option value="cabins">Cabin / Chalet</option>
                    <option value="villas">Villa</option>
                    <option value="tours">Tour / Experience</option>
                    <option value="restaurants">Restaurant</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Price per Night (GEL)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="150" 
                    value={formData.price_per_night} 
                    onChange={e => setFormData({ ...formData, price_per_night: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>City / Region</label>
                  <select 
                    value={formData.city} 
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                  >
                    <option value="Tbilisi">Tbilisi</option>
                    <option value="Batumi">Batumi</option>
                    <option value="Kazbegi">Kazbegi</option>
                    <option value="Kakheti">Kakheti</option>
                    <option value="Kutaisi">Kutaisi</option>
                    <option value="Mestia">Mestia (Svaneti)</option>
                    <option value="Borjomi">Borjomi</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Location Details</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Tbilisi, Vera" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe your space, views, Georgian hospitality..." 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Amenities (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.amenities} 
                  onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Cover Image URL</label>
                <input 
                  type="url" 
                  value={formData.images} 
                  onChange={e => setFormData({ ...formData, images: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#fff', border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))', borderRadius: '10px', color: 'var(--ink)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" disabled={creating} style={{ ...buttonStyle, flex: 1 }}>
                  {creating ? 'Saving...' : 'Publish Listing'}
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} style={secondaryButtonStyle}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
