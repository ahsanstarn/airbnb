'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { key: 'overview', label: 'Dashboard' },
  { key: 'listings', label: 'My Listings' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'subscription', label: 'Subscription' },
];

export default function BusinessDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [newListing, setNewListing] = useState({ title: '', category: 'hotels', price: '', description: '', location: '' });
  const [listingSuccess, setListingSuccess] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string | undefined>>({});
  const [subscriptionPlan, setSubscriptionPlan] = useState('BASIC');
  const [token, setToken] = useState<string | null>(null);

  const [business, setBusiness] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('kaya_token');
    if (!t) { router.push('/login'); return; }
    setToken(t);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    async function loadAll() {
      setFetching(true);
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [bizRes, listRes, bookRes, revRes, statsRes, subRes] = await Promise.all([
          fetch('/api/business/me', { headers }),
          fetch('/api/business/me/listings', { headers }),
          fetch('/api/business/me/bookings', { headers }),
          fetch('/api/business/me/reviews', { headers }),
          fetch('/api/business/me/stats', { headers }),
          fetch('/api/subscriptions/me', { headers }),
        ]);
        if (bizRes.ok) { const d = await bizRes.json(); setBusiness(d); }
        if (listRes.ok) { const d = await listRes.json(); setListings(Array.isArray(d) ? d : []); }
        if (bookRes.ok) { const d = await bookRes.json(); setBookings(Array.isArray(d) ? d : []); }
        if (revRes.ok) { const d = await revRes.json(); setReviews(Array.isArray(d) ? d : []); }
        if (statsRes.ok) { const d = await statsRes.json(); setStats(d); }
        if (subRes.ok) { const d = await subRes.json(); setSubscription(d); if (d?.plan) setSubscriptionPlan(d.plan); }
      } catch (e) {
        console.error('Failed to load business data', e);
      } finally {
        setFetching(false);
      }
    }
    loadAll();
  }, [token]);

  const tokenHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: tokenHeaders(),
      body: JSON.stringify({
        title: newListing.title,
        category: newListing.category,
        price_per_night: parseFloat(newListing.price),
        description: newListing.description,
        location: newListing.location,
      }),
    });
    if (res.ok) {
      setListingSuccess('Listing created!');
      setNewListing({ title: '', category: 'hotels', price: '', description: '', location: '' });
      const listRes = await fetch('/api/business/me/listings', { headers: { Authorization: `Bearer ${token}` } });
      if (listRes.ok) { const d = await listRes.json(); setListings(Array.isArray(d) ? d : []); }
    } else {
      const err = await res.json();
      setListingSuccess(`Error: ${err.error}`);
    }
    setTimeout(() => setListingSuccess(''), 3000);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    await fetch(`/api/bookings/${bookingId}/confirm`, { method: 'PUT', headers: tokenHeaders() });
    const bookRes = await fetch('/api/business/me/bookings', { headers: { Authorization: `Bearer ${token}` } });
    if (bookRes.ok) { const d = await bookRes.json(); setBookings(Array.isArray(d) ? d : []); }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PUT', headers: tokenHeaders() });
    const bookRes = await fetch('/api/business/me/bookings', { headers: { Authorization: `Bearer ${token}` } });
    if (bookRes.ok) { const d = await bookRes.json(); setBookings(Array.isArray(d) ? d : []); }
  };

  const handleReply = async (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;
    const res = await fetch(`/api/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: tokenHeaders(),
      body: JSON.stringify({ reply: text }),
    });
    if (res.ok) {
      setReplyText(p => ({ ...p, [reviewId]: undefined }));
      const revRes = await fetch('/api/business/me/reviews', { headers: { Authorization: `Bearer ${token}` } });
      if (revRes.ok) { const d = await revRes.json(); setReviews(Array.isArray(d) ? d : []); }
    }
  };

  const handleBlockDates = async () => {
    if (selectedDates.length === 0) return;
    const listingId = listings[0]?.id;
    if (!listingId) { alert('Create a listing first'); return; }
    const sorted = [...selectedDates].sort();
    await fetch(`/api/listings/${listingId}/availability`, {
      method: 'POST',
      headers: tokenHeaders(),
      body: JSON.stringify({ action: 'block', date_from: sorted[0], date_to: sorted[sorted.length - 1], reason: 'BLOCKED' }),
    });
    setSelectedDates([]);
    setBlockedDates(prev => [...prev, ...sorted]);
  };

  const nav = (
    <>
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></Link>
          <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
          <div className="nav-links"><Link href="/klara">KLARA</Link><Link href="/search">Visitors</Link><Link href="/hotels">Stays</Link><Link href="/muse">Where to go</Link><Link href="/contact">Contact us</Link></div>
          <div className="nav-spacer"></div>
          <div className="nav-right"><Link href="/dashboard">Tourist Account</Link></div>
        </nav>
      </div>
      <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
        <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
        <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
        <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>Stays</Link>
        <Link href="/muse" onClick={() => setMobileNavOpen(false)}>Where to go</Link>
        <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact us</Link>
      </div>
    </>
  );

  if (loading) return <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}>{nav}<main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}><p style={{ color: 'rgba(36,23,18,.58)' }}>Loading…</p></main></div>;

  const glass = { borderRadius: '20px', background: 'rgba(255,251,246,.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)' };

  const renderCalendar = () => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`e${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isBlocked = blockedDates.includes(dateStr);
      const isSelected = selectedDates.includes(dateStr);
      days.push(
        <button key={d} onClick={() => {
          if (isSelected) setSelectedDates(prev => prev.filter(x => x !== dateStr));
          else setSelectedDates(prev => [...prev, dateStr]);
        }} style={{
          aspectRatio: '1', borderRadius: '10px', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          background: isBlocked ? '#b87a55' : isSelected ? '#1a120e' : 'rgba(255,252,247,.7)',
          color: isBlocked || isSelected ? '#fff8ef' : 'var(--ink)',
          transition: 'all .15s',
        }}>{d}</button>
      );
    }
    return days;
  };

  const showBusinessWarning = !fetching && !business;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      {nav}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 60px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '10px 18px', borderRadius: '999px', border: '0', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
              background: activeTab === t.key ? '#1a120e' : 'rgba(255,251,246,.7)', color: activeTab === t.key ? '#fff8ef' : 'var(--muted)',
              transition: 'all .25s', boxShadow: activeTab === t.key ? '0 4px 12px rgba(26,18,14,.15)' : 'none',
            }}>{t.label}</button>
          ))}
          <Link href="/business/register" style={{ marginLeft: 'auto', padding: '10px 18px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textDecoration: 'none' }}>Settings</Link>
        </div>

        {showBusinessWarning && (
          <div style={{ ...glass, padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>You haven&apos;t registered a business yet.</p>
            <Link href="/business/register" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: '999px', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Register Your Business</Link>
          </div>
        )}

        {fetching && <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px', fontSize: '13px' }}>Loading data…</p>}

        {!fetching && business && activeTab === 'overview' && (
          <>
            <div style={{ ...glass, padding: '28px 32px', marginBottom: '24px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.5rem,3vw,2rem)', fontFamily: 'var(--font-display), serif', fontWeight: 700 }}>{business.name}</h1>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>{business.category} · {business.is_verified ? '✓ Verified' : 'Unverified'} · {business.subscription_plan} plan</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'Revenue (MTD)', value: `₾${(stats?.total_revenue || 0).toLocaleString()}`, color: '#b87a55' },
                { label: 'Listing Views', value: stats?.total_views || 0, color: '#8855b8' },
                { label: 'Avg Rating', value: stats?.avg_rating || '—', color: '#55b884' },
                { label: 'Bookings Today', value: stats?.bookings_today || 0, color: '#b8558a', live: true },
              ].map(s => (
                <div key={s.label} style={{ ...glass, padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  {s.live && <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '.1em' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,.5)', animation: 'pulse-glow 1.5s infinite' }}></span>LIVE</div>}
                  <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 'clamp(1.3rem,2.5vw,2rem)', fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ ...glass, padding: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1rem', fontWeight: 700, margin: '0 0 14px' }}>Recent Bookings</h3>
                {bookings.length > 0 ? bookings.slice(0, 3).map((b: any) => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(26,18,14,.06)', fontSize: '13px' }}>
                    <div><strong>{b.tourist_id?.slice(0, 8) || 'Guest'}</strong><br /><span style={{ color: 'var(--muted)', fontSize: '11px' }}>{b.listings?.title || 'Listing'}</span></div>
                    <span style={{ padding: '3px 8px', borderRadius: '999px', background: b.status === 'PENDING' ? 'rgba(236,198,166,.5)' : b.status === 'CONFIRMED' ? 'rgba(34,197,94,.15)' : 'rgba(107,114,128,.15)', color: b.status === 'PENDING' ? '#7a4530' : b.status === 'CONFIRMED' ? '#22c55e' : '#6b7280', fontSize: '10px', fontWeight: 700 }}>{b.status}</span>
                  </div>
                )) : <p style={{ fontSize: '13px', color: 'var(--muted)' }}>No bookings yet</p>}
              </div>
              <div style={{ ...glass, padding: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1rem', fontWeight: 700, margin: '0 0 14px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setActiveTab('listings')} style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', textDecoration: 'none', color: 'inherit', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>+ Add New Listing</button>
                  <button onClick={() => setActiveTab('bookings')} style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', textDecoration: 'none', color: 'inherit', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>📋 View Pending Bookings ({bookings.filter((b: any) => b.status === 'PENDING').length})</button>
                  <button onClick={() => setActiveTab('subscription')} style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', textDecoration: 'none', color: 'inherit', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>⚙ Manage Subscription</button>
                </div>
              </div>
            </div>
          </>
        )}

        {!fetching && business && activeTab === 'listings' && (
          <div style={{ ...glass, padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>My Listings</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {listings.length > 0 ? listings.map((l: any) => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: `url(${l.images?.[0] || ''}) 50%/cover`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: '14px', display: 'block' }}>{l.title}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{l.category} · ₾{l.price_per_night}/night · {l.views_count || 0} views · {l.review_count || 0} reviews</span>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', background: l.is_published ? 'rgba(34,197,94,.15)' : 'rgba(236,198,166,.5)', color: l.is_published ? '#22c55e' : '#7a4530', fontSize: '11px', fontWeight: 700 }}>{l.is_published ? 'Published' : 'Draft'}</span>
                </div>
              )) : <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '16px', fontSize: '13px' }}>No listings yet</p>}
            </div>
            <div style={{ borderTop: '1px solid rgba(26,18,14,.08)', paddingTop: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px' }}>Add New Listing</h3>
              {listingSuccess && <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', color: '#287a43', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>{listingSuccess}</div>}
              <form onSubmit={handleCreateListing} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <input value={newListing.title} onChange={e => setNewListing(p => ({ ...p, title: e.target.value }))} required placeholder="Title" style={{ gridColumn: '1 / -1', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                <select value={newListing.category} onChange={e => setNewListing(p => ({ ...p, category: e.target.value }))} style={{ padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }}>
                  <option value="hotels">Hotel</option>
                  <option value="guesthouses">Guesthouse</option>
                  <option value="apartments">Apartment</option>
                  <option value="cabins">Cabin</option>
                  <option value="villas">Villa</option>
                  <option value="restaurants">Restaurant</option>
                  <option value="cars">Car Rental</option>
                  <option value="tours">Tour</option>
                  <option value="services">Service</option>
                  <option value="salons">Salon</option>
                </select>
                <input type="number" value={newListing.price} onChange={e => setNewListing(p => ({ ...p, price: e.target.value }))} required placeholder="Price per night (GEL)" style={{ padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                <input value={newListing.location} onChange={e => setNewListing(p => ({ ...p, location: e.target.value }))} required placeholder="Location" style={{ gridColumn: '1 / -1', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                <textarea value={newListing.description} onChange={e => setNewListing(p => ({ ...p, description: e.target.value }))} required placeholder="Description" rows={2} style={{ gridColumn: '1 / -1', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                <button type="submit" style={{ gridColumn: '1 / -1', padding: '14px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Create Listing</button>
              </form>
            </div>
          </div>
        )}

        {!fetching && business && activeTab === 'bookings' && (
          <div style={{ ...glass, padding: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Bookings Manager</h2>
            {bookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.map((b: any) => (
                  <div key={b.id} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '14px' }}>{b.tourist_id?.slice(0, 8) || 'Guest'}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>{b.listings?.title || 'Listing'} · {b.guest_count} guest{b.guest_count > 1 ? 's' : ''}</span>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>{b.check_in?.slice(0, 10)} → {b.check_out?.slice(0, 10)}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>₾{b.total_price}</div>
                        <span style={{ padding: '3px 8px', borderRadius: '999px', background: b.status === 'PENDING' ? 'rgba(236,198,166,.5)' : b.status === 'CONFIRMED' ? 'rgba(34,197,94,.15)' : 'rgba(107,114,128,.15)', color: b.status === 'PENDING' ? '#7a4530' : b.status === 'CONFIRMED' ? '#22c55e' : '#6b7280', fontSize: '10px', fontWeight: 700 }}>{b.status}</span>
                      </div>
                    </div>
                    {b.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleConfirmBooking(b.id)} style={{ flex: 1, padding: '10px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>✓ Confirm</button>
                        <button onClick={() => handleDeclineBooking(b.id)} style={{ flex: 1, padding: '10px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', color: 'var(--muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>✕ Decline</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px', fontSize: '13px' }}>No bookings yet</p>
            )}
          </div>
        )}

        {!fetching && business && activeTab === 'calendar' && (
          <div style={{ ...glass, padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Availability Calendar</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); } else setCalendarMonth(m => m - 1); }} style={{ padding: '8px 14px', borderRadius: '999px', border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>← Prev</button>
                <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); } else setCalendarMonth(m => m + 1); }} style={{ padding: '8px 14px', borderRadius: '999px', border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Next →</button>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
              {new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '16px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--muted)', padding: '4px' }}>{d}</div>)}
              {renderCalendar()}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Selected: {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''}</span>
              <button onClick={() => setSelectedDates([])} style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Clear</button>
              <button onClick={handleBlockDates} style={{ padding: '8px 16px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                {selectedDates.length > 0 ? `Block ${selectedDates.length} date${selectedDates.length !== 1 ? 's' : ''}` : 'Select dates to block'}
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted)' }}>
                <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', background: '#b87a55', marginRight: '4px', verticalAlign: 'middle' }}></span> Booked</span>
                <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,252,247,.7)', border: '1px solid rgba(26,18,14,.12)', marginRight: '4px', verticalAlign: 'middle' }}></span> Available</span>
              </div>
            </div>
          </div>
        )}

        {!fetching && business && activeTab === 'reviews' && (
          <div style={{ ...glass, padding: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Reviews Manager</h2>
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map((r: any) => (
                  <div key={r.id} style={{ padding: '18px 20px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>{r.tourist_id?.slice(0, 8) || 'Guest'}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{new Date(r.created_at).toLocaleDateString()} · {r.listings?.title || 'Listing'}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#e8a838', marginBottom: '6px' }}>{'★'.repeat(r.overall_rating)}{'☆'.repeat(5 - r.overall_rating)}</div>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, margin: '0 0 12px', color: 'rgba(36,23,18,.7)' }}>{r.text}</p>
                    {r.business_reply && (
                      <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(26,18,14,.04)', fontSize: '12px', marginBottom: '12px', color: 'rgba(36,23,18,.6)' }}>
                        <strong style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>Your reply:</strong>
                        {r.business_reply}
                      </div>
                    )}
                    <div>
                      {replyText[r.id] !== undefined ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input value={replyText[r.id] || ''} onChange={e => setReplyText(p => ({ ...p, [r.id]: e.target.value }))} placeholder="Write your reply..." style={{ flex: 1, padding: '10px 14px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '12px', outline: 'none' }} />
                          <button onClick={() => handleReply(r.id)} style={{ padding: '10px 18px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Send</button>
                        </div>
                      ) : !r.business_reply ? (
                        <button onClick={() => setReplyText(p => ({ ...p, [r.id]: '' }))} style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Reply</button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px', fontSize: '13px' }}>No reviews yet</p>
            )}
          </div>
        )}

        {!fetching && business && activeTab === 'subscription' && (
          <div style={{ ...glass, padding: '28px', maxWidth: '640px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 24px' }}>Subscription & Billing</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '20px', borderRadius: '16px', border: subscriptionPlan === 'BASIC' ? '2px solid #1a120e' : '1px solid rgba(26,18,14,.1)', background: subscriptionPlan === 'BASIC' ? 'rgba(26,18,14,.03)' : 'rgba(255,252,247,.9)', cursor: 'pointer' }} onClick={() => setSubscriptionPlan('BASIC')}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>Basic</h3>
                <p style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#1a120e' }}>₾20<span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--muted)' }}>/month</span></p>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>Perfect for single listings</p>
              </div>
              <div style={{ padding: '20px', borderRadius: '16px', border: subscriptionPlan === 'PRO' ? '2px solid #1a120e' : '1px solid rgba(26,18,14,.1)', background: subscriptionPlan === 'PRO' ? 'rgba(26,18,14,.03)' : 'rgba(255,252,247,.9)', cursor: 'pointer', position: 'relative' }} onClick={() => setSubscriptionPlan('PRO')}>
                <span style={{ position: 'absolute', top: '-8px', right: '16px', padding: '3px 10px', borderRadius: '999px', background: '#b87a55', color: '#fff8ef', fontSize: '10px', fontWeight: 700 }}>Popular</span>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>Pro</h3>
                <p style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#1a120e' }}>₾60<span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--muted)' }}>/month</span></p>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>Up to 5 listings + analytics</p>
              </div>
            </div>
            <button style={{ width: '100%', padding: '14px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginBottom: '24px' }}>
              {subscriptionPlan === 'BASIC' ? 'Current Plan' : 'Upgrade to Pro — ₾60/month'}
            </button>
            <div style={{ borderTop: '1px solid rgba(26,18,14,.08)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', margin: '0 0 12px' }}>Payment History</h4>
              <p style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center', padding: '16px' }}>Payment history will appear here after first billing.</p>
            </div>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand"><div className="footer-logo"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></div><p className="footer-tagline">Discover Georgia, your way.</p></div>
          <div className="footer-links"><h4>Stays</h4><Link href="/hotels">Hotels</Link><Link href="/apartments">Apartments</Link><Link href="/search?type=guesthouses">Guesthouses</Link><Link href="/search?type=cabins">Cabins</Link></div>
          <div className="footer-links"><h4>Discover</h4><Link href="/muse">Where to go</Link><Link href="/blog">Travel blog</Link><Link href="/about">About us</Link><Link href="/careers">Careers</Link></div>
          <div className="footer-links"><h4>Support</h4><Link href="/contact">Contact us</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/resources">Resources</Link></div>
        </div>
        <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; crafted in Tbilisi</span></div>
      </footer>
    </div>
  );
}
