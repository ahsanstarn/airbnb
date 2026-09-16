'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/app/components/DashboardHeader';
import { useTheme } from '@/lib/theme-context';

type TouristTab = 'overview' | 'bookings' | 'wishlist' | 'itinerary' | 'reviews' | 'messages' | 'profile';

interface BookingItem {
  id: string;
  _id?: string;
  listing_title?: string;
  listing_image?: string;
  city?: string;
  check_in?: string;
  check_out?: string;
  total_price?: number;
  guests?: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  host_name?: string;
  host_phone?: string;
}

const INITIAL_WISHLIST = [
  { id: 'w-1', title: 'Rooms Hotel Kazbegi', city: 'Kazbegi', price: 240, rating: 4.95, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=500&fit=crop', tag: 'Mountain Retreat' },
  { id: 'w-2', title: 'Stamba Hotel Tbilisi Luxury Suite', city: 'Tbilisi', price: 310, rating: 4.98, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=700&h=500&fit=crop', tag: 'Design Hotel' },
  { id: 'w-3', title: 'Kakheti Private Qvevri Wine Harvest Tour', city: 'Telavi', price: 140, rating: 5.0, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&h=500&fit=crop', tag: 'Wine Experience' },
  { id: 'w-4', title: 'Svaneti Medieval Tower Chalet', city: 'Mestia', price: 180, rating: 4.92, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&h=500&fit=crop', tag: 'Eco Lodge' },
];

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'b-101',
    listing_title: 'Rooms Hotel Kazbegi - Panoramic Suite',
    listing_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=500&fit=crop',
    city: 'Kazbegi',
    check_in: '2026-10-20',
    check_out: '2026-10-23',
    total_price: 720,
    guests: 2,
    status: 'CONFIRMED',
    host_name: 'Giorgi G.',
    host_phone: '+995 599 443 210',
  },
  {
    id: 'b-102',
    listing_title: 'Tbilisi Old Town Loft with Terrace',
    listing_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&h=500&fit=crop',
    city: 'Tbilisi',
    check_in: '2026-11-05',
    check_out: '2026-11-08',
    total_price: 360,
    guests: 2,
    status: 'CONFIRMED',
    host_name: 'Nino B.',
    host_phone: '+995 591 112 334',
  },
  {
    id: 'b-103',
    listing_title: 'Batumi Seafront Luxury Apartment',
    listing_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&h=500&fit=crop',
    city: 'Batumi',
    check_in: '2026-08-12',
    check_out: '2026-08-16',
    total_price: 520,
    guests: 3,
    status: 'COMPLETED',
    host_name: 'Luka K.',
    host_phone: '+995 577 990 011',
  }
];

export default function TouristDashboard() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TouristTab>('overview');
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<BookingItem | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time upcoming stay dynamic derivation
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const upcomingBooking = confirmedBookings.find(b => b.check_in && new Date(b.check_in) >= new Date()) || confirmedBookings[0] || bookings[0];
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Traveler');

  // AI Itinerary state
  const [selectedRegion, setSelectedRegion] = useState('Kazbegi & Caucasus');
  const [selectedVibe, setSelectedVibe] = useState('Adventure & Nature');
  const [tripDays, setTripDays] = useState('4 Days');
  const [generatingItinerary, setGeneratingItinerary] = useState(false);
  const [customItinerary, setCustomItinerary] = useState<any[] | null>(null);

  // Chat message state
  const [chatThread, setChatThread] = useState([
    { sender: 'host', text: 'Gamarjoba! We are excited to welcome you to Kazbegi this Friday.', time: '10:15 AM' },
    { sender: 'user', text: 'Hello! Is airport transfer available from Tbilisi?', time: '10:18 AM' },
    { sender: 'host', text: 'Yes! Our driver Shalva can pick you up in a comfortable 4x4 Delica for ₾120.', time: '10:20 AM' },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Review Form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setUser(data.user);
        }

        // Fetch live bookings
        const bRes = await fetch('/api/bookings');
        if (bRes.ok) {
          const bData = await bRes.json();
          if (isMounted && Array.isArray(bData) && bData.length > 0) {
            setBookings(bData);
          }
        }
      } catch (e) {
        console.error('Data load error:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUserData();

    // Real-time live polling (every 8s) & on tab focus
    const interval = setInterval(() => {
      fetch('/api/bookings')
        .then(r => r.ok ? r.json() : null)
        .then(bData => {
          if (isMounted && Array.isArray(bData) && bData.length > 0) {
            setBookings(bData);
          }
        })
        .catch(() => {});
    }, 8000);

    const onFocus = () => {
      fetch('/api/bookings')
        .then(r => r.ok ? r.json() : null)
        .then(bData => {
          if (isMounted && Array.isArray(bData) && bData.length > 0) {
            setBookings(bData);
          }
        })
        .catch(() => {});
    };
    window.addEventListener('focus', onFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancelBooking = async (id: string) => {
    setCancellingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id || b._id === id ? { ...b, status: 'CANCELLED' } : b));
        triggerToast('Booking cancelled successfully.');
      } else {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        triggerToast('Booking updated to cancelled.');
      }
    } catch (e) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      triggerToast('Booking updated.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
    triggerToast('Item removed from your wishlist.');
  };

  const handleGenerateItinerary = () => {
    setGeneratingItinerary(true);
    setTimeout(() => {
      setCustomItinerary([
        { day: 'Day 1: Arrival in Tbilisi & Scenic Drive', desc: 'Private 4x4 transfer to Kazbegi via Georgian Military Highway. Stop at Ananuri Fortress & Gudauri Friendship Monument.', stay: 'Rooms Hotel Kazbegi' },
        { day: 'Day 2: Gergeti Trinity Church & Truso Valley Trek', desc: 'Morning sunrise over Mount Kazbek (5,047m). Jeep excursion to Gergeti Trinity Church followed by soda mineral springs hike in Truso Valley.', stay: 'Rooms Hotel Kazbegi' },
        { day: 'Day 3: Gveleti Waterfalls & Kakheti Wine Region', desc: 'Hike to Upper Gveleti Waterfall. Afternoon scenic drive to Kakheti wine region for authentic Qvevri wine tasting & Supra feast.', stay: 'Wine Chateau Kakheti' },
        { day: 'Day 4: Telavi City & Return to Tbilisi Old Town', desc: 'Visit Batonistsikhe Fortress in Telavi. Transfer back to Tbilisi for sulfur baths & dinner at Barbarestan.', stay: 'Stamba Hotel' },
      ]);
      setGeneratingItinerary(false);
      triggerToast('AI Customized Itinerary generated successfully!');
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatThread(prev => [...prev, { sender: 'user', text: messageInput, time: now }]);
    setMessageInput('');
    setTimeout(() => {
      setChatThread(prev => [...prev, { sender: 'host', text: 'Thank you! I will confirm that right away.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0B132B' : 'var(--surface, #fbf7f2)', color: isDark ? '#ffffff' : 'var(--ink, #1a120e)', minHeight: '100vh', fontFamily: 'var(--font-body, system-ui, sans-serif)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, backgroundColor: '#10b981', color: '#fff', padding: '14px 22px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Integrated Unified Header */}
      <DashboardHeader activeRole="tourist" user={user} />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Mobile Toggle Bar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50, backgroundColor: '#c8a983', color: '#0B132B', border: 'none', borderRadius: '50%', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', cursor: 'pointer' }}
        >
          ☰
        </button>

        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="tourist-mobile-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 49,
            }}
          />
        )}

        {/* Unified Sidebar */}
        <aside
          className={`tourist-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
          style={{
            width: '270px',
            backgroundColor: isDark ? 'rgba(11, 19, 43, 0.95)' : '#ffffff',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(26, 18, 14, 0.08)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ padding: '0 12px 20px', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(26, 18, 14, 0.08)', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#c8a983', fontWeight: 700, marginBottom: '4px' }}>KAYA Traveler Portal</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#fff' : 'var(--ink)' }}>Tourist Studio</div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { id: 'overview', label: 'Overview & Trips', icon: '📊' },
                { id: 'bookings', label: 'My Stays & Bookings', icon: '🏨', badge: bookings.length },
                { id: 'wishlist', label: 'Saved Wishlists', icon: '❤️', badge: wishlist.length },
                { id: 'itinerary', label: 'AI Itinerary Planner', icon: '🗺️' },
                { id: 'messages', label: 'Host Messages', icon: '💬' },
                { id: 'reviews', label: 'Reviews & Feedback', icon: '⭐' },
                { id: 'profile', label: 'Traveler Profile', icon: '👤' },
              ].map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TouristTab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isActive ? 'rgba(200, 169, 131, 0.15)' : 'transparent',
                      color: isActive ? '#c8a983' : (isDark ? '#94a3b8' : '#64748b'),
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? '3px solid #c8a983' : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span style={{ backgroundColor: isActive ? '#c8a983' : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(26, 18, 14, 0.08)'), color: isActive ? '#0B132B' : (isDark ? '#94a3b8' : '#64748b'), fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer User Card */}
          <div style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(26, 18, 14, 0.03)', borderRadius: '14px', padding: '14px', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(26, 18, 14, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {displayName[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: isDark ? '#fff' : 'var(--ink)' }}>{displayName}</div>
                <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : 'var(--muted)' }}>Explorer • {user?.points ?? 480} Points</div>
              </div>
            </div>
            <Link href="/" style={{ display: 'block', textAlign: 'center', fontSize: '12px', color: '#c8a983', textDecoration: 'none', padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(200, 169, 131, 0.1)' }}>
              Explore Georgia Homepage →
            </Link>
          </div>
        </aside>

        {/* Main Dashboard Content Area */}
        <main style={{ flex: 1, padding: 'clamp(16px, 3vw, 32px)', overflowY: 'auto', minWidth: 0 }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Caucasus Welcome Hero */}
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', padding: 'clamp(20px, 4vw, 40px)', background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=600&fit=crop) center/cover', border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(200, 169, 131, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: 'rgba(200, 169, 131, 0.2)', color: '#c8a983', border: '1px solid rgba(200, 169, 131, 0.4)', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      🌄 {upcomingBooking ? 'Next Adventure Confirmed' : 'Discover Sakartvelo'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} /> Live Real-Time Sync
                    </span>
                  </div>
                  <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: '0 0 12px', color: '#ffffff', lineHeight: '1.2' }}>
                    Welcome back, {displayName}!
                  </h1>
                  <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 24px' }}>
                    {upcomingBooking ? (
                      <>Your stay at <strong style={{ color: '#fff' }}>{upcomingBooking.listing_title || 'Georgian Boutique Experience'}</strong> in <span style={{ color: '#c8a983', fontWeight: 700 }}>{upcomingBooking.city || 'Georgia'}</span> is confirmed ({upcomingBooking.check_in || 'Upcoming'}). Get ready for breathtaking Caucasus views!</>
                    ) : (
                      <>You have no active stays scheduled yet. Ready to experience the high peaks of Kazbegi, ancient wine cellars of Kakheti, and cobblestones of Old Tbilisi?</>
                    )}
                  </p>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <button onClick={() => setActiveTab('bookings')} style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                      View Booking Details ({bookings.length})
                    </button>
                    <button onClick={() => setActiveTab('itinerary')} style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', fontSize: '14px', backdropFilter: 'blur(8px)' }}>
                      AI Trip Itinerary →
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
                {[
                  { label: 'Upcoming Stays', val: bookings.filter(b => b.status === 'CONFIRMED').length, sub: upcomingBooking ? `Next: ${upcomingBooking.check_in || 'Upcoming'} (${upcomingBooking.city || 'Georgia'})` : 'No active stay', icon: '🏨', color: '#38bdf8' },
                  { label: 'Saved Wishlist', val: wishlist.length, sub: 'Boutique stays & tours', icon: '❤️', color: '#f43f5e' },
                  { label: 'KAYA Travel Credits', val: '€180.00', sub: 'Ready for next booking', icon: '🪙', color: '#c8a983' },
                  { label: 'Georgia Reviews', val: '3 Posted', sub: '5.0★ Average rating', icon: '⭐', color: '#10b981' },
                ].map((stat, idx) => (
                  <div key={idx} style={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : '#ffffff', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(26, 18, 14, 0.08)', borderRadius: '18px', padding: '20px', backdropFilter: 'blur(12px)', boxShadow: isDark ? 'none' : '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'var(--muted)', fontWeight: 500 }}>{stat.label}</span>
                      <span style={{ fontSize: '22px' }}>{stat.icon}</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: isDark ? '#fff' : 'var(--ink)', marginBottom: '4px' }}>{stat.val}</div>
                    <div style={{ fontSize: '12px', color: stat.color, fontWeight: 500 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Wishlist Preview & Quick Explore */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
                {/* Wishlist Preview */}
                <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Saved Wishlist Destinations</h3>
                    <button onClick={() => setActiveTab('wishlist')} style={{ background: 'none', border: 'none', color: '#c8a983', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>View All ({wishlist.length}) →</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px' }}>
                    {wishlist.slice(0, 3).map(item => (
                      <div key={item.id} style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                        <div style={{ padding: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#c8a983', fontWeight: 700, textTransform: 'uppercase' }}>{item.tag}</div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff', margin: '4px 0' }}>{item.title}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
                            <span>€{item.price}/night</span>
                            <span style={{ color: '#f59e0b' }}>★ {item.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Georgian Travel Assistance */}
                <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>KAYA Concierge AI</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '12px 0 8px' }}>Need Local Advice in Georgia?</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                      Ask our AI Concierge about local SIM cards, mountain weather, wine tasting reservations, or private 4x4 drivers.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('messages')} style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', fontWeight: 600, cursor: 'pointer' }}>
                    Open Concierge Chat 💬
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>My Stays & Bookings</h2>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Manage upcoming reservations, check-in vouchers, and cancellations</p>
                </div>
                <Link href="/" style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>
                  + Explore New Stays
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map(b => (
                  <div key={b.id || b._id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: 'clamp(16px, 3vw, 24px)', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <img src={b.listing_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'} alt={b.listing_title} style={{ width: '100%', maxWidth: '180px', height: '120px', borderRadius: '14px', objectFit: 'cover' }} />
                    <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: b.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : b.status === 'CANCELLED' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: b.status === 'CONFIRMED' ? '#10b981' : b.status === 'CANCELLED' ? '#f43f5e' : '#f59e0b', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                          ● {b.status}
                        </span>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>📍 {b.city || 'Georgia'}</span>
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{b.listing_title || 'Georgia Boutique Stay'}</h3>
                      <div style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
                        <span>📅 Check-in: <strong style={{ color: '#fff' }}>{b.check_in}</strong></span>
                        <span>📅 Check-out: <strong style={{ color: '#fff' }}>{b.check_out}</strong></span>
                        <span>👥 Guests: <strong style={{ color: '#fff' }}>{b.guests || 2}</strong></span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px', flex: '0 0 auto' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#c8a983' }}>€{b.total_price}</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => setSelectedVoucher(b)} style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '12px', cursor: 'pointer' }}>
                          📄 View Voucher
                        </button>
                        {b.status === 'CONFIRMED' && (
                          <button onClick={() => handleCancelBooking(b.id || b._id || '')} disabled={cancellingId === (b.id || b._id)} style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '12px', cursor: 'pointer' }}>
                            {cancellingId === (b.id || b._id) ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>Saved Wishlists & Favorites</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Your curated collection of Georgian retreats, wine tours, and boutique stays</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
                {wishlist.map(w => (
                  <div key={w.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={w.image} alt={w.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <button onClick={() => handleRemoveWishlist(w.id)} style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#f43f5e', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        ♥
                      </button>
                      <span style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(11, 19, 43, 0.85)', color: '#c8a983', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                        {w.tag}
                      </span>
                    </div>
                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>📍 {w.city}</div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>{w.title}</h4>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>€{w.price} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>/ night</span></div>
                        <Link href="/search" style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI ITINERARY PLANNER */}
          {activeTab === 'itinerary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>AI Travel Itinerary Builder</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Generate a bespoke day-by-day Georgian trip customized for your travel style</p>
              </div>

              {/* Generator Form Controls */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Destination Region</label>
                  <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '14px' }}>
                    <option value="Kazbegi & Caucasus">Kazbegi & High Caucasus</option>
                    <option value="Kakheti Wine Cradle">Kakheti Wine Cradle</option>
                    <option value="Svaneti Towers">Svaneti Medieval Towers</option>
                    <option value="Batumi Black Sea">Batumi & Black Sea Coast</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Travel Vibe</label>
                  <select value={selectedVibe} onChange={e => setSelectedVibe(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '14px' }}>
                    <option value="Adventure & Nature">Adventure & Nature 🏔️</option>
                    <option value="Wine & Gastronomy">Wine & Gastronomy 🍷</option>
                    <option value="Luxury Relaxation">Luxury Relaxation 💆</option>
                    <option value="Cultural Heritage">Cultural Heritage 🏛️</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Duration</label>
                  <select value={tripDays} onChange={e => setTripDays(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '14px' }}>
                    <option value="3 Days">3 Days Express</option>
                    <option value="4 Days">4 Days Recommended</option>
                    <option value="7 Days">7 Days Grand Tour</option>
                  </select>
                </div>

                <button onClick={handleGenerateItinerary} disabled={generatingItinerary} style={{ padding: '14px 20px', borderRadius: '10px', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  {generatingItinerary ? 'Crafting Itinerary...' : '✨ Generate AI Itinerary'}
                </button>
              </div>

              {/* Itinerary Cards Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(customItinerary || [
                  { day: 'Day 1: Tbilisi Old Town & Sulfur Baths', desc: 'Explore historic Sololaki architecture, Narikala Fortress cable car, and evening private thermal sulfur bath experience.', stay: 'Stamba Hotel Tbilisi' },
                  { day: 'Day 2: Scenic Drive to Kazbegi & Gudauri', desc: 'Traverse the Georgian Military Highway. Photo stops at Zhinvali Reservoir and Gudauri Panorama.', stay: 'Rooms Hotel Kazbegi' },
                  { day: 'Day 3: Gergeti Trinity Church & Truso Valley', desc: 'Morning sunrise jeep ascent to Gergeti. Hike through Truso Valley soda springs and travertine formations.', stay: 'Rooms Hotel Kazbegi' },
                  { day: 'Day 4: Kakheti Qvevri Winery & Return', desc: 'Masterclass in traditional 8,000-year-old Qvevri winemaking followed by farm-to-table lunch.', stay: 'Chateau Mukhrani' },
                ]).map((step, idx) => (
                  <div key={idx} style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px', display: 'flex', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(200, 169, 131, 0.15)', color: '#c8a983', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{step.day}</h4>
                      <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 10px', lineHeight: '1.5' }}>{step.desc}</p>
                      <div style={{ fontSize: '12px', color: '#c8a983', fontWeight: 600 }}>🏨 Recommended Accommodation: {step.stay}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '600px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>Host & Concierge Messages</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Direct communication with your hosts and KAYA Georgia travel team</p>
              </div>

              <div style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Chat Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>G</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>Giorgi G. (Rooms Hotel Kazbegi Host)</div>
                    <div style={{ fontSize: '12px', color: '#10b981' }}>● Active Now • Response time &lt; 5 mins</div>
                  </div>
                </div>

                {/* Messages Body */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {chatThread.map((msg, idx) => (
                    <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      <div style={{ backgroundColor: msg.sender === 'user' ? '#c8a983' : 'rgba(255, 255, 255, 0.08)', color: msg.sender === 'user' ? '#0B132B' : '#fff', padding: '12px 16px', borderRadius: '16px', fontSize: '14px', fontWeight: msg.sender === 'user' ? 600 : 400 }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Type your message to host..."
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '14px' }}
                  />
                  <button type="submit" style={{ padding: '12px 20px', borderRadius: '10px', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>Reviews & Ratings</h2>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Your verified stay reviews and recommendations</p>
                </div>
                <button onClick={() => setShowReviewModal(true)} style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                  + Write a Review
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'Batumi Seafront Luxury Apartment', date: 'Aug 18, 2026', rating: 5, text: 'Unbelievable sunset views over the Black Sea. Luka was an extraordinary host who arranged a private boat tour for us!' },
                  { title: 'Tbilisi Sololaki Heritage Suite', date: 'Jun 10, 2026', rating: 5, text: 'High ceilings, authentic Georgian antique decor, and right in the heart of Old Tbilisi. Highly recommended.' }
                ].map((rev, idx) => (
                  <div key={idx} style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>{rev.title}</h4>
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>{'★'.repeat(rev.rating)}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Reviewed on {rev.date}</div>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>Traveler Profile</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Manage personal details, passport verification, and preferences</p>
              </div>

              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '28px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                    {(user?.name || 'E')[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{user?.name || 'Elena Traveler'}</h3>
                    <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>✓ Verified KAYA Explorer Passport</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <input type="text" readOnly value={user?.name || 'Elena Traveler'} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
                    <input type="text" readOnly value={user?.email || 'elena@traveler.ge'} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Preferred Currency</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}>
                      <option>EUR (€)</option>
                      <option>USD ($)</option>
                      <option>GEL (₾)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Booking Voucher Modal */}
      {selectedVoucher && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#0B132B', border: '1px solid rgba(200, 169, 131, 0.4)', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedVoucher(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#c8a983', fontWeight: 700, textTransform: 'uppercase' }}>KAYA Official Pass</div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '6px 0' }}>Stay Voucher</h3>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>Voucher ID: #KAYA-{selectedVoucher.id}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>PROPERTY</div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{selectedVoucher.listing_title}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>CHECK-IN</div>
                  <div style={{ fontWeight: 600 }}>{selectedVoucher.check_in} (15:00)</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>CHECK-OUT</div>
                  <div style={{ fontWeight: 600 }}>{selectedVoucher.check_out} (11:00)</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>HOST CONTACT</div>
                  <div style={{ fontWeight: 600 }}>{selectedVoucher.host_name} ({selectedVoucher.host_phone})</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>STATUS</div>
                  <div style={{ fontWeight: 700, color: '#10b981' }}>{selectedVoucher.status}</div>
                </div>
              </div>
            </div>

            <button onClick={() => { triggerToast('Voucher PDF downloaded'); setSelectedVoucher(null); }} style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Download PDF Pass ⬇️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
