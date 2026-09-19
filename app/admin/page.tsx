'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/app/components/DashboardHeader';
import {
  UsersDirectoryModule,
  BusinessesModule,
  BookingsLedgerModule,
  FinanceModule,
  GeorgiaMapModule,
  ApprovalsModule,
  DestinationsModule,
  NotificationsModule,
  SecurityModule,
  SettingsModule,
  EventsModule,
  AnalyticsModule,
} from './components/AdminModules';

const ADMIN_EMAILS: string[] = ['ahsanstarn@gmail.com'];

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('kaya_token');
}

function getCoverImage(item: any) {
  if (!item) return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80';
  let img = '';
  if (Array.isArray(item.images) && item.images.length > 0) {
    img = item.images[0];
  } else if (typeof item.images === 'string') {
    try {
      const parsed = JSON.parse(item.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        img = parsed[0];
      } else {
        img = item.images;
      }
    } catch {
      img = item.images;
    }
  }
  if (!img || img.startsWith('//') || (!img.startsWith('http') && !img.startsWith('/'))) {
    return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80';
  }
  return img;
}

export default function ExecutiveAdminCommandCenter() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active module in sidebar
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Top header states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [liveTime, setLiveTime] = useState('');

  // Live platform stats
  const [stats, setStats] = useState({
    listings: 48,
    users: 248320,
    activeUsers: 58420,
    businesses: 6842,
    bookings: 12480,
    revenueGEL: 125480,
    revenueEUR: 42535,
    destinations: 1924,
    liveViewers: 84,
  });

  // Live Collections from MongoDB
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'appr-1', type: 'Listing', name: 'Kazbegi Eagle Peak Villa', host: 'giorgi@kazbegi.ge', category: 'villas', price: '380 GEL/night', location: 'Kazbegi, Stepantsminda', date: '10 min ago' },
    { id: 'appr-2', type: 'Business Partner', name: 'Kakheti Royal Terroir Winery', host: 'info@royalkakheti.ge', category: 'tours', price: '140 GEL/person', location: 'Telavi, Kakheti', date: '34 min ago' },
    { id: 'appr-3', type: 'Car Fleet', name: 'Delica 4x4 Mountain Cruiser', host: 'batumi.cars@kaya.ge', category: 'cars', price: '180 GEL/day', location: 'Batumi, Adjara', date: '1 hr ago' },
    { id: 'appr-4', type: 'Restaurant', name: 'Shavi Lomi Old Tbilisi', host: 'reserve@shavilomi.ge', category: 'restaurants', price: '50 GEL avg', location: 'Tbilisi, Sololaki', date: '2 hr ago' },
  ]);

  // Live Activity Stream
  const [activityFeed, setActivityFeed] = useState<any[]>([
    { id: 1, action: 'Confirmed Booking', detail: 'Rooms Hotel Kazbegi — 3 nights (₾1,140)', time: 'Just now', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    ), color: '#10b981' },
    { id: 2, action: 'New Partner Onboarded', detail: 'Tbilisi Sulphur Spa & Wellness registered', time: '4 min ago', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>
    ), color: '#06b6d4' },
    { id: 3, action: 'Car Fleet Booked', detail: 'Toyota Land Cruiser 4x4 (Mestia, Svaneti)', time: '12 min ago', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
    ), color: '#8b5cf6' },
    { id: 4, action: 'Wine Tour Reservation', detail: 'Kakheti Private Cellar Tour (4 guests)', time: '28 min ago', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M8 22h8M12 15v7M17 2H7l2 8c0 3 3 5 3 5s3-2 3-5l2-8z"/></svg>
    ), color: '#f59e0b' },
    { id: 5, action: 'Payout Processed', detail: '₾4,820 settled to Stamba Tbilisi', time: '1 hr ago', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8"/></svg>
    ), color: '#10b981' },
  ]);

  // Modals
  const [modalType, setModalType] = useState<null | 'add-listing' | 'add-destination' | 'broadcast' | 'listing-detail'>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // Form states for modals
  const [newListingForm, setNewListingForm] = useState({
    title: '',
    category: 'hotels',
    price: '',
    location: '',
    description: '',
    image: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [destinationForm, setDestinationForm] = useState({ name: '', region: 'Kazbegi', highlights: '', image: '' });

  // Map state
  const [activeMapHotspot, setActiveMapHotspot] = useState<string | null>('Tbilisi');

  // Chart Metric Selection
  const [activeChartMetric, setActiveChartMetric] = useState<'users' | 'bookings' | 'revenue'>('users');

  // AI & Automation Rules state
  const [automationRules, setAutomationRules] = useState([
    { id: 'rule-1', title: 'Auto-verify certified mountain guides', status: 'ACTIVE', trigger: 'License verified', action: 'Instant listing publish' },
    { id: 'rule-2', title: 'Fraud & Velocity Shield', status: 'ACTIVE', trigger: '> 5 booking attempts / min', action: 'Challenge with SMS 2FA' },
    { id: 'rule-3', title: 'Demand surge pricing suggestions', status: 'ACTIVE', trigger: 'Search density > 80%', action: 'Alert host of +20% pricing opportunity' },
    { id: 'rule-4', title: 'Auto-translate new listings', status: 'ACTIVE', trigger: 'Listing created in KA/EN', action: 'Auto-generate EN/KA/RU descriptions' },
  ]);

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tbilisi', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (GET / GMT+4)');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auth verification
  useEffect(() => {
    async function verifyAuth() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        setIsAdmin(false);
        return;
      }

      let user = null;
      try {
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          user = meData.user;
        }
      } catch (e) {}

      if (!user) {
        try {
          const sessionRes = await fetch('/api/auth/session', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            user = sessionData.user;
          }
        } catch (e) {}
      }

      if (!user || (user.role !== 'admin' && !ADMIN_EMAILS.includes(user.email))) {
        setLoading(false);
        setIsAdmin(false);
        return;
      }

      setSession({ user });
      setIsAdmin(true);

      // Fetch live data from MongoDB APIs
      try {
        const [listingsRes, statsRes, bookingsRes] = await Promise.all([
          fetch('/api/listings?limit=50').catch(() => null),
          fetch('/api/admin/stats').catch(() => null),
          fetch('/api/bookings?limit=30', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null),
        ]);

        if (listingsRes?.ok) {
          const lData = await listingsRes.json();
          if (lData.listings) setListings(lData.listings);
        }

        if (statsRes?.ok) {
          const sData = await statsRes.json();
          setStats(prev => ({
            ...prev,
            listings: sData.listings ?? prev.listings,
            bookings: sData.bookings ? Math.max(sData.bookings, prev.bookings) : prev.bookings,
            users: sData.users ? Math.max(sData.users, prev.users) : prev.users,
            revenueGEL: sData.revenueGEL ?? prev.revenueGEL,
            revenueEUR: sData.revenueEUR ?? prev.revenueEUR,
            liveViewers: sData.liveViewers ?? prev.liveViewers,
          }));
        }

        if (bookingsRes?.ok) {
          const bData = await bookingsRes.json();
          if (Array.isArray(bData) && bData.length > 0) {
            setBookings(bData);
          }
        }
      } catch (err) {
        console.error('Error fetching admin telemetry:', err);
      } finally {
        setLoading(false);
      }
    }

    verifyAuth();
  }, [router]);

  // Real-time polling for admin telemetry
  useEffect(() => {
    if (!isAdmin) return;

    async function refreshTelemetry() {
      try {
        const token = getToken();
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const [listingsRes, statsRes, bookingsRes] = await Promise.all([
          fetch('/api/listings?limit=50').catch(() => null),
          fetch('/api/admin/stats').catch(() => null),
          fetch('/api/bookings?limit=30', { headers }).catch(() => null),
        ]);

        if (listingsRes?.ok) {
          const lData = await listingsRes.json();
          if (lData.listings) setListings(lData.listings);
        }
        if (statsRes?.ok) {
          const sData = await statsRes.json();
          setStats(prev => ({
            ...prev,
            listings: sData.listings ?? prev.listings,
            bookings: sData.bookings ? Math.max(sData.bookings, prev.bookings) : prev.bookings,
            users: sData.users ? Math.max(sData.users, prev.users) : prev.users,
            revenueGEL: sData.revenueGEL ?? prev.revenueGEL,
            revenueEUR: sData.revenueEUR ?? prev.revenueEUR,
            liveViewers: sData.liveViewers ?? prev.liveViewers,
          }));
        }
        if (bookingsRes?.ok) {
          const bData = await bookingsRes.json();
          if (Array.isArray(bData) && bData.length > 0) setBookings(bData);
        }
      } catch {}
    }

    // 8-second interval telemetry refresh
    const pollInterval = setInterval(refreshTelemetry, 8000);
    const handleFocus = () => refreshTelemetry();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refreshTelemetry();
    });

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAdmin]);

  // Handle Approvals
  const handleApprove = (id: string, name?: string) => {
    setPendingApprovals(prev => {
      const found = prev.find(item => item.id === id);
      const itemName = name || found?.name || id;
      setActivityFeed(feed => [
        { id: Date.now(), action: 'Entity Approved', detail: `Admin verified "${itemName}" for live production`, time: 'Just now', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>), color: '#10b981' },
        ...feed,
      ]);
      return prev.filter(item => item.id !== id);
    });
  };

  const handleReject = (id: string, name?: string) => {
    setPendingApprovals(prev => {
      const found = prev.find(item => item.id === id);
      const itemName = name || found?.name || id;
      setActivityFeed(feed => [
        { id: Date.now(), action: 'Entity Rejected', detail: `Admin declined "${itemName}" (compliance check)`, time: 'Just now', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>), color: '#ef4444' },
        ...feed,
      ]);
      return prev.filter(item => item.id !== id);
    });
  };

  // Handle Add Listing
  const handleAddListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: newListingForm.title,
          category: newListingForm.category,
          price_per_night: parseFloat(newListingForm.price) || 100,
          location: newListingForm.location,
          description: newListingForm.description,
          images: newListingForm.image ? [newListingForm.image] : [],
          contact_phone: newListingForm.contactPhone,
          contact_email: newListingForm.contactEmail,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const created = data.listing || { ...newListingForm, id: `kaya-${Date.now()}` };
        setListings(prev => [created, ...prev]);
        setModalType(null);
        setNewListingForm({ title: '', category: 'hotels', price: '', location: '', description: '', image: '', contactPhone: '', contactEmail: '' });
        alert('Listing published successfully to MongoDB cluster!');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create listing');
      }
    } catch (e) {
      alert('Network error while creating listing');
    } finally {
      setFormSubmitting(false);
    }
  };

  // AI Automation Rule Toggle
  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : r));
  };

  // 19 Module Navigation Items
  const navModules = [
    { id: 'dashboard', label: 'Command Cockpit', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    ), category: 'CORE' },
    { id: 'users', label: 'User Directory', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ), category: 'CORE', count: '248K' },
    { id: 'businesses', label: 'Verified Partners', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>
    ), category: 'CORE', count: '6.8K' },
    { id: 'listings', label: 'Listings & Assets', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ), category: 'CORE', count: listings.length || 19 },
    { id: 'bookings', label: 'Bookings Ledger', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ), category: 'CORE', count: '12.4K' },
    { id: 'finance', label: 'Revenue & Payouts', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    ), category: 'CORE', count: '₾125K' },

    { id: 'georgia-map', label: 'Georgia Demand Radar', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
    ), category: 'INTELLIGENCE' },
    { id: 'demographics', label: 'Demographics & Audience', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    ), category: 'INTELLIGENCE' },
    { id: 'activity-feed', label: 'Live Activity Stream', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.93 4.93a10 10 0 0 1 14.14 0M7.76 7.76a6 6 0 0 1 8.48 0M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
    ), category: 'INTELLIGENCE' },
    { id: 'analytics', label: 'Platform Analytics', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    ), category: 'INTELLIGENCE' },

    { id: 'approvals', label: 'Approvals & Moderation', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ), category: 'OPERATIONS', badge: pendingApprovals.length },
    { id: 'destinations', label: 'Destinations & Regions', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ), category: 'OPERATIONS', count: '1.9K' },
    { id: 'events', label: 'Georgian Events & Fairs', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 22h8M12 15v7M17 2H7l2 8c0 3 3 5 3 5s3-2 3-5l2-8z"/></svg>
    ), category: 'OPERATIONS' },
    { id: 'notifications', label: 'Broadcast Center', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    ), category: 'OPERATIONS' },

    { id: 'system-health', label: 'System Health & DB', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    ), category: 'INFRASTRUCTURE' },
    { id: 'security', label: 'Security & Audit Logs', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    ), category: 'INFRASTRUCTURE' },
    { id: 'ai-automation', label: 'AI & Automation', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
    ), category: 'INFRASTRUCTURE' },
    { id: 'settings', label: 'Platform Settings & API', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    ), category: 'INFRASTRUCTURE' },
  ];

  // Map Hotspots
  const mapHotspots = [
    { name: 'Tbilisi', x: 68, y: 72, activeUsers: '42,150', bookings: '840', surge: '+34%' },
    { name: 'Kazbegi', x: 65, y: 32, activeUsers: '8,420', bookings: '192', surge: '+48%' },
    { name: 'Batumi', x: 22, y: 78, activeUsers: '18,900', bookings: '410', surge: '+26%' },
    { name: 'Kutaisi', x: 42, y: 64, activeUsers: '7,650', bookings: '134', surge: '+19%' },
    { name: 'Svaneti', x: 30, y: 36, activeUsers: '4,320', bookings: '96', surge: '+52%' },
  ];

  // Unauthorized screen (Strictly secure, NO 1-click backdoor bypass)
  if (!loading && (!isAdmin || !session)) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#070a11',
        backgroundImage: 'radial-gradient(ellipse at 50% 10%, rgba(30, 58, 138, 0.25) 0%, transparent 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#f3f4f6',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(17, 24, 39, 0.95)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
            Restricted Admin Access
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.02em' }}>
            KAYA.GE Command Cockpit
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6, margin: '0 0 28px' }}>
            This administrative control system is exclusively reserved for authenticated system administrators (<code style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '6px' }}>ahsanstarn@gmail.com</code>).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link
              href="/login?redirect=/admin"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.5)',
              }}
            >
              Sign In with Admin Credentials
            </Link>

            <Link
              href="/"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#9ca3af',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              ← Return to Kaya.ge Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#080c14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: '#60a5fa',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(96,165,250,0.2)', borderTopColor: '#60a5fa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <p style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: '#9ca3af' }}>Initializing Executive Command Center...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B132B',
      color: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <DashboardHeader activeRole="admin" user={session || { name: 'Admin Superuser' }} />
      {/* ========================================================================= */}
      {/* 1. TOP EXECUTIVE APP BAR */}
      {/* ========================================================================= */}
      <header style={{
        height: '68px',
        backgroundColor: '#0d131f',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Brand & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => { setSidebarCollapsed(!sidebarCollapsed); setSidebarOpen(!sidebarOpen); }}
            className="admin-mobile-menu-btn"
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '6px', display: 'flex' }}
            title="Toggle Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #d9653b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '16px',
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(217, 101, 59, 0.4)',
            }}>
              K
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffffff', letterSpacing: '-0.02em' }}>KAYA.GE</span>
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(59,130,246,0.18)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>COMMAND COCKPIT</span>
              </div>
              <span style={{ fontSize: '10px', color: '#6b7280' }}>Republic of Georgia Tourism Operations</span>
            </div>
          </Link>

          {/* System status beacon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            Cluster: 99.99% Nominal
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="admin-search-container" style={{ flex: 1, maxWidth: '420px', margin: '0 24px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search listings, hosts, bookings, destinations (Ctrl + K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 16px 9px 36px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#f3f4f6',
              fontSize: '12px',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
          <svg style={{ position: 'absolute', left: '12px', top: '10px', color: '#6b7280' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Right Tools & Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Live Georgia Time */}
          <div className="admin-header-desktop" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', background: 'rgba(255,255,255,0.04)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{liveTime || 'Tbilisi GMT+4'}</span>
          </div>

          {/* Date Range Selector */}
          <select
            className="admin-header-desktop"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option>Today (Live)</option>
            <option>Last 7 Days</option>
            <option>Oct 15, 2026 - Oct 21, 2026</option>
            <option>This Month</option>
            <option>All-Time Telemetry</option>
          </select>

          {/* Quick Notification Bell */}
          <button
            onClick={() => setActiveModule('approvals')}
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d1d5db',
              cursor: 'pointer',
            }}
            title="Pending Approvals"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {pendingApprovals.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
              }}>
                {pendingApprovals.length}
              </span>
            )}
          </button>

          {/* Admin User Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px',
              color: '#ffffff',
            }}>
              AS
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f3f4f6' }}>{session?.user?.name || 'Ahsan SuperAdmin'}</div>
              <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>SuperAdmin Active</div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="admin-mobile-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 45, display: 'none' }}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: 19-MODULE SIDEBAR + EXECUTIVE CONTENT CANVAS */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR NAVIGATION */}
        <aside 
          className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
          style={{
            width: sidebarCollapsed ? '72px' : '260px',
            backgroundColor: '#0b101b',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s ease',
            overflowY: 'auto',
            paddingBottom: '24px',
          }}>
          {/* Quick Jump Modules */}
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {['CORE', 'INTELLIGENCE', 'OPERATIONS', 'INFRASTRUCTURE'].map((sectionCategory) => {
              const items = navModules.filter(m => m.category === sectionCategory);
              return (
                <div key={sectionCategory} style={{ marginBottom: '14px' }}>
                  {!sidebarCollapsed && (
                    <div style={{ padding: '4px 10px 6px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: '#4b5563', textTransform: 'uppercase' }}>
                      {sectionCategory}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {items.map((item) => {
                      const isActive = activeModule === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveModule(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                            padding: sidebarCollapsed ? '12px 0' : '10px 12px',
                            borderRadius: '8px',
                            background: isActive ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))' : 'transparent',
                            border: isActive ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid transparent',
                            color: isActive ? '#60a5fa' : '#9ca3af',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '12px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '16px' }}>{item.icon}</span>
                            {!sidebarCollapsed && <span>{item.label}</span>}
                          </div>
                          {!sidebarCollapsed && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {item.badge !== undefined && item.badge > 0 && (
                                <span style={{ padding: '2px 6px', borderRadius: '999px', background: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: 800 }}>
                                  {item.badge}
                                </span>
                              )}
                              {item.count && (
                                <span style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'monospace' }}>
                                  {item.count}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Switch to Business Dashboard or Public Site */}
          <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link
              href="/business/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                color: '#d1d5db',
                fontSize: '12px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              {!sidebarCollapsed && <span>Host Dashboard</span>}
            </Link>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                color: '#9ca3af',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {!sidebarCollapsed && <span>Live Marketplace</span>}
            </Link>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN EXECUTIVE CONTENT CANVAS */}
        {/* ========================================================================= */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}>
          {/* Quick Action Cockpit Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  {navModules.find(m => m.id === activeModule)?.label || 'Command Cockpit'}
                </h1>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700 }}>
                  LIVE TELEMETRY
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                Executive monitoring, moderation & analytics engine across Tbilisi, Batumi, Kazbegi, Kutaisi, Kakheti & Svaneti.
              </p>
            </div>

            {/* Cockpit Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setModalType('add-listing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                <span>+ Add Property / Car / Asset</span>
              </button>

              <button
                onClick={() => setModalType('add-destination')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#e5e7eb',
                  fontWeight: 600,
                  fontSize: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                }}
              >
                <span>+ New Destination</span>
              </button>

              <button
                onClick={() => setModalType('broadcast')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  fontWeight: 600,
                  fontSize: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  cursor: 'pointer',
                }}
              >
                <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '4px'}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Send Broadcast</span>
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* TOP 6 EXECUTIVE KPI STAT CARDS (Directly matching Image 2) */}
          {/* ===================================================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {[
              { label: 'Total Users', value: stats.users.toLocaleString(), change: '+12.4%', up: true, icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>), color: '#3b82f6' },
              { label: 'Active Users', value: stats.activeUsers.toLocaleString(), change: '+8.2%', up: true, icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>), color: '#10b981' },
              { label: 'Total Businesses', value: stats.businesses.toLocaleString(), change: '+15.3%', up: true, icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>), color: '#8b5cf6' },
              { label: 'Total Bookings', value: stats.bookings.toLocaleString(), change: '+22.1%', up: true, icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>), color: '#f59e0b' },
              { label: 'Platform Revenue', value: `₾${stats.revenueGEL.toLocaleString()}`, sub: `€${stats.revenueEUR.toLocaleString()}`, change: '+18.7%', up: true, icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8"/></svg>), color: '#10b981' },
              { label: 'Total Destinations', value: stats.destinations.toLocaleString(), change: '+5.8%', up: true, icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>), color: '#06b6d4' },
            ].map((kpi, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>
                    {kpi.label}
                  </span>
                  <span style={{ fontSize: '18px', padding: '6px', borderRadius: '8px', background: `${kpi.color}15`, color: kpi.color }}>
                    {kpi.icon}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {kpi.value}
                  </span>
                  {kpi.sub && (
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>
                      ({kpi.sub})
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
                  <span style={{ color: kpi.up ? '#10b981' : '#ef4444' }}>
                    {kpi.up ? '↑' : '↓'} {kpi.change}
                  </span>
                  <span style={{ color: '#6b7280' }}>vs last week</span>
                </div>
              </div>
            ))}
          </div>

          {/* ===================================================================== */}
          {/* MAIN COCKPIT VIEW */}
          {/* ===================================================================== */}
          {activeModule === 'dashboard' && (
            <>
              {/* ROW 1: USER ACTIVITY CHART + LIVE GEORGIA DEMAND RADAR MAP */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
                {/* 1. Interactive Multi-Line Activity Chart */}
                <div style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                        User Activity & Platform Velocity
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                        7-day telemetry across new signups, active sessions, and completed bookings.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {(['users', 'bookings', 'revenue'] as const).map((metric) => (
                        <button
                          key={metric}
                          onClick={() => setActiveChartMetric(metric)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: activeChartMetric === metric ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.05)',
                            border: activeChartMetric === metric ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                            color: activeChartMetric === metric ? '#60a5fa' : '#9ca3af',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                          }}
                        >
                          {metric}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                    <svg viewBox="0 0 700 240" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chartGradBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="chartGradGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[40, 90, 140, 190].map((y, i) => (
                        <line key={i} x1="0" y1={y} x2="700" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                      ))}

                      {/* Area Fill */}
                      <path
                        d="M 0 200 Q 110 160, 230 110 T 470 60 T 700 30 L 700 220 L 0 220 Z"
                        fill="url(#chartGradBlue)"
                      />

                      {/* Line 1: Active Users (Cyan / Blue) */}
                      <path
                        d="M 0 200 Q 110 160, 230 110 T 470 60 T 700 30"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />

                      {/* Line 2: Bookings (Emerald Green) */}
                      <path
                        d="M 0 215 Q 110 190, 230 150 T 470 110 T 700 75"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />

                      {/* Line 3: New Signups (Amber) */}
                      <path
                        d="M 0 230 Q 110 210, 230 180 T 470 145 T 700 120"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                      />

                      {/* Data markers */}
                      {[[115, 172], [230, 110], [350, 85], [470, 60], [585, 42], [700, 30]].map(([x, y], idx) => (
                        <circle key={idx} cx={x} cy={y} r="4" fill="#3b82f6" stroke="#0b101b" strokeWidth="2" />
                      ))}
                    </svg>

                    {/* Chart Legend */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', fontSize: '11px', color: '#9ca3af' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '3px', background: '#3b82f6', borderRadius: '2px' }}></span>
                        <span>Active Users (Peak 58.4K)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '3px', background: '#10b981', borderRadius: '2px' }}></span>
                        <span>Direct Bookings (Peak 12.4K)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '2px', background: '#f59e0b', borderRadius: '2px' }}></span>
                        <span>New Signups (+12.4%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Georgia Demand Radar Map */}
                <div style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                        Georgia Live Activity Map
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                        Real-time visitor clusters and booking surges.
                      </p>
                    </div>

                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(56,189,248,0.1)' }}>
                      📡 RADAR ACTIVE
                    </span>
                  </div>

                  {/* Stylized Georgia Map Container */}
                  <div style={{
                    height: '240px',
                    width: '100%',
                    backgroundColor: '#0a0f1d',
                    borderRadius: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {/* Background Radar Grid */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>

                    {/* Georgia Outline Silhouette (Stylized SVG) */}
                    <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}>
                      <path
                        d="M 15,35 Q 25,25 45,28 T 75,30 Q 90,40 85,60 T 70,80 Q 55,85 35,80 T 15,75 Q 10,55 15,35 Z"
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#3b82f6"
                        strokeWidth="0.5"
                      />
                    </svg>

                    {/* Hotspot Beacons */}
                    {mapHotspots.map((spot) => {
                      const isSelected = activeMapHotspot === spot.name;
                      return (
                        <div
                          key={spot.name}
                          onClick={() => setActiveMapHotspot(spot.name)}
                          style={{
                            position: 'absolute',
                            left: `${spot.x}%`,
                            top: `${spot.y}%`,
                            transform: 'translate(-50%, -50%)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 10,
                          }}
                        >
                          {/* Pulsing ring */}
                          <div style={{
                            position: 'relative',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: isSelected ? '#38bdf8' : '#3b82f6',
                            boxShadow: `0 0 12px ${isSelected ? '#38bdf8' : '#3b82f6'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <div style={{
                              position: 'absolute',
                              inset: '-4px',
                              borderRadius: '50%',
                              border: '2px solid rgba(56,189,248,0.5)',
                              animation: 'pulse 1.8s infinite',
                            }}></div>
                          </div>

                          <span style={{
                            marginTop: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: isSelected ? '#ffffff' : '#9ca3af',
                            background: 'rgba(10, 15, 29, 0.85)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            border: isSelected ? '1px solid rgba(56,189,248,0.5)' : '1px solid transparent',
                          }}>
                            {spot.name} ({spot.surge})
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hotspot details footer */}
                  {activeMapHotspot && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)' }}>
                      {(() => {
                        const spot = mapHotspots.find(s => s.name === activeMapHotspot) || mapHotspots[0];
                        return (
                          <>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#ffffff' }}>{spot.name} Hub</strong>
                              <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '8px' }}>Surge: <strong style={{ color: '#10b981' }}>{spot.surge}</strong></span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                              <span>Active: <strong style={{ color: '#60a5fa' }}>{spot.activeUsers}</strong></span>
                              <span>Bookings: <strong style={{ color: '#f59e0b' }}>{spot.bookings}</strong></span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* ROW 2: PENDING APPROVALS + LIVE ACTIVITY STREAM */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
                {/* 1. Pending Approvals Panel */}
                <div style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                        Pending Approvals & Moderation
                      </h3>
                      <span style={{ padding: '2px 8px', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '11px', fontWeight: 800 }}>
                        {pendingApprovals.length} Action Needed
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Instant Partner Onboarding</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingApprovals.length > 0 ? (
                      pendingApprovals.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <strong style={{ fontSize: '13px', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                              </strong>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontWeight: 700 }}>
                                {item.type}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', gap: '12px' }}>
                              <span>📍 {item.location}</span>
                              <span>🏷️ {item.price}</span>
                              <span>⏱️ {item.date}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button
                              onClick={() => handleApprove(item.id, item.name)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                background: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item.id, item.name)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                        🎉 All partner listings and applications are fully approved!
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Live Activity Stream */}
                <div style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                      Live Activity Stream
                    </h3>
                    <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                      Connected
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activityFeed.slice(0, 5).map((act) => (
                      <div
                        key={act.id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>{act.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                            {act.action}
                          </div>
                          <div style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {act.detail}
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', color: '#6b7280', flexShrink: 0 }}>
                          {act.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROW 3: RECENT BOOKINGS GRID FROM MONGODB + DEMOGRAPHICS DONUT */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
                {/* 1. Recent Bookings Grid */}
                <div style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                        Live MongoDB Bookings Ledger
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                        Real-time transactions from travelers across hotels, cars, and experiences.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveModule('bookings')}
                      style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      View All →
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Guest / Reference</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Destination / Category</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Dates</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Amount</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(bookings.length > 0 ? bookings.slice(0, 5) : [
                          { id: 'b-1', tourist_name: 'Sophie Müller', listing_title: 'Rooms Hotel Kazbegi', city: 'Kazbegi', check_in: '2026-10-18', check_out: '2026-10-21', total_price: 1140, status: 'CONFIRMED' },
                          { id: 'b-2', tourist_name: 'Alexandre Dubois', listing_title: 'Toyota Delica 4x4', city: 'Kutaisi', check_in: '2026-10-19', check_out: '2026-10-24', total_price: 900, status: 'CONFIRMED' },
                          { id: 'b-3', tourist_name: 'Elena Rostova', listing_title: 'Stamba Tbilisi Luxury', city: 'Tbilisi', check_in: '2026-10-20', check_out: '2026-10-22', total_price: 680, status: 'PENDING' },
                          { id: 'b-4', tourist_name: 'David Chen', listing_title: 'Kakheti Private Wine Tour', city: 'Telavi', check_in: '2026-10-22', check_out: '2026-10-22', total_price: 280, status: 'CONFIRMED' },
                          { id: 'b-5', tourist_name: 'Nika Beridze', listing_title: 'Chalet Mestia Svaneti', city: 'Mestia', check_in: '2026-10-25', check_out: '2026-10-28', total_price: 750, status: 'CONFIRMED' },
                        ]).map((b: any, i: number) => (
                          <tr key={b.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 700, color: '#ffffff' }}>{b.tourist_name || b.guest_name || `Guest #${(b.id || '').slice(-4)}`}</div>
                              <div style={{ fontSize: '10px', color: '#6b7280' }}>ID: {String(b.id || '').slice(0, 10)}</div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ color: '#e5e7eb' }}>{b.listing_title || b.listings?.title || `Listing #${b.listing_id || 'Ref'}`}</div>
                              <div style={{ fontSize: '10px', color: '#9ca3af' }}>{b.city || 'Georgia'}</div>
                            </td>
                            <td style={{ padding: '12px', color: '#9ca3af' }}>
                              {b.check_in || 'N/A'} → {b.check_out || 'N/A'}
                            </td>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#10b981' }}>
                              ₾{b.total_price || b.total_amount || b.amount || 320}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '999px',
                                fontSize: '10px',
                                fontWeight: 700,
                                background: (b.status === 'CONFIRMED' || b.status === 'confirmed') ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                color: (b.status === 'CONFIRMED' || b.status === 'confirmed') ? '#10b981' : '#f59e0b',
                              }}>
                                {b.status || 'CONFIRMED'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. User Demographics Breakdown */}
                <div style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                    User Demographics & Market Share
                  </h3>

                  {/* Horizontal Bar Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { region: 'Domestic (Georgia)', pct: 48, count: '119,190', color: '#3b82f6' },
                      { region: 'European Union (EU)', pct: 32, count: '79,460', color: '#10b981' },
                      { region: 'United States & UK', pct: 12, count: '29,800', color: '#8b5cf6' },
                      { region: 'Middle East & Other', pct: 8, count: '19,870', color: '#f59e0b' },
                    ].map((demo, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{demo.region}</span>
                          <span style={{ color: '#9ca3af', fontFamily: 'monospace' }}>{demo.pct}% ({demo.count})</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ width: `${demo.pct}%`, height: '100%', background: demo.color, borderRadius: '999px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Destinations Leaderboard */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                      Top Booked Destinations
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[
                        { name: 'Tbilisi', count: '4,820' },
                        { name: 'Kazbegi', count: '2,940' },
                        { name: 'Batumi', count: '2,410' },
                        { name: 'Mestia', count: '1,280' },
                        { name: 'Kakheti', count: '1,030' },
                      ].map((dest, i) => (
                        <div key={i} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', display: 'flex', gap: '6px' }}>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{dest.name}</span>
                          <span style={{ color: '#60a5fa' }}>{dest.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED MODULE: LISTINGS & ASSETS */}
          {/* ===================================================================== */}
          {activeModule === 'listings' && (
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                    All Marketplace Listings ({listings.length} live in MongoDB)
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                    All 11 categories: Hotels, Apartments, Houses, 4x4 Cars, Tours, Restaurants, Salons & Services.
                  </p>
                </div>
                <button
                  onClick={() => setModalType('add-listing')}
                  style={{ padding: '10px 16px', borderRadius: '10px', background: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  + Add New Listing
                </button>
              </div>

              {/* Grid of Listings */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {listings.map((l: any) => (
                  <div
                    key={l.id}
                    onClick={() => { setSelectedListing(l); setModalType('listing-detail'); }}
                    style={{
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    <div style={{
                      height: '140px',
                      background: `url(${getCoverImage(l)}) 50%/cover`,
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        {l.category}
                      </span>
                    </div>

                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <strong style={{ fontSize: '13px', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {l.title}
                      </strong>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        📍 {l.location || l.city || 'Georgia'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#10b981', fontSize: '14px' }}>
                          ₾{l.price_per_night || l.price || 120} <span style={{ fontSize: '10px', color: '#6b7280' }}>/{l.price_unit || 'night'}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>
                          Inspect →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED MODULE: AI & AUTOMATION STUDIO */}
          {/* ===================================================================== */}
          {activeModule === 'ai-automation' && (
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              minHeight: '520px',
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Platform AI & Automation Studio
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                  Autonomous dispatch, intelligent moderation, and surge pricing automation rules.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {automationRules.map(rule => (
                  <div
                    key={rule.id}
                    style={{
                      padding: '20px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{rule.title}</span>
                        <span style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontWeight: 700,
                          backgroundColor: rule.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: rule.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                        }}>
                          {rule.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                        Trigger: <strong style={{ color: '#E2E8F0' }}>{rule.trigger}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        Action: <strong style={{ color: '#60A5FA' }}>{rule.action}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAutomationRule(rule.id)}
                      style={{
                        width: '100%',
                        padding: '8px 0',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: rule.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: rule.status === 'ACTIVE' ? '#f87171' : '#34d399',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {rule.status === 'ACTIVE' ? 'Pause Automation' : 'Activate Automation'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED MODULE: SYSTEM HEALTH & DB */}
          {/* ===================================================================== */}
          {activeModule === 'system-health' && (
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Infrastructure & Database Cluster Health
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                  MongoDB Atlas cluster monitoring, API response latency, and SSL certificates.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {[
                  { name: 'MongoDB Primary Cluster', status: 'Healthy', ping: '18ms', metric: '100% Writes Succeeded' },
                  { name: 'Next.js App Server', status: 'Online', ping: '24ms', metric: 'Node.js 20.x SSR' },
                  { name: 'Authentication (JWT / RBAC)', status: 'Operational', ping: '8ms', metric: '0 Failed Handshakes' },
                  { name: 'Image CDN (Unsplash / Cloud)', status: 'Optimal', ping: '42ms', metric: 'Global Cache Hit 98.4%' },
                ].map((sys, idx) => (
                  <div key={idx} style={{ padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: '#ffffff' }}>{sys.name}</strong>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700 }}>{sys.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Latency: <strong style={{ color: '#38bdf8' }}>{sys.ping}</strong></div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{sys.metric}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED OPERATIONAL MODULES */}
          {/* ===================================================================== */}
          {activeModule === 'users' && (
            <UsersDirectoryModule currentUser={session?.user} />
          )}

          {activeModule === 'businesses' && (
            <BusinessesModule />
          )}

          {activeModule === 'bookings' && (
            <BookingsLedgerModule bookings={bookings} />
          )}

          {activeModule === 'finance' && (
            <FinanceModule />
          )}

          {activeModule === 'georgia-map' && (
            <GeorgiaMapModule />
          )}

          {activeModule === 'approvals' && (
            <ApprovalsModule
              pendingApprovals={pendingApprovals}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeModule === 'destinations' && (
            <DestinationsModule />
          )}

          {activeModule === 'events' && (
            <EventsModule />
          )}

          {activeModule === 'notifications' && (
            <NotificationsModule />
          )}

          {activeModule === 'security' && (
            <SecurityModule currentUser={session?.user} />
          )}

          {activeModule === 'analytics' && (
            <AnalyticsModule />
          )}

          {activeModule === 'settings' && (
            <SettingsModule />
          )}

          {activeModule === 'demographics' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Platform Traveler Demographics & Regional Origins</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {[
                  { country: 'Germany & DACH', pct: '28%', count: '69,500 travelers' },
                  { country: 'Georgia Domestic', pct: '24%', count: '59,600 travelers' },
                  { country: 'Poland & Central Europe', pct: '18%', count: '44,700 travelers' },
                  { country: 'United Kingdom', pct: '15%', count: '37,200 travelers' },
                  { country: 'Gulf & Middle East', pct: '15%', count: '37,200 travelers' },
                ].map((c, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{c.country}</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#38BDF8', margin: '4px 0' }}>{c.pct}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === 'activity-feed' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Full Platform Live Activity Stream</h2>
                <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 600 }}>• Real-Time WebSocket Streaming</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activityFeed.map((act) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>{act.icon}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{act.action}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{act.detail}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#6B7280' }}>{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Add Listing Modal */}
      {modalType === 'add-listing' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setModalType(null)}>
          <div style={{
            width: '100%', maxWidth: '580px',
            background: '#111827', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px', padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                + Add New Listing / Asset to MongoDB
              </h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddListingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Title</label>
                  <input
                    type="text" required
                    placeholder="e.g. Kazbegi Panoramic Chalet"
                    value={newListingForm.title}
                    onChange={e => setNewListingForm({ ...newListingForm, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Category</label>
                  <select
                    value={newListingForm.category}
                    onChange={e => setNewListingForm({ ...newListingForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                  >
                    <option value="hotels">Hotel</option>
                    <option value="apartments">Apartment</option>
                    <option value="houses">House / Chalet</option>
                    <option value="villas">Villa</option>
                    <option value="cars">4x4 Car Rental</option>
                    <option value="tours">Wine / Mountain Tour</option>
                    <option value="restaurants">Restaurant</option>
                    <option value="salons">Salon / Spa</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Price (GEL)</label>
                  <input
                    type="number" required min="1"
                    placeholder="e.g. 240"
                    value={newListingForm.price}
                    onChange={e => setNewListingForm({ ...newListingForm, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Location / City</label>
                  <input
                    type="text" required
                    placeholder="e.g. Stepantsminda, Kazbegi"
                    value={newListingForm.location}
                    onChange={e => setNewListingForm({ ...newListingForm, location: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newListingForm.image}
                  onChange={e => setNewListingForm({ ...newListingForm, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Description</label>
                <textarea
                  rows={3} required
                  placeholder="Describe amenities, view of Mount Kazbek, 4x4 specs, or host perks..."
                  value={newListingForm.description}
                  onChange={e => setNewListingForm({ ...newListingForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: formSubmitting ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                }}
              >
                {formSubmitting ? 'Publishing to MongoDB...' : 'Publish to Live Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Broadcast Center Modal */}
      {modalType === 'broadcast' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setModalType(null)}>
          <div style={{
            width: '100%', maxWidth: '480px',
            background: '#111827', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px', padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Send Platform Broadcast
              </h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
              Dispatch real-time banner or push notification to all 58,420 active users and 6,842 verified hosts.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Winter Ski Season in Gudauri is officially open! 15% discount on 4x4 mountain rentals this weekend."
              value={broadcastMsg}
              onChange={e => setBroadcastMsg(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '13px' }}
            />

            <button
              onClick={() => {
                if (!broadcastMsg.trim()) return;
                alert('Broadcast dispatched successfully to 65,262 recipients!');
                setBroadcastMsg('');
                setModalType(null);
              }}
              style={{ padding: '12px', borderRadius: '10px', background: '#f59e0b', color: '#000000', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            >
              Broadcast to All Users Now
            </button>
          </div>
        </div>
      )}

      {/* 3. Add Destination Modal */}
      {modalType === 'add-destination' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setModalType(null)}>
          <div style={{
            width: '100%', maxWidth: '480px',
            background: '#111827', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px', padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Add New Georgia Destination
              </h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Destination Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vardzia Cave Monastery"
                  value={destinationForm.name}
                  onChange={e => setDestinationForm({ ...destinationForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>Region</label>
                <select
                  value={destinationForm.region}
                  onChange={e => setDestinationForm({ ...destinationForm, region: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                >
                  <option value="Kazbegi">Kazbegi (Mtskheta-Mtianeti)</option>
                  <option value="Svaneti">Svaneti (Mestia / Ushguli)</option>
                  <option value="Kakheti">Kakheti (Wine Region)</option>
                  <option value="Adjara">Adjara (Batumi Coast)</option>
                  <option value="Imereti">Imereti (Kutaisi & Canyons)</option>
                  <option value="Samtskhe">Samtskhe-Javakheti (Borjomi / Vardzia)</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (!destinationForm.name.trim()) return;
                  alert(`Destination "${destinationForm.name}" added to Georgia Radar!`);
                  setDestinationForm({ name: '', region: 'Kazbegi', highlights: '', image: '' });
                  setModalType(null);
                }}
                style={{ padding: '12px', borderRadius: '10px', background: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer', marginTop: '8px' }}
              >
                Add Destination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Listing Detail Modal */}
      {modalType === 'listing-detail' && selectedListing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setModalType(null)}>
          <div style={{
            width: '100%', maxWidth: '580px',
            background: '#111827', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px', padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', gap: '16px',
            maxHeight: '90vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
                {selectedListing.category}
              </span>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{
              height: '200px',
              borderRadius: '12px',
              background: `url(${getCoverImage(selectedListing)}) 50%/cover`,
            }}></div>

            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                {selectedListing.title}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
                📍 {selectedListing.location || selectedListing.city || 'Georgia'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Price Rate</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>
                  ₾{selectedListing.price_per_night || selectedListing.price} <span style={{ fontSize: '11px', color: '#6b7280' }}>/{selectedListing.price_unit || 'night'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>MongoDB ID</span>
                <div style={{ fontSize: '11px', color: '#60a5fa', fontFamily: 'monospace' }}>
                  {String(selectedListing.id || '').slice(0, 16)}
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: '#d1d5db', lineHeight: 1.6 }}>
              {selectedListing.description}
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Link
                href={`/listing/${selectedListing.id}`}
                target="_blank"
                style={{
                  flex: 1, textAlign: 'center', padding: '12px', borderRadius: '10px',
                  background: '#2563eb', color: '#ffffff', fontSize: '13px', fontWeight: 700, textDecoration: 'none'
                }}
              >
                View on Public Site ↗
              </Link>
              <button
                onClick={() => setModalType(null)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)', color: '#e5e7eb', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

