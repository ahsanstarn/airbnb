'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/app/components/DashboardHeader';
import { SEED_LISTINGS } from '@/lib/seed-data';
import {
  LinksTabView,
  CampaignsTabView,
  PerformanceTabView,
  PayoutsTabView,
  ReferralsTabView,
  AssetsTabView,
  AudienceTabView,
  ReportsTabView,
  RewardsTabView,
  StaysTabView,
  HelpTabView,
} from './components/TabViews';
import { useTheme } from '@/lib/theme-context';

type DashboardTab = 
  | 'dashboard' 
  | 'links' 
  | 'campaigns' 
  | 'performance' 
  | 'payouts' 
  | 'referrals' 
  | 'assets' 
  | 'audience' 
  | 'reports' 
  | 'rewards' 
  | 'stays' 
  | 'help';

function KayaDashboardInner() {
  const router = useRouter();
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as DashboardTab) || 'dashboard';

  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>(SEED_LISTINGS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [liveToast, setLiveToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Affiliate dynamic state
  const [affiliateStats, setAffiliateStats] = useState<any>({
    totalEarnings: 0,
    totalClicks: 0,
    conversions: 0,
    conversionRate: 0,
    customLinks: [],
  });

  // Chart state
  const [chartMetric, setChartMetric] = useState<'earnings' | 'clicks' | 'conversions'>('earnings');
  const [chartRange, setChartRange] = useState('Last 21 days');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(5); // Default to Oct 16

  // New Link Modal state
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkDestination, setNewLinkDestination] = useState('Kazbegi');
  const [newLinkSlug, setNewLinkSlug] = useState('');
  const [creatingLink, setCreatingLink] = useState(false);

  // Customize Referral Link Modal
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customSlugInput, setCustomSlugInput] = useState('');

  // Payout Modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('100.00');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Profile picture modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        // 1. Fetch user profile first (auth gate)
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user);
            if (data.user?.affiliateCode) {
              setCustomSlugInput(data.user.affiliateCode);
            }
          }
        }

        // 2. Fetch all remaining data in parallel
        const [affRes, bookingsRes, listingsRes] = await Promise.all([
          fetch('/api/affiliates'),
          fetch('/api/bookings'),
          fetch('/api/listings'),
        ]);

        if (affRes.ok && isMounted) {
          const affData = await affRes.json();
          setAffiliateStats((prev: any) => ({
            ...prev,
            ...affData,
            totalEarnings: affData.totalEarnings ?? 0,
            totalClicks: affData.totalClicks ?? 0,
            conversions: affData.totalRegistered ?? affData.conversions ?? 0,
            conversionRate: affData.conversionRate ?? 0,
            customLinks: affData.customLinks || [],
          }));
        }

        if (bookingsRes.ok && isMounted) {
          const bookingsData = await bookingsRes.json();
          if (Array.isArray(bookingsData)) {
            setBookings(bookingsData);
          }
        }

        if (listingsRes.ok && isMounted) {
          const listingsData = await listingsRes.json();
          if (listingsData.listings && listingsData.listings.length > 0) {
            setAllListings(listingsData.listings);
          }
        }

        // 5. Load favorites
        try {
          const storedFavs = JSON.parse(localStorage.getItem('kaya_favorites') || '[]');
          setFavorites(storedFavs);
        } catch {}
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  // Real-time polling: refresh data every 30s + on window focus
  useEffect(() => {
    if (!user) return;

    async function refreshData() {
      try {
        const [affRes, bookingsRes] = await Promise.all([
          fetch('/api/affiliates'),
          fetch('/api/bookings'),
        ]);
        if (affRes.ok) {
          const affData = await affRes.json();
          setAffiliateStats((prev: any) => ({
            ...prev,
            ...affData,
            totalEarnings: affData.totalEarnings || prev.totalEarnings,
            totalClicks: affData.totalClicks || prev.totalClicks,
            conversions: affData.totalRegistered || prev.conversions,
            conversionRate: affData.conversionRate || prev.conversionRate,
            customLinks: affData.customLinks || prev.customLinks,
          }));
        }
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          if (Array.isArray(bookingsData)) {
            setBookings(bookingsData);
          }
        }
      } catch {}
    }

    const pollInterval = setInterval(refreshData, 8000);
    const handleFocus = () => refreshData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refreshData();
    });

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // Real-time simulated activity ticker across Georgia
  useEffect(() => {
    const liveEvents = [
      'Traveler from Berlin booked Kazbegi Mountain Chalet (€320)',
      'New click recorded on "Batumi Black Sea Suites" from London',
      'Affiliate commission cleared: €44.80 for Svaneti expedition',
      'Traveler from Tbilisi reserved Kakheti Vineyard stay',
      'Real-time traffic surge: +14 clicks from Instagram Stories',
      'A traveler from Warsaw checked into Gergeti Alpine Lodge'
    ];
    let idx = 0;
    const timer = setInterval(() => {
      setLiveToast({ message: liveEvents[idx % liveEvents.length], visible: true });
      setAffiliateStats((prev: any) => ({
        ...prev,
        totalClicks: (prev.totalClicks || 0) + 1,
      }));
      idx++;
      setTimeout(() => {
        setLiveToast(t => ({ ...t, visible: false }));
      }, 4200);
    }, 14000);
    return () => clearInterval(timer);
  }, []);

  const simulateTestClick = (linkId?: string) => {
    setAffiliateStats((prev: any) => ({
      ...prev,
      totalClicks: (prev.totalClicks || 0) + 1,
    }));
    setLiveToast({ message: 'Live Test Click logged! Real-time click counter incremented.', visible: true });
    setTimeout(() => {
      setLiveToast(t => ({ ...t, visible: false }));
    }, 3500);
  };

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

  const referralUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kaya.ge';
    const slug = user?.affiliateCode || customSlugInput || (user?.email ? user.email.split('@')[0] : 'kaya');
    return `${origin}/?ref=${slug}`;
  }, [user, customSlugInput]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2200);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Discover Georgia with KAYA',
          text: 'Explore breathtaking mountains, vineyards, and stays in Georgia!',
          url: referralUrl,
        });
      } catch {}
    } else {
      copyToClipboard(referralUrl);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingLink(true);
    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLinkTitle || `${newLinkDestination} Promotion`,
          destination: newLinkDestination,
          customSlug: newLinkSlug,
          targetUrl: newLinkDestination.toLowerCase(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAffiliateStats((prev: any) => ({
          ...prev,
          customLinks: [data.link, ...(prev.customLinks || [])],
        }));
        setShowNewLinkModal(false);
        setNewLinkTitle('');
        setNewLinkSlug('');
        alert('Affiliate link created and saved to MongoDB!');
      }
    } catch (err) {
      console.error('Error creating link:', err);
    } finally {
      setCreatingLink(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PUT' });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      }
    } catch {
      alert('Error cancelling booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportReport = (format: string = 'PDF') => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value\n" +
      `Total Earnings,€${affiliateStats.totalEarnings}\n` +
      `Total Clicks,${affiliateStats.totalClicks}\n` +
      `Conversions,${affiliateStats.conversions}\n` +
      `Conversion Rate,${affiliateStats.conversionRate}%\n` +
      `Pending Payout,€${affiliateStats.pendingPayout}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kaya_affiliate_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLiveToast({ visible: true, message: `Report exported as ${format} successfully!` });
    setTimeout(() => setLiveToast({ visible: false, message: '' }), 3000);
  };

  // Chart dataset for 21 days
  const chartPoints = [
    { day: 'Oct 1', earnings: 140, clicks: 520, conversions: 14 },
    { day: 'Oct 4', earnings: 175, clicks: 680, conversions: 19 },
    { day: 'Oct 7', earnings: 160, clicks: 610, conversions: 18 },
    { day: 'Oct 10', earnings: 220, clicks: 890, conversions: 26 },
    { day: 'Oct 13', earnings: 210, clicks: 840, conversions: 24 },
    { day: 'Oct 16', earnings: 320.50, clicks: 1240, conversions: 38 },
    { day: 'Oct 19', earnings: 265, clicks: 1050, conversions: 31 },
    { day: 'Oct 21', earnings: 295, clicks: 1180, conversions: 35 },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0B132B',
        color: '#ffffff',
        gap: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#d9653b',
            borderRightColor: 'rgba(217, 101, 59, 0.4)',
            animation: 'kaya-spin 1s cubic-bezier(0.68, -0.15, 0.27, 1.15) infinite',
          }} />
          <div style={{
            position: 'absolute', inset: '8px', borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#3B82F6',
            borderLeftColor: 'rgba(59, 130, 246, 0.3)',
            animation: 'kaya-spin-reverse 1.4s cubic-bezier(0.68, -0.15, 0.27, 1.15) infinite',
          }} />
          <div style={{
            position: 'absolute', inset: '18px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #d9653b, #3B82F6)',
            animation: 'kaya-pulse 1.5s ease-in-out infinite',
          }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 6px' }}>
            Opening your Command Center
          </p>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#d9653b',
                animation: `kaya-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes kaya-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes kaya-spin-reverse { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
          @keyframes kaya-pulse { 0%, 100% { transform: scale(0.85); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } }
          @keyframes kaya-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-8px); opacity: 1; } }
        `}</style>
      </div>
    );
  }

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Partner');

  return (
    <div style={{ backgroundColor: isDark ? '#0B132B' : 'var(--surface, #fbf7f2)', color: isDark ? '#F8FAFC' : 'var(--ink, #1a120e)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <DashboardHeader activeRole="affiliate" user={user} />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="tourist-mobile-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)', zIndex: 10000 }}
        />
      )}

      {/* ========================================================
          ===== LEFT SIDEBAR =====
          ======================================================== */}
      <aside 
        className={`tourist-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: isDark ? '#0B132B' : '#ffffff',
          color: isDark ? '#F8FAFC' : 'var(--ink, #1a120e)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          flexShrink: 0,
          borderRight: isDark ? '1px solid #1E293B' : '1px solid rgba(26, 18, 14, 0.08)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}>
        <div>
          {/* Brand */}
          <div style={{ padding: '0 12px 24px 12px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>KAYA</span>
            <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#94A3B8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Affiliate</span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              )},
              { id: 'links', label: 'My Links', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              )},
              { id: 'campaigns', label: 'Campaigns', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              )},
              { id: 'performance', label: 'Performance', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              )},
              { id: 'payouts', label: 'Payouts', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8"/></svg>
              )},
              { id: 'referrals', label: 'Referrals', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              )},
              { id: 'assets', label: 'Marketing Assets', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              )},
              { id: 'audience', label: 'My Audience', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              )},
              { id: 'reports', label: 'Reports', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              )},
              { id: 'rewards', label: 'Rewards & Levels', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              )},
              { id: 'stays', label: 'Stays & Bookings', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h1M14 9h1M9 13h1M14 13h1"/></svg>
              )},
              { id: 'help', label: 'Help & Support', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              )},
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: active ? '#1E40AF' : 'transparent',
                    color: active ? '#ffffff' : '#94A3B8',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '#172554';
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ color: active ? '#93C5FD' : '#64748B', display: 'flex' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Gamification Card */}
        <div style={{
          backgroundColor: '#111C3A',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid #1E293B',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div 
              onClick={() => { setAvatarUrl(user?.avatar || ''); setShowAvatarModal(true); }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundImage: user?.avatar ? `url(${user.avatar})` : 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop)',
                backgroundSize: 'cover',
                border: '2px solid #3B82F6',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #111C3A',
              }}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Level 4 • Explorer Affiliate
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#94A3B8', marginBottom: '4px' }}>
              <span>420 / 1,000 XP</span>
              <span style={{ color: '#60A5FA' }}>42%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '42%', height: '100%', backgroundColor: '#3B82F6', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#1E293B',
                color: '#E2E8F0',
                fontSize: '11.5px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>View KAYA</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '7px 12px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                border: '1px solid #334155',
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          ===== MAIN CONTENT AREA (Clean Modern Crisp Layout) =====
          ======================================================== */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        {/* Top Header Bar */}
        <header style={{
          height: '68px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="tourist-mobile-menu-btn"
            style={{
              display: 'none',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              marginRight: '12px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          {/* Search Bar with ⌘ K */}
          <div style={{ position: 'relative', width: '380px' }}>
            <input
              type="text"
              placeholder="Search destinations, campaigns, tools..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 40px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F8FAFC',
                fontSize: '13.5px',
                outline: 'none',
              }}
            />
            <svg style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ position: 'absolute', right: '10px', top: '8px', padding: '2px 6px', fontSize: '11px', color: '#64748B', backgroundColor: '#E2E8F0', borderRadius: '4px', fontWeight: 600 }}>⌘ K</span>
          </div>

        {/* Right Tools: Notifications, Export, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Notification Bell with Badge 3 */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#EF4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              border: '2px solid #ffffff'
            }}>3</span>
          </div>

          {/* Export Report Button */}
          <button
            onClick={() => handleExportReport('PDF')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>

          {/* User Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop)',
              backgroundSize: 'cover',
            }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{displayName}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Affiliate Partner</div>
            </div>
          </div>
        </div>
      </header>

      {/* Inner Scrollable Container */}
      <div style={{ padding: 'clamp(16px, 3vw, 28px) clamp(16px, 3vw, 32px) 60px', minWidth: 0 }}>

          {/* ========================================================
              ===== OVERVIEW VIEW (activeTab === 'dashboard') =====
              ======================================================== */}
          {activeTab === 'dashboard' && (
            <>
              {/* ========================================================
                  ===== MOUNTAIN WELCOME BANNER (Gergeti Trinity) =====
                  ======================================================== */}
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '140px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 45%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '28px 36px',
                marginBottom: '24px',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11, 19, 43, 0.85) 0%, rgba(11, 19, 43, 0.6) 50%, rgba(11, 19, 43, 0.35) 100%)' }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>
                    Welcome back, {displayName}!
                  </h1>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>
                    Earn by sharing the beauty of Georgia.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowNewLinkModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      color: '#0F172A',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span>Create New Link</span>
                  </button>
                </div>

                {/* Top 10% Badge on Right */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minWidth: '220px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>This Month</span>
                    <span style={{ fontSize: '12px', color: '#FCD34D' }}>★</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34c3.42-.71 6-3.73 6-7.32V4H4v5.34c0 3.59 2.58 6.61 6 7.32z"/></svg>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Top 10%</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.75)' }}>
                    You&apos;re in the top 10% of KAYA affiliates!
                  </div>
                </div>
              </div>

          {/* ========================================================
              ===== 4 TOP KPI METRIC CARDS =====
              ======================================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}>
            {[
              {
                title: 'Total Earnings',
                value: `€${affiliateStats.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                growth: '↑ 28%',
                subtext: 'vs. last month',
                iconColor: '#10B981',
                bgColor: '#ECFDF5',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              },
              {
                title: 'Total Clicks',
                value: affiliateStats.totalClicks.toLocaleString(),
                growth: '↑ 16%',
                subtext: 'vs. last month',
                iconColor: '#3B82F6',
                bgColor: '#EFF6FF',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M3 3l7 18 3-7 7-3L3 3z"/></svg>
              },
              {
                title: 'Conversions',
                value: affiliateStats.conversions.toLocaleString(),
                growth: '↑ 34%',
                subtext: 'vs. last month',
                iconColor: '#10B981',
                bgColor: '#ECFDF5',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              },
              {
                title: 'Conversion Rate',
                value: `${affiliateStats.conversionRate}%`,
                growth: '↑ 0.6%',
                subtext: 'vs. last month',
                iconColor: '#6366F1',
                bgColor: '#EEF2FF',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '6px' }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {stat.value}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>{stat.growth}</span>
                    <span style={{ color: '#94A3B8' }}>{stat.subtext}</span>
                  </div>
                </div>

                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: stat.bgColor,
                  display: 'grid',
                  placeItems: 'center',
                }}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================
              ===== ROW 1: Earnings Overview + Funnel + Referral Box + Campaigns =====
              ======================================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}>
            {/* Card 1: Earnings Overview Chart */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                  Earnings Overview
                </h3>

                {/* Metric toggles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setChartMetric('earnings')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: chartMetric === 'earnings' ? '#1D4ED8' : '#64748B',
                      fontWeight: chartMetric === 'earnings' ? 700 : 500,
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
                    <span>Earnings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('clicks')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: chartMetric === 'clicks' ? '#0284C7' : '#64748B',
                      fontWeight: chartMetric === 'clicks' ? 700 : 500,
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                    <span>Clicks</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('conversions')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: chartMetric === 'conversions' ? '#059669' : '#64748B',
                      fontWeight: chartMetric === 'conversions' ? 700 : 500,
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span>Conversions</span>
                  </button>

                  <select
                    value={chartRange}
                    onChange={e => setChartRange(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      backgroundColor: '#F8FAFC',
                      color: '#475569'
                    }}
                  >
                    <option>Last 21 days</option>
                    <option>Last 30 days</option>
                    <option>This Quarter</option>
                  </select>
                </div>
              </div>

              {/* Multi-Line Area Chart Canvas */}
              <div style={{ position: 'relative', height: '190px', width: '100%' }}>
                <svg width="100%" height="100%" viewBox="0 0 540 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="affiliate-chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="affiliate-chart-clicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[30, 70, 110, 150].map((y, i) => (
                    <line key={i} x1="0" y1={y} x2="540" y2={y} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  ))}

                  {/* Area 1: Clicks */}
                  <path
                    d="M 0 155 Q 75 140 150 135 T 300 110 T 385 60 T 465 95 T 540 70 L 540 180 L 0 180 Z"
                    fill="url(#affiliate-chart-clicks)"
                  />
                  <path
                    d="M 0 155 Q 75 140 150 135 T 300 110 T 385 60 T 465 95 T 540 70"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />

                  {/* Area 2: Earnings (Primary) */}
                  <path
                    d="M 0 145 Q 75 130 150 120 T 300 95 T 385 45 T 465 75 T 540 50 L 540 180 L 0 180 Z"
                    fill="url(#affiliate-chart-grad)"
                  />
                  <path
                    d="M 0 145 Q 75 130 150 120 T 300 95 T 385 45 T 465 75 T 540 50"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                  />

                  {/* Highlight point on Oct 16 */}
                  <circle cx="385" cy="45" r="5" fill="#ffffff" stroke="#2563EB" strokeWidth="3" />
                </svg>

                {/* Interactive Tooltip Card at Oct 16 (Matching Mockup) */}
                <div style={{
                  position: 'absolute',
                  left: '60%',
                  top: '12px',
                  backgroundColor: '#0F172A',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  zIndex: 5,
                  pointerEvents: 'none'
                }}>
                  <div style={{ color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>Oct 16, 2026</div>
                  <div style={{ color: '#38BDF8', fontWeight: 700 }}>● €320.50 earnings</div>
                  <div style={{ color: '#60A5FA' }}>● 1,240 clicks</div>
                  <div style={{ color: '#34D399' }}>● 38 conversions</div>
                </div>

                {/* X Axis Labels */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px',
                  fontSize: '11px',
                  color: '#94A3B8'
                }}>
                  {chartPoints.map((p, i) => (
                    <span key={i}>{p.day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Conversion Funnel */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                  Conversion Funnel
                </h3>

                {/* 3-Tier Trapezoid Visual Funnel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Tier 1: Link Clicks */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '64px',
                      height: '32px',
                      backgroundColor: '#3B82F6',
                      clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>18,342</span>
                        <span style={{ color: '#64748B' }}>100%</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>Link Clicks</div>
                    </div>
                  </div>

                  {/* Tier 2: Product Views */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '54px',
                      height: '32px',
                      backgroundColor: '#60A5FA',
                      clipPath: 'polygon(5% 0, 95% 0, 80% 100%, 20% 100%)',
                      marginLeft: '5px'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>4,218</span>
                        <span style={{ color: '#64748B' }}>23%</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>Product Views</div>
                    </div>
                  </div>

                  {/* Tier 3: Bookings */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '32px',
                      backgroundColor: '#34D399',
                      clipPath: 'polygon(10% 0, 90% 0, 65% 100%, 35% 100%)',
                      marginLeft: '11px'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>523</span>
                        <span style={{ color: '#10B981', fontWeight: 600 }}>2.85%</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>Bookings</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '11.5px', color: '#64748B' }}>
                Average Commission: <strong style={{ color: '#0F172A' }}>€2.45</strong> per booking
              </div>
            </div>

            {/* Card 3: Your Referral Link & Social Sharing */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                    Your Referral Link
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCustomizeModal(true)}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Customize
                  </button>
                </div>

                {/* URL Pill Box with Copy */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  marginBottom: '14px',
                }}>
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      fontSize: '12px',
                      color: '#334155',
                      outline: 'none',
                      textOverflow: 'ellipsis',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(referralUrl)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copySuccess ? '#10B981' : '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: '2px',
                    }}
                    title="Copy Link"
                  >
                    {copySuccess ? (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>Copied!</span>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    )}
                  </button>
                </div>

                {/* Share Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleShare}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#2563EB',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    <span>Share Link</span>
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Discover breathtaking stays and tours across Georgia: ' + referralUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      display: 'grid',
                      placeItems: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.18-.549-1.898-.779-3.118-2.73-3.213-2.855-.095-.125-.769-1.023-.769-1.951 0-.928.486-1.383.659-1.57.172-.187.375-.234.5-.234.125 0 .25.002.359.007.115.006.269-.044.421.32.157.375.532 1.297.579 1.391.047.094.078.203.016.328-.063.125-.094.203-.188.312-.094.109-.197.244-.282.328-.094.094-.192.197-.082.385.11.188.489.807 1.05 1.306.721.642 1.329.841 1.517.935.188.094.298.078.407-.047.109-.125.469-.547.594-.734.125-.187.25-.156.422-.094.172.062 1.094.516 1.281.609.188.094.313.141.359.219.047.078.047.453-.097.858z"/></svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#1877F2',
                      color: '#ffffff',
                      display: 'grid',
                      placeItems: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/></svg>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent('Discover the magic of Georgia with KAYA!')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#0F172A',
                      color: '#ffffff',
                      display: 'grid',
                      placeItems: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>

              {/* Featured Campaigns Quick Box */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>Featured Campaigns</span>
                  <span style={{ fontSize: '11px', color: '#2563EB', cursor: 'pointer' }}>View all</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { name: 'Kazbegi Adventures', comm: '10% commission', status: 'Active' },
                    { name: 'Tbilisi City Experiences', comm: '8% commission', status: 'Active' },
                    { name: 'Kakheti Wine Tours', comm: '12% commission', status: 'Active' },
                  ].map((c, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{c.name}</div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{c.comm}</div>
                      </div>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '10.5px', fontWeight: 600 }}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              ===== ROW 2: Top Performing Links + Recent Activity + Top Destinations =====
              ======================================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}>
            {/* Top Performing Links Table */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                  Top Performing Links
                </h3>
                <span style={{ fontSize: '12px', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>View all</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B', textAlign: 'left' }}>
                      <th style={{ paddingBottom: '10px', fontWeight: 500 }}>Destination / Campaign</th>
                      <th style={{ paddingBottom: '10px', fontWeight: 500, textAlign: 'right' }}>Clicks</th>
                      <th style={{ paddingBottom: '10px', fontWeight: 500, textAlign: 'right' }}>Conversions</th>
                      <th style={{ paddingBottom: '10px', fontWeight: 500, textAlign: 'right' }}>Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Kazbegi Tour', clicks: '2,842', conv: 128, earnings: '€482.00', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=60&h=60&fit=crop' },
                      { name: 'Tbilisi Walking Tour', clicks: '1,924', conv: 86, earnings: '€231.40', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=60&h=60&fit=crop' },
                      { name: 'Batumi Hotels', clicks: '1,530', conv: 64, earnings: '€189.20', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=60&h=60&fit=crop' },
                      { name: 'Kakheti Wine Tour', clicks: '1,206', conv: 52, earnings: '€178.60', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=60&h=60&fit=crop' },
                      { name: 'Georgia Car Rentals', clicks: '980', conv: 38, earnings: '€96.40', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=60&h=60&fit=crop' },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F8FAFC' }}>
                        <td style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={row.img} alt="" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 600, color: '#1E293B' }}>{row.name}</span>
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'right', color: '#64748B' }}>{row.clicks}</td>
                        <td style={{ padding: '10px 0', textAlign: 'right', color: '#64748B' }}>{row.conv}</td>
                        <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>{row.earnings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Live Feed */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                  Recent Activity
                </h3>
                <span style={{ fontSize: '12px', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>View all</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { type: 'New booking', time: '2 minutes ago', title: 'Kazbegi Tour', amount: '€120.00', isBooking: true },
                  { type: 'Link click', time: '12 minutes ago', title: 'Batumi Hotels', amount: '-', isBooking: false },
                  { type: 'New booking', time: '28 minutes ago', title: 'Tbilisi Walking Tour', amount: '€85.00', isBooking: true },
                  { type: 'Link click', time: '1 hour ago', title: 'Kakheti Wine Tour', amount: '-', isBooking: false },
                  { type: 'New booking', time: '2 hours ago', title: 'Rooms Hotel Kazbegi', amount: '€240.00', isBooking: true },
                ].map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: act.isBooking ? '#10B981' : '#3B82F6',
                        marginTop: '4px',
                        flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{act.type}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{act.time}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#475569', fontSize: '12px' }}>{act.title}</div>
                      <div style={{ fontWeight: 600, color: act.isBooking ? '#059669' : '#94A3B8', fontSize: '12px' }}>{act.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Destinations to Promote Leaderboard */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                  Top Destinations to Promote
                </h3>
                <span style={{ fontSize: '12px', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>View all</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { rank: 1, name: 'Kazbegi', badge: 'High conversion', comm: '12% commission', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=80&h=80&fit=crop' },
                  { rank: 2, name: 'Batumi', badge: 'Trending now', comm: '10% commission', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=80&h=80&fit=crop' },
                  { rank: 3, name: 'Tbilisi', badge: 'Always popular', comm: '8% commission', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=80&h=80&fit=crop' },
                  { rank: 4, name: 'Svaneti', badge: 'Growing fast', comm: '12% commission', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=80&h=80&fit=crop' },
                  { rank: 5, name: 'Kakheti', badge: 'Seasonal opportunity', comm: '12% commission', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=80&h=80&fit=crop' },
                ].map(dest => (
                  <div key={dest.rank} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'grid',
                        placeItems: 'center'
                      }}>
                        {dest.rank}
                      </span>
                      <img src={dest.img} alt={dest.name} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{dest.name}</div>
                        <span style={{ fontSize: '10.5px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '1px 6px', borderRadius: '4px' }}>
                          {dest.badge}
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#059669' }}>
                      {dest.comm}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================
              ===== ROW 3: Payouts + Affiliate Level + Marketing Assets + Inspiration Banner =====
              ======================================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '20px',
          }}>
            {/* Payouts Table */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                  Payouts
                </h3>
                <span style={{ fontSize: '12px', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>View all</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                <thead>
                  <tr style={{ color: '#94A3B8', textAlign: 'left', borderBottom: '1px solid #F1F5F9' }}>
                    <th style={{ paddingBottom: '6px' }}>Date</th>
                    <th style={{ paddingBottom: '6px' }}>Amount</th>
                    <th style={{ paddingBottom: '6px' }}>Status</th>
                    <th style={{ paddingBottom: '6px', textAlign: 'right' }}>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Oct 1, 2026', amount: '€420.00', status: 'Paid', method: 'Bank Transfer' },
                    { date: 'Sep 1, 2026', amount: '€310.50', status: 'Paid', method: 'Bank Transfer' },
                    { date: 'Aug 1, 2026', amount: '€275.00', status: 'Paid', method: 'Bank Transfer' },
                    { date: 'Jul 1, 2026', amount: '€180.00', status: 'Paid', method: 'Bank Transfer' },
                  ].map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td style={{ padding: '8px 0', color: '#475569' }}>{p.date}</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, color: '#0F172A' }}>{p.amount}</td>
                      <td style={{ padding: '8px 0' }}>
                        <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '10.5px', fontWeight: 600 }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '8px 0', textAlign: 'right', color: '#64748B' }}>{p.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={() => setShowPayoutModal(true)}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '7px 0',
                  borderRadius: '6px',
                  border: '1px dashed #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#2563EB',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Request Payout
              </button>
            </div>

            {/* Your Affiliate Level */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                  Your Affiliate Level
                </h3>
                <span style={{ fontSize: '12px', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>View details</span>
              </div>

              {/* Active Level 4 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'grid',
                  placeItems: 'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Level 4</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Explorer Affiliate</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB' }}>420 / 1,000 XP</span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ width: '42%', height: '100%', backgroundColor: '#2563EB', borderRadius: '4px' }} />
              </div>

              {/* Locked Levels List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
                {[
                  { lvl: 'Level 5', name: 'Trailblazer', xp: '1,000 XP' },
                  { lvl: 'Level 6', name: 'Georgia Ambassador', xp: '2,500 XP' },
                  { lvl: 'Level 7', name: 'Elite Partner', xp: '5,000 XP' },
                ].map((l, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span>{l.lvl} • {l.name}</span>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{l.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Assets */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '22px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                Marketing Assets
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}>
                {[
                  { label: 'Banners', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
                  { label: 'Social Media Kits', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                  { label: 'Stories & Reels', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> },
                  { label: 'Widgets', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
                ].map((asset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => alert(`Downloading high-resolution ${asset.label} for Georgia campaigns!`)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '16px 8px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#334155',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#EFF6FF'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#F8FAFC'}
                  >
                    {asset.icon}
                    <span>{asset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Turn Inspiration into Income Promo Banner */}
            <div style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              {/* Phone Mockup Image */}
              <div style={{
                width: '74px',
                height: '110px',
                borderRadius: '12px',
                backgroundColor: '#0F172A',
                border: '3px solid #1E293B',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=120&h=200&fit=crop"
                  alt="App preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#1E3A8A' }}>
                  Turn Inspiration into Income
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '11.5px', color: '#3B82F6' }}>
                  Share Georgia. Earn Rewards.
                </p>
                <button
                  type="button"
                  onClick={() => alert('Welcome to the KAYA Ambassador Playbook: Earn up to 15% on boutique stays and mountain expeditions.')}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#1D4ED8',
                    border: '1px solid #93C5FD',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Learn How
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          ===== 2. MY LINKS MANAGER TAB =====
          ======================================================== */}
      {activeTab === 'links' && (
        <LinksTabView
          customLinks={affiliateStats.customLinks || []}
          user={user}
          affiliateStats={affiliateStats}
          onOpenCreateModal={() => setShowNewLinkModal(true)}
          onSimulateClick={simulateTestClick}
          copyToClipboard={copyToClipboard}
          copySuccess={copySuccess}
        />
      )}

      {/* ========================================================
          ===== 3. ACTIVE CAMPAIGNS TAB =====
          ======================================================== */}
      {activeTab === 'campaigns' && (
        <CampaignsTabView
          user={user}
          onPromoteCampaign={(cmp) => {
            copyToClipboard(cmp.targetUrl);
          }}
          copyToClipboard={copyToClipboard}
        />
      )}

      {/* ========================================================
          ===== 4. PERFORMANCE TAB =====
          ======================================================== */}
      {activeTab === 'performance' && (
        <PerformanceTabView
          stats={affiliateStats}
          chartPoints={chartPoints}
        />
      )}

      {/* ========================================================
          ===== 5. PAYOUTS TAB =====
          ======================================================== */}
      {activeTab === 'payouts' && (
        <PayoutsTabView
          stats={affiliateStats}
          onOpenPayoutModal={() => setShowPayoutModal(true)}
        />
      )}

      {/* ========================================================
          ===== 6. REFERRALS TAB =====
          ======================================================== */}
      {activeTab === 'referrals' && (
        <ReferralsTabView
          referralUrl={referralUrl}
          copyToClipboard={copyToClipboard}
        />
      )}

      {/* ========================================================
          ===== 7. MARKETING ASSETS TAB =====
          ======================================================== */}
      {activeTab === 'assets' && (
        <AssetsTabView
          user={user}
          copyToClipboard={copyToClipboard}
        />
      )}

      {/* ========================================================
          ===== 8. AUDIENCE DEMOGRAPHICS TAB =====
          ======================================================== */}
      {activeTab === 'audience' && (
        <AudienceTabView />
      )}

      {/* ========================================================
          ===== 9. REPORTS TAB =====
          ======================================================== */}
      {activeTab === 'reports' && (
        <ReportsTabView />
      )}

      {/* ========================================================
          ===== 10. REWARDS & LEVELS TAB =====
          ======================================================== */}
      {activeTab === 'rewards' && (
        <RewardsTabView />
      )}

      {/* ========================================================
          ===== 11. STAYS & BOOKINGS TAB =====
          ======================================================== */}
      {activeTab === 'stays' && (
        <StaysTabView
          bookings={bookings}
          onCancelBooking={handleCancelBooking}
          actionLoading={actionLoading}
        />
      )}

      {/* ========================================================
          ===== 12. HELP & SUPPORT TAB =====
          ======================================================== */}
      {activeTab === 'help' && (
        <HelpTabView />
      )}

    </div>

    {/* Live Real-Time Ticker Toast Notification */}
    {liveToast.visible && (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '12px 18px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12.5px',
        fontWeight: 500,
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
        <span>{liveToast.message}</span>
      </div>
    )}
  </main>

      {/* ========================================================
          ===== MODAL: CREATE NEW AFFILIATE LINK (MongoDB) =====
          ======================================================== */}
      {showNewLinkModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          WebkitBackdropFilter: 'blur(4px)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 10050,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Create Custom Affiliate Link
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748B' }}>
              Generate a tracked affiliate URL for any destination in Georgia and save directly to your account.
            </p>

            <form onSubmit={handleCreateLink}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Campaign Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kazbegi Winter Ski Expedition"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Target Destination
                </label>
                <select
                  value={newLinkDestination}
                  onChange={e => setNewLinkDestination(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#ffffff' }}
                >
                  <option value="Kazbegi">Kazbegi (Stepantsminda)</option>
                  <option value="Tbilisi">Tbilisi (Old Town & Vera)</option>
                  <option value="Batumi">Batumi (Adjara Coast)</option>
                  <option value="Kakheti">Kakheti (Wine Country)</option>
                  <option value="Svaneti">Svaneti (Mestia & Ushguli)</option>
                  <option value="Racha">Racha (Shaori Lake)</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Custom Slug (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. kazbegi-special"
                  value={newLinkSlug}
                  onChange={e => setNewLinkSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
                <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Preview: https://kaya.ge/{newLinkDestination.toLowerCase()}?ref={newLinkSlug || 'custom'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewLinkModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingLink}
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {creatingLink ? 'Creating...' : 'Save & Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ===== MODAL: CUSTOMIZE REFERRAL LINK =====
          ======================================================== */}
      {showCustomizeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          WebkitBackdropFilter: 'blur(4px)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 10050,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Customize Your Referral Slug
            </h3>
            <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: '#64748B' }}>
              Choose a custom vanity handle for your personal referral URL.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={customSlugInput}
                onChange={e => setCustomSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', display: 'block' }}>
                Your URL: https://kaya.ge/?ref={customSlugInput}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowCustomizeModal(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomizeModal(false);
                  alert('Custom referral link updated!');
                }}
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ===== MODAL: REQUEST PAYOUT =====
          ======================================================== */}
      {showPayoutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          WebkitBackdropFilter: 'blur(4px)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 10050,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Request Commission Payout
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
              Available balance: <strong style={{ color: '#059669' }}>€1,284.50</strong>
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Payout Amount (€)
              </label>
              <input
                type="text"
                value={payoutAmount}
                onChange={e => setPayoutAmount(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Payout Method
              </label>
              <select style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#ffffff' }}>
                <option>Bank of Georgia (IBAN GE...)</option>
                <option>TBC Bank (IBAN GE...)</option>
                <option>SEPA Transfer (EUR)</option>
                <option>Wise / Revolut</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPayoutModal(false);
                  alert(`Payout request for €${payoutAmount} submitted successfully! Transfers settle within 24 hours.`);
                }}
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Modal */}
      {showAvatarModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          WebkitBackdropFilter: 'blur(4px)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 10050,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Update Profile Picture
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
              Paste a URL to your profile photo (JPG, PNG, or WebP).
            </p>
            <input
              type="url"
              placeholder="https://example.com/your-photo.jpg"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', marginBottom: '16px' }}
            />
            {avatarUrl && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundImage: `url(${avatarUrl})`,
                  backgroundSize: 'cover',
                  border: '3px solid #3B82F6',
                }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAvatarModal(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#fff', color: '#64748B', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={savingAvatar || !avatarUrl}
                onClick={async () => {
                  setSavingAvatar(true);
                  try {
                    await fetch('/api/users/me/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ avatar: avatarUrl }),
                    });
                    setUser((prev: any) => ({ ...prev, avatar: avatarUrl }));
                    setShowAvatarModal(false);
                  } catch {}
                  setSavingAvatar(false);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3B82F6', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: savingAvatar ? 'not-allowed' : 'pointer', opacity: savingAvatar || !avatarUrl ? 0.6 : 1 }}
              >
                {savingAvatar ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

export default function KayaAffiliateAndTravelerDashboard() {
  return (
    <React.Suspense fallback={
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0B132B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        Loading dashboard...
      </div>
    }>
      <KayaDashboardInner />
    </React.Suspense>
  );
}
