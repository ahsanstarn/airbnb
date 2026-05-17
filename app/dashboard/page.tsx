'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'bookings', label: 'My Bookings' },
  { key: 'saved', label: 'Saved' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'profile', label: 'Profile' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState('Guest');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ listing: '', rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', nationality: 'Georgia', language: 'English' });
  const [bookings, setBookings] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem('kaya_token');
      if (!token) { router.replace('/login'); return; }
      const res = await fetch('/api/auth/session', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.user?.email) { router.replace('/login'); return; }
      setEmail(data.user.email);
      setName(data.user.user_metadata?.name || 'Guest');
      setProfileForm(p => ({ ...p, name: data.user.user_metadata?.name || '', nationality: data.user.user_metadata?.nationality || 'Georgia' }));
      setLoading(false);
      loadData(token);
    }
    checkSession();
  }, [router]);

  async function loadData(token: string) {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [bookingsRes, savedRes, reviewsRes] = await Promise.all([
        fetch('/api/bookings', { headers }),
        fetch('/api/users/me/saved', { headers }),
        fetch('/api/reviews?tourist_id=me', { headers }),
      ]);
      if (bookingsRes.ok) { const d = await bookingsRes.json(); setBookings(Array.isArray(d) ? d : []); }
      if (savedRes.ok) { const d = await savedRes.json(); setSaved(Array.isArray(d) ? d : []); }
      if (reviewsRes.ok) { const d = await reviewsRes.json(); setReviews(Array.isArray(d) ? d : []); }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setFetching(false);
    }
  }

  const handleSignOut = async () => {
    const token = localStorage.getItem('kaya_token');
    await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    localStorage.removeItem('kaya_token');
    router.push('/');
  };

  const nav = (
    <>
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></Link>
          <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
          <div className="nav-links"><Link href="/klara">KLARA</Link><Link href="/search">Visitors</Link><Link href="/hotels">Stays</Link><Link href="/muse">Where to go</Link><Link href="/contact">Contact us</Link></div>
          <div className="nav-spacer"></div>
          <div className="nav-right"><Link href="/business/dashboard">Switch to Business</Link></div>
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

  const statusColor = (status: string) => {
    if (status === 'CONFIRMED') return '#22c55e';
    if (status === 'PENDING') return '#e8a838';
    if (status === 'CANCELLED') return '#ef4444';
    return '#6b7280';
  };

  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('kaya_token');
    const selected = bookings.find((b: any) => b.id === reviewForm.listing);
    if (!selected) return;
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        booking_id: reviewForm.listing,
        listing_id: selected.listing_id,
        overall_rating: reviewForm.rating,
        text: reviewForm.text,
      }),
    });
    if (res.ok) {
      setReviewSubmitted(true);
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to submit review');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('kaya_token');
    const res = await fetch('/api/users/me/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileForm),
    });
    if (res.ok) {
      setName(profileForm.name);
      alert('Profile updated!');
    } else {
      alert('Failed to update profile');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      {nav}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 60px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '10px 20px', borderRadius: '999px', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
              background: activeTab === t.key ? '#1a120e' : 'rgba(255,251,246,.7)', color: activeTab === t.key ? '#fff8ef' : 'var(--muted)',
              transition: 'all .25s', boxShadow: activeTab === t.key ? '0 4px 12px rgba(26,18,14,.15)' : 'none',
            }}>{t.label}</button>
          ))}
          <button onClick={handleSignOut} style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Sign out</button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div style={{ ...glass, padding: '36px 32px', marginBottom: '24px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontFamily: 'var(--font-display), serif', fontWeight: 700 }}>Welcome back, {name}</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>{email}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Upcoming Trips', value: bookings.filter((b: any) => b.status === 'CONFIRMED').length, color: '#b87a55' },
                { label: 'Saved Listings', value: saved.length, color: '#8855b8' },
                { label: 'Reviews Written', value: reviews.length, color: '#55b884' },
                { label: 'Total Spent', value: `₾${bookings.reduce((s: number, b: any) => s + (b.total_price || 0), 0).toLocaleString()}`, color: '#b8558a' },
              ].map(s => (
                <div key={s.label} style={{ ...glass, padding: '24px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ ...glass, padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px' }}>Upcoming Bookings</h3>
              {bookings.filter((b: any) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bookings.filter((b: any) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').map((b: any) => (
                    <Link key={b.id} href={`/dashboard/bookings`} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', textDecoration: 'none', color: 'inherit', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,252,247,1)'; e.currentTarget.style.borderColor = 'rgba(26,18,14,.14)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,252,247,.9)'; e.currentTarget.style.borderColor = 'rgba(26,18,14,.06)'; }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `url(${b.listings?.images?.[0] || ''}) 50%/cover`, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ fontSize: '14px', display: 'block' }}>{b.listings?.title || 'Listing'}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{b.listings?.location || ''} · {b.check_in?.slice(0, 10)} → {b.check_out?.slice(0, 10)}</span>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', background: `${statusColor(b.status)}15`, color: statusColor(b.status), fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{b.status}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px', fontSize: '13px' }}>No upcoming bookings. <Link href="/search" style={{ color: 'var(--ink)', fontWeight: 700 }}>Start exploring</Link></p>
              )}
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div style={{ ...glass, padding: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 20px' }}>My Bookings</h2>
            {fetching ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px', fontSize: '13px' }}>Loading bookings…</p>
            ) : bookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {bookings.map((b: any) => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: `url(${b.listings?.images?.[0] || ''}) 50%/cover`, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '15px', display: 'block' }}>{b.listings?.title || 'Listing'}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>{b.listings?.location || ''}</span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{b.check_in?.slice(0, 10)} → {b.check_out?.slice(0, 10)} · {b.guest_count} guests</span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '16px' }}>₾{b.total_price}</div>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', background: `${statusColor(b.status)}15`, color: statusColor(b.status), fontSize: '11px', fontWeight: 700 }}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>No bookings yet</p>
            )}
            <Link href="/search" style={{ display: 'block', textAlign: 'center', marginTop: '20px', padding: '14px', borderRadius: '999px', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Book a stay</Link>
          </div>
        )}

        {activeTab === 'saved' && (
          <div style={{ ...glass, padding: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 20px' }}>Saved Listings</h2>
            {fetching ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>Loading saved listings…</p>
            ) : saved.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {saved.map((s: any) => {
                  const listing = s.listings || s;
                  return (
                    <Link key={s.id} href={`/listing/${listing.id}`} style={{ borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ width: '100%', height: '140px', background: `url(${listing.images?.[0] || ''}) 50%/cover` }} />
                      <div style={{ padding: '14px 16px' }}>
                        <strong style={{ fontSize: '14px', display: 'block' }}>{listing.title}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>{listing.location}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>₾{listing.price_per_night}<span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: '12px' }}> / night</span></span>
                          <span style={{ fontSize: '12px' }}>★ {listing.overall_rating || '—'}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px', fontSize: '13px' }}>No saved listings yet. <Link href="/search" style={{ color: 'var(--ink)', fontWeight: 700 }}>Browse listings</Link></p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ ...glass, padding: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px' }}>Your Reviews</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 24px' }}>Reviews you&apos;ve written</p>
            {fetching ? (
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>Loading reviews…</p>
            ) : reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {reviews.map((r: any) => (
                  <div key={r.id} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `url(${r.listings?.images?.[0] || ''}) 50%/cover` }} />
                      <div>
                        <strong style={{ fontSize: '13px' }}>{r.listings?.title || 'Listing'}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{'★'.repeat(r.overall_rating)}{'☆'.repeat(5 - r.overall_rating)} · {new Date(r.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, margin: 0, color: 'rgba(36,23,18,.7)' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>No reviews yet</p>
            )}
            <div style={{ borderTop: '1px solid rgba(26,18,14,.08)', paddingTop: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px' }}>Write a Review</h3>
              {reviewSubmitted ? (
                <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', color: '#287a43', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>Review submitted! It will appear after moderation.</div>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <select value={reviewForm.listing} onChange={e => setReviewForm(p => ({ ...p, listing: e.target.value }))} required style={{ padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }}>
                    <option value="">Select a completed booking</option>
                    {completedBookings.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.listings?.title || 'Listing'}</option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(36,23,18,.6)', marginRight: '8px' }}>Rating:</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: n }))} style={{
                        width: '36px', height: '36px', borderRadius: '8px', border: '0', cursor: 'pointer', fontSize: '18px',
                        background: n <= reviewForm.rating ? '#1a120e' : 'rgba(26,18,14,.08)', color: n <= reviewForm.rating ? '#fff8ef' : 'var(--muted)',
                        transition: 'all .15s',
                      }}>{'★'}</button>
                    ))}
                  </div>
                  <textarea value={reviewForm.text} onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))} required placeholder="Share your experience..." rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                  <button type="submit" style={{ padding: '14px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Submit Review</button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ ...glass, padding: '32px', maxWidth: '560px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 24px' }}>My Profile</h2>
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #b87a55, #8a5a3e)', display: 'grid', placeItems: 'center', fontSize: '24px', fontWeight: 800, color: '#fff8ef' }}>{(name || 'G')[0]}</div>
                <div><strong style={{ fontSize: '16px' }}>{name}</strong><p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>{email}</p></div>
              </div>
              {([
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Nationality', key: 'nationality', type: 'text' },
                { label: 'Preferred Language', key: 'language', type: 'select', options: ['English', 'Georgian', 'Russian'] },
              ] as const).map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={(profileForm as any)[f.key]} onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }}>
                      {(f as any).options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={(profileForm as any)[f.key]} onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                  )}
                </div>
              ))}
              <button type="submit" style={{ marginTop: '8px', padding: '14px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
            </form>
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
