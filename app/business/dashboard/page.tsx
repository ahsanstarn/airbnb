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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0e0e10', color: '#f5f5f5' }}>
        <p>Loading Business Dashboard...</p>
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
    padding: '10px 18px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'opacity 0.2s',
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
    textDecoration: 'none',
    display: 'inline-block',
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((acc, b) => acc + (b.total_price || 0), 0);

  return (
    <div style={{ backgroundColor: '#0e0e10', color: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Business Host Portal</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>Welcome, {user.name}</span>
              <span style={{ 
                backgroundColor: 'rgba(232, 96, 76, 0.15)', 
                color: '#E8604C',
                padding: '4px 12px', 
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
            { label: 'Total Host Revenue', val: `${totalRevenue} GEL` },
            { label: 'Subscription Plan', val: '20 GEL/mo (Active)' }
          ].map((stat, i) => (
            <div key={i} style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 'normal' }}>{stat.label}</h3>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Main Content: My Listings */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Your Properties & Listings ({listings.length})</h2>
            <button onClick={() => setShowCreateModal(true)} style={{ ...buttonStyle, padding: '6px 12px', fontSize: '12px' }}>
              + Add Property
            </button>
          </div>

          {listings.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 16px 0' }}>No listings created yet. Publish your first property on Kaya.ge!</p>
              <button onClick={() => setShowCreateModal(true)} style={buttonStyle}>Create Listing Now</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {listings.map((l) => (
                <div key={l._id} style={{ backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                  <img 
                    src={l.images?.[0] || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop'} 
                    alt={l.title} 
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#E8604C', fontWeight: 'bold' }}>{l.category}</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{l.price_per_night} GEL / night</span>
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fff' }}>{l.title}</h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>📍 {l.location}</p>
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
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Incoming Guest Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No guest bookings yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bookings.map(b => (
                <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '8px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{b.listing_title}</h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                      Guest: <strong>{b.tourist_name || b.tourist_email || 'Guest'}</strong> ({b.guest_count} guests)
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      Dates: {b.check_in} &rarr; {b.check_out} ({b.nights || 1} nights)
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{b.total_price} GEL</div>
                      <span style={{ fontSize: '11px', color: b.status === 'CONFIRMED' ? '#2c9d6f' : '#E8604C' }}>{b.status}</span>
                    </div>
                    {b.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleConfirmBooking(b._id)} disabled={actionLoading === b._id} style={{ ...buttonStyle, padding: '6px 10px', fontSize: '12px' }}>
                          Accept
                        </button>
                        <button onClick={() => handleDeclineBooking(b._id)} disabled={actionLoading === b._id} style={{ ...secondaryButtonStyle, padding: '6px 10px', fontSize: '12px' }}>
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
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Host Referral & Affiliate Program</h2>
          <p style={{ margin: '0 0 16px 0', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Earn bonuses by inviting other property owners and tourists to register on Kaya.ge!
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
                padding: '10px 14px',
                borderRadius: '6px'
              }}
            />
            <button onClick={copyReferral} style={secondaryButtonStyle}>
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button onClick={() => router.push('/dashboard/affiliates')} style={{ ...buttonStyle, backgroundColor: 'transparent', border: '1px solid #E8604C', color: '#E8604C' }}>
            View Affiliate Referrals & Stats &rarr;
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
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#16161a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '550px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Add New Listing</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>Property Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Modern Loft in Old Tbilisi" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#222', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
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
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>Price per Night (GEL)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="150" 
                    value={formData.price_per_night} 
                    onChange={e => setFormData({ ...formData, price_per_night: e.target.value })}
                    style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>City / Region</label>
                  <select 
                    value={formData.city} 
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#222', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
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
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>Location Details</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Tbilisi, Vera" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe your space, views, Georgian hospitality..." 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>Amenities (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.amenities} 
                  onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>Cover Image URL</label>
                <input 
                  type="url" 
                  value={formData.images} 
                  onChange={e => setFormData({ ...formData, images: e.target.value })}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
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
