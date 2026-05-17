'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAIL = 'ahsanstarn@gmail.com';

function getToken() {
  return localStorage.getItem('kaya_token');
}

export default function AdminPanel() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ listings: 0, bookings: 0, users: 0 });
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Add property form
  const [form, setForm] = useState({ title: '', description: '', category: 'hotels', price: '', location: '', contactPhone: '', contactEmail: '', image: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  // Live viewers
  const [liveViewers, setLiveViewers] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Selected property for detail modal
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // KLARA chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([
    { role: 'klara', content: 'Hello! I\'m KLARA, your AI property assistant. Ask me about any listing or get help managing your properties.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const sessionRes = await fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionData = await sessionRes.json();
      const s = sessionData.user ? { user: sessionData.user } : null;
      setSession(s);

      if (!s) {
        router.push('/login');
        return;
      }

      if (s.user?.email !== ADMIN_EMAIL) {
        alert('Access denied. Admin only.');
        router.push('/');
        return;
      }

      setIsAdmin(true);

      const fallbackListings = [
        { id: 1, title: 'Old Town Courtyard', location: 'Tbilisi, Old Town', category: 'guesthouses', price_per_night: 65, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=100&q=60'] },
        { id: 2, title: 'Panoramic Suite Vera', location: 'Tbilisi, Vera', category: 'hotels', price_per_night: 280, images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=100&q=60'] },
        { id: 3, title: 'Modern Seaside Flat', location: 'Batumi, Coastline', category: 'apartments', price_per_night: 95, images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=100&q=60'] },
        { id: 4, title: 'Kazbegi Mountain Lodge', location: 'Stepantsminda', category: 'cabins', price_per_night: 120, images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=100&q=60'] },
      ];

      // Fetch stats and listings from API
      const [listingsRes, statsRes] = await Promise.all([
        fetch('/api/listings').catch(() => null),
        fetch('/api/admin/stats').catch(() => null),
      ]);
      const listingsData = listingsRes?.ok ? await listingsRes.json() : null;
      const serverStats = statsRes?.ok ? await statsRes.json() : null;

      setStats({
        listings: serverStats?.listings ?? fallbackListings.length,
        bookings: serverStats?.bookings ?? 0,
        users: serverStats?.users ?? 1,
      });
      if (serverStats?.liveViewers !== undefined) setLiveViewers(serverStats.liveViewers);
      setProperties(listingsData?.listings?.length > 0 ? listingsData.listings : fallbackListings);
      setLoading(false);
    }
    init();
  }, [router]);

  // Poll live viewers every 10 seconds
  useEffect(() => {
    const fetchLive = async () => {
      const res = await fetch('/api/analytics/live-viewers').catch(() => null);
      if (res?.ok) {
        const data = await res.json();
        setLiveViewers(data.count ?? 0);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, []);

  // Poll stats every 30 seconds
  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/admin/stats').catch(() => null);
      if (res?.ok) {
        const data = await res.json();
        setStats(prev => ({
          ...prev,
          users: data.users ?? prev.users,
        }));
      }
    };
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Visitor tracking ping
  useEffect(() => {
    const getVisitorId = () => {
      let id = localStorage.getItem('kaya_visitor_id');
      if (!id) {
        id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('kaya_visitor_id', id);
      }
      return id;
    };
    const ping = () => {
      fetch('/api/analytics/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: getVisitorId(),
          page_path: window.location.pathname,
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real recent activity
  useEffect(() => {
    const fetchActivity = async () => {
      const token = getToken();
      const [bookingsRes, listingsRes] = await Promise.all([
        fetch('/api/bookings?limit=5', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).catch(() => null),
        fetch('/api/listings?limit=3').catch(() => null),
      ]);
      const recentBookings = bookingsRes?.ok ? await bookingsRes.json() : [];
      const recentListingsData = listingsRes?.ok ? await listingsRes.json() : null;
      const recentListings = recentListingsData?.listings || [];

      const activities: any[] = [];

      (recentBookings || []).forEach((b: any) => {
        const title = b.listings?.title || `Listing #${b.listing_id}`;
        activities.push({
          action: 'New booking',
          detail: `${title} — ${b.check_in || ''} to ${b.check_out || ''}`,
          time: timeAgo(b.created_at),
          icon: '📅',
        });
      });

      (recentListings || []).forEach((l: any) => {
        activities.push({
          action: 'Property added',
          detail: `${l.title} was created`,
          time: timeAgo(l.created_at),
          icon: '🏠',
        });
      });

      activities.sort((a, b) => {
        const aMin = parseTimeAgo(a.time);
        const bMin = parseTimeAgo(b.time);
        return aMin - bMin;
      });

      setRecentActivity(activities.slice(0, 8));
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    return `${hours} hr ago`;
  };

  const parseTimeAgo = (str: string) => {
    const match = str.match(/(\d+)\s*(min|hr)/);
    if (!match) return 0;
    const val = parseInt(match[1]);
    return match[2] === 'hr' ? val * 60 : val;
  };

  const handleLogout = async () => {
    const token = getToken();
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem('kaya_token');
    router.push('/login');
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess('');

    try {
      const token = getToken();
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          price_per_night: parseFloat(form.price),
          location: form.location,
          contact_phone: form.contactPhone,
          contact_email: form.contactEmail,
          images: form.image ? [form.image] : [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add property');
      }

      setFormSuccess('Property added successfully!');
      setForm({ title: '', description: '', category: 'hotels', price: '', location: '', contactPhone: '', contactEmail: '', image: '' });
      setStats(prev => ({ ...prev, listings: prev.listings + 1 }));
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Failed to add property');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleChatSend = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const msg = text.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);

    const lower = msg.toLowerCase();
    let reply = '';

    if (lower.includes('hello') || lower.includes('hi')) {
      reply = 'Hello! I\'m KLARA. I can help you manage properties, answer questions about listings, or assist with guest inquiries. What would you like to do?';
    } else if (lower.includes('property') || lower.includes('listing') || lower.includes('add')) {
      reply = 'To add a property, go to the "Add Property" tab. Fill in the title, description, category, price per night, location, and contact info. Make sure to add a high-quality image URL.';
    } else if (lower.includes('price') || lower.includes('gel') || lower.includes('cost')) {
      reply = `Current price ranges by category:\n• Hotels: 150-350 GEL/night\n• Apartments: 65-150 GEL/night\n• Guesthouses: 40-100 GEL/night\n• Cabins: 80-200 GEL/night\n• Resorts: 130-300 GEL/night\n• Villas: 180-400 GEL/night`;
    } else if (lower.includes('guest') || lower.includes('book')) {
      reply = 'Guest inquiries and bookings can be managed in the Bookings section. You can view pending requests, confirm reservations, and communicate with guests directly.';
    } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('email')) {
      reply = 'When adding a property, include the contact phone number and email. This information will be shared with guests when they make an inquiry.';
    } else if (lower.includes('image') || lower.includes('photo') || lower.includes('picture')) {
      reply = 'For property images, use high-quality URLs from Unsplash or your own hosting. The image will be displayed as the cover photo for the listing card.';
    } else {
      reply = 'I\'m KLARA, your Kaya.ge admin assistant. I can help with:\n• Adding & managing properties\n• Pricing recommendations\n• Guest inquiry handling\n• Contact info setup\n\nWhat would you like help with?';
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'klara', content: reply }]);
      setChatLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="site-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: 'var(--muted)', fontSize: '16px' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAdmin || !session) return null;

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'properties', label: 'Properties' },
    { key: 'add', label: 'Add Property' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'klara', label: 'KLARA AI' },
  ];

  return (
    <div className="site-shell">
      <div className="shell">
        {/* Inline Nav */}
        <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
          <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
            <Link href="/" className="nav-brand">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </Link>
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
            <div className="nav-links" style={{ gap: '6px' }}>
              {tabs.filter(t => t.key !== 'add').map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  background: activeTab === tab.key ? 'rgba(26,18,14,.9)' : 'none',
                  color: activeTab === tab.key ? '#fff8ef' : 'var(--muted)',
                  border: '0', padding: '6px 12px', borderRadius: '999px',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all .2s',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="nav-spacer"></div>
            <div className="nav-right">
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '12px', fontWeight: 600, opacity: 0.6 }}>
                Log out
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
          <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
          <Link href="/" onClick={() => setMobileNavOpen(false)}>Home</Link>
          <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
          <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
          <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact</Link>
        </div>

        {/* Header */}
        <section className="animate-section" style={{ marginTop: '100px' }}>
          <div style={{
            borderRadius: '28px', overflow: 'hidden',
            background: 'radial-gradient(120% 80% at 50% 100%, rgba(255,225,200,.55) 0, transparent 55%), linear-gradient(180deg, #6e4c3a, #b87a55 38%, #e9a677 60%, #f3c39b 78%, #f5d2b3)',
            boxShadow: 'var(--shadow)', padding: '48px 48px 40px', position: 'relative', isolation: 'isolate',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(40,22,15,.32), rgba(40,22,15,0) 26%, hsla(28,77%,83%,.55) 86%, hsla(28,77%,83%,.95))' }}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p style={{ margin: '0 0 8px', color: '#7a4530', letterSpacing: '.18em', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800 }}>Admin Dashboard</p>
              <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'rgba(255,250,243,.92)', margin: '0 0 8px', lineHeight: 1.05 }}>
                Welcome back
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,250,243,.8)', fontSize: '15px', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
                Signed in as <strong>{session.user?.email}</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '24px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 20px', borderRadius: '999px', border: '0',
              background: activeTab === tab.key ? '#1a120e' : 'rgba(255,251,246,.7)',
              color: activeTab === tab.key ? '#fff8ef' : 'var(--muted)',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              transition: 'all .25s',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(26,18,14,.15)' : 'none',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* === DASHBOARD TAB === */}
        {activeTab === 'dashboard' && (
          <>
            <section className="section animate-section">
              <div className="rg-3">
                {[
                  { label: 'Total Listings', value: stats.listings, color: '#b87a55' },
                  { label: 'Total Bookings', value: stats.bookings, color: '#8855b8' },
                  { label: 'Active Users', value: stats.users, color: '#55b884' },
                  { label: 'Live Viewers', value: liveViewers, color: '#b8558a', live: true },
                ].map((stat) => (
                  <div key={stat.label} style={{ borderRadius: '20px', padding: '28px', background: 'rgba(255,251,246,.8)', border: '1px solid rgba(26,18,14,.08)', boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden' }}>
                    {stat.live && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,.5)', animation: 'pulse-glow 1.5s infinite' }}></span>
                        LIVE
                      </div>
                    )}
                    <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '11px', fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase' }}>{stat.label}</p>
                    <p style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="section animate-section">
              <div style={{ borderRadius: '20px', padding: '32px', background: 'rgba(255,251,246,.8)', border: '1px solid rgba(26,18,14,.08)', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px' }}>KLARA AI Assistant</h3>
                <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 20px' }}>Need help managing properties? Ask KLARA.</p>
                <button onClick={() => setActiveTab('klara')} style={{
                  padding: '12px 24px', borderRadius: '999px', border: '0',
                  background: '#1a120e', color: '#fff8ef', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                }}>
                  Open KLARA
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="section animate-section">
              <div style={{ borderRadius: '20px', padding: '28px', background: 'rgba(255,251,246,.8)', border: '1px solid rgba(26,18,14,.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(recentActivity.length > 0 ? recentActivity : [
                    { action: 'No recent activity', detail: 'Waiting for data...', time: '', icon: '⏳' },
                  ]).map((activity, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,252,247,.7)', border: '1px solid rgba(26,18,14,.04)' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{activity.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ fontSize: '13px', display: 'block' }}>{activity.action}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{activity.detail}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', flexShrink: 0 }}>{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* === PROPERTIES TAB === */}
        {activeTab === 'properties' && (
          <section className="section animate-section">
            <div className="section-head">
              <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>All Properties</h2>
              <button onClick={() => setActiveTab('add')} className="pill-link" style={{ background: 'none', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                + Add Property
              </button>
            </div>
            <div style={{ borderRadius: '20px', padding: '24px', background: 'rgba(255,251,246,.8)', border: '1px solid rgba(26,18,14,.08)' }}>
              {properties.length > 0 ? (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {properties.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProperty(p)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', cursor: 'pointer', transition: 'all .2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,252,247,1)'; e.currentTarget.style.borderColor = 'rgba(26,18,14,.14)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,252,247,.9)'; e.currentTarget.style.borderColor = 'rgba(26,18,14,.06)'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `url(${p.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=100&q=60'}) 50%/cover`, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <strong style={{ fontSize: '15px', display: 'block' }}>{p.title}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.location || p.city} · {p.category} · {p.price_per_night} GEL</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <span style={{ padding: '8px 14px', borderRadius: '999px', border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)', fontSize: '11px', fontWeight: 700, color: 'inherit' }}>Details</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>No properties yet. Add your first one!</p>
              )}
            </div>
          </section>
        )}

        {/* === ADD PROPERTY TAB === */}
        {activeTab === 'add' && (
          <section className="section animate-section">
            <div style={{
              borderRadius: '24px', padding: '40px 36px',
              background: 'rgba(255,251,246,.84)',
              border: '1px solid hsla(0,0%,100%,.35)',
              backdropFilter: 'blur(24px) saturate(120%)',
              boxShadow: '0 40px 80px rgba(48,26,16,0.12)',
              maxWidth: '680px',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 28px' }}>Add New Property</h2>

              {formSuccess && (
                <div style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', color: '#287a43', fontSize: '13px', fontWeight: 600, marginBottom: '18px' }}>
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Title</label>
                    <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Cozy Tbilisi Apartment" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }}>
                      <option value="hotels">Hotel</option>
                      <option value="apartments">Apartment</option>
                      <option value="guesthouses">Guesthouse</option>
                      <option value="cabins">Cabin</option>
                      <option value="resorts">Resort</option>
                      <option value="villas">Villa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Description</label>
                  <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the property, amenities, nearby attractions..." rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body), system-ui, sans-serif' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Price per night (GEL)</label>
                    <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 120" min="1" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Location</label>
                    <input type="text" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Tbilisi, Georgia" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Contact Phone</label>
                    <input type="text" required value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} placeholder="e.g. +995 555 XX XX" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Contact Email</label>
                    <input type="email" required value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} placeholder="e.g. host@example.com" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Image URL</label>
                  <input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://images.unsplash.com/photo-..." style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' }} />
                </div>

                <button type="submit" disabled={formSubmitting} style={{
                  marginTop: '8px', padding: '16px 22px', border: '0', borderRadius: '999px',
                  background: formSubmitting ? 'rgba(26,18,14,.6)' : '#1a120e',
                  color: '#fff8ef', fontSize: '14px', fontWeight: 800,
                  cursor: formSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'transform .25s, box-shadow .25s',
                }}
                  onMouseEnter={(e) => { if (!formSubmitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -8px rgba(26,18,14,.4)'; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {formSubmitting ? 'Adding...' : 'Add Property'}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* === BOOKINGS TAB === */}
        {activeTab === 'bookings' && (
          <section className="section animate-section">
            <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '20px' }}>Bookings</h2>
            <div style={{ borderRadius: '20px', padding: '24px', background: 'rgba(255,251,246,.8)', border: '1px solid rgba(26,18,14,.08)' }}>
              {bookings.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {bookings.map((b: any) => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', fontSize: '13px' }}>
                      <span>Listing #{b.listing_id}</span>
                      <span style={{ color: 'var(--muted)' }}>{b.check_in} → {b.check_out}</span>
                      <span style={{ fontWeight: 700 }}>{b.total_amount} GEL</span>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', background: b.status === 'PENDING' ? 'rgba(236,198,166,.5)' : 'rgba(85,184,132,.2)', color: b.status === 'PENDING' ? '#7a4530' : '#287a43', fontSize: '11px', fontWeight: 700 }}>{b.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>No bookings yet.</p>
              )}
            </div>
          </section>
        )}

        {/* === KLARA AI TAB === */}
        {activeTab === 'klara' && (
          <section className="section animate-section">
            <div style={{
              borderRadius: '24px', overflow: 'hidden',
              background: 'rgba(255,251,246,.84)',
              border: '1px solid hsla(0,0%,100%,.35)',
              backdropFilter: 'blur(24px) saturate(120%)',
              boxShadow: '0 40px 80px rgba(48,26,16,0.12)',
              display: 'flex', flexDirection: 'column',
              minHeight: '500px', maxHeight: '600px',
            }}>
              {/* KLARA Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(26,18,14,.08)',
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(26,18,14,.03)',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #b87a55, #8a5a3e)',
                  display: 'grid', placeItems: 'center',
                  fontSize: '16px', fontWeight: 800, color: '#fff8ef',
                }}>
                  K
                </div>
                <div>
                  <strong style={{ fontSize: '15px' }}>KLARA</strong>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>AI Property Assistant · Online</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '14px 18px',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.role === 'user' ? '#1a120e' : 'rgba(236,198,166,.3)',
                      color: msg.role === 'user' ? '#fff8ef' : 'var(--ink)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '14px 18px', borderRadius: '18px 18px 18px 4px',
                      background: 'rgba(236,198,166,.3)', fontSize: '13px',
                    }}>
                      <span style={{ opacity: 0.5 }}>KLARA is thinking</span>
                      <span style={{ animation: 'pulse 1.5s infinite', marginLeft: '4px' }}>...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(26,18,14,.06)' }}>
                <form onSubmit={(e) => { e.preventDefault(); handleChatSend(chatInput); }} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask KLARA about properties..."
                    disabled={chatLoading}
                    style={{
                      flex: 1, padding: '14px 18px', borderRadius: '999px',
                      border: '1px solid rgba(36,23,18,.12)',
                      background: 'hsla(0,0%,100%,.84)',
                      fontSize: '13px', outline: 'none',
                    }}
                  />
                  <button type="submit" disabled={!chatInput.trim() || chatLoading} style={{
                    padding: '14px 20px', borderRadius: '999px', border: '0',
                    background: !chatInput.trim() || chatLoading ? 'rgba(26,18,14,.3)' : '#1a120e',
                    color: '#fff8ef', cursor: !chatInput.trim() || chatLoading ? 'not-allowed' : 'pointer',
                    transition: 'all .25s',
                  }}
                    onMouseEnter={(e) => { if (chatInput.trim() && !chatLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(26,18,14,.25)'; }}}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </form>
                <p style={{ fontSize: '11px', color: 'rgba(36,23,18,.4)', margin: '8px 0 0', textAlign: 'center' }}>
                  KLARA can make mistakes. Verify important information.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* === PROPERTY DETAIL MODAL === */}
        {selectedProperty && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(20,12,8,.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }} onClick={() => setSelectedProperty(null)}>
            <div style={{
              background: 'rgba(255,251,246,.96)',
              borderRadius: '28px',
              maxWidth: '640px', width: '100%',
              maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 60px 120px rgba(20,12,8,.4)',
              border: '1px solid hsla(0,0%,100%,.35)',
              padding: '40px 36px 32px',
              position: 'relative',
            }} onClick={(e) => e.stopPropagation()}>
              {/* Close */}
              <button onClick={() => setSelectedProperty(null)} style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '36px', height: '36px', borderRadius: '999px',
                border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,255,255,.8)',
                cursor: 'pointer', fontSize: '18px', display: 'grid', placeItems: 'center',
                color: 'var(--muted)',
              }}>✕</button>

              {/* Image */}
              <div style={{
                width: '100%', height: '220px', borderRadius: '18px',
                background: `url(${selectedProperty.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=70'}) 50%/cover`,
                marginBottom: '24px',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 4px' }}>{selectedProperty.title}</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>{selectedProperty.location || selectedProperty.city || 'Location not set'}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>{selectedProperty.price_per_night} GEL</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>per night</div>
                </div>
              </div>

              {/* Category badge */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(236,198,166,.3)', fontSize: '12px', fontWeight: 700, color: '#7a4530' }}>
                  {(selectedProperty.category || 'general').charAt(0).toUpperCase() + (selectedProperty.category || 'general').slice(1)}
                </span>
                {selectedProperty.is_published !== false && (
                  <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(34,197,94,.1)', fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>Published</span>
                )}
              </div>

              {/* Description */}
              {selectedProperty.description && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', margin: '0 0 8px' }}>Description</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>{selectedProperty.description}</p>
                </div>
              )}

              {/* Contact Info */}
              {(() => {
                let amenities: any[] = [];
                try { if (typeof selectedProperty.amenities === 'string') amenities = JSON.parse(selectedProperty.amenities); } catch {}
                const phone = amenities?.find((a: any) => a?.type === 'contact_phone')?.value || selectedProperty.contactPhone;
                const email = amenities?.find((a: any) => a?.type === 'contact_email')?.value || selectedProperty.contactEmail;
                return (phone || email) ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', margin: '0 0 8px' }}>Contact</h4>
                    {phone && <p style={{ fontSize: '13px', margin: '0 0 4px', color: 'var(--ink)' }}>📞 {phone}</p>}
                    {email && <p style={{ fontSize: '13px', margin: 0, color: 'var(--ink)' }}>✉ {email}</p>}
                  </div>
                ) : null;
              })()}

              {/* ID & Created */}
              <div style={{ padding: '16px 0 0', borderTop: '1px solid rgba(26,18,14,.06)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)' }}>
                <span>ID: {selectedProperty.id}</span>
                {selectedProperty.created_at && <span>Added {new Date(selectedProperty.created_at).toLocaleDateString()}</span>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Link href={`/listing/${selectedProperty.id}`} style={{
                  flex: 1, textAlign: 'center', padding: '12px', borderRadius: '999px',
                  background: '#1a120e', color: '#fff8ef', fontSize: '13px', fontWeight: 700,
                  textDecoration: 'none',
                }}>View on site</Link>
                <button onClick={() => setSelectedProperty(null)} style={{
                  flex: 1, padding: '12px', borderRadius: '999px',
                  border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: 'var(--ink)',
                }}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
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
      </div>
    </div>
  );
}
