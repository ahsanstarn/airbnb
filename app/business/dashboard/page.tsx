'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/app/components/DashboardHeader';

type BusinessModule =
  | 'home'
  | 'receptionist'
  | 'demand'
  | 'empty-slot'
  | 'crm'
  | 'calendar'
  | 'listing-builder'
  | 'analytics'
  | 'subscription';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  interest: string;
  value: number;
  stage: 'new' | 'contacted' | 'quoted' | 'booked' | 'completed';
  createdAt: string;
}

const INITIAL_LEADS: Lead[] = [
  { id: 'lead-1', name: 'Alexander Schmidt', email: 'alex.s@berlin-travel.de', phone: '+49 170 829104', source: 'Google Search', interest: '7-Day Kazbegi & Kakheti Private Tour', value: 1450, stage: 'new', createdAt: '10 mins ago' },
  { id: 'lead-2', name: 'Sophie Laurent', email: 'sophie.l@orange.fr', phone: '+33 6 12 34 56 78', source: 'Instagram Ad', interest: 'Wine Harvest Villa with Qvevri Cellar', value: 880, stage: 'contacted', createdAt: '2 hours ago' },
  { id: 'lead-3', name: 'Tariq Al-Mansoor', email: 'tariq@gulfvoyages.ae', phone: '+971 50 987 6543', source: 'Direct Chat', interest: 'Toyota Land Cruiser 4x4 + Guide (5 Days)', value: 1200, stage: 'quoted', createdAt: 'Yesterday' },
  { id: 'lead-4', name: 'Elena Rostova', email: 'elena.rostova@travel.ru', phone: '+995 599 123 456', source: 'AI Receptionist', interest: 'Panoramic Suite Vera (3 nights)', value: 840, stage: 'booked', createdAt: '2 days ago' },
  { id: 'lead-5', name: 'Markus Lindholm', email: 'markus@nordic-trek.fi', phone: '+358 40 123 4567', source: 'Airbnb Migration', interest: 'Svaneti Tower Guesthouse (4 guests)', value: 680, stage: 'completed', createdAt: '4 days ago' },
];

export default function BusinessDashboard() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<BusinessModule>('home');
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [newLeadModal, setNewLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: '', email: '', phone: '', interest: '', value: '350' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // AI Receptionist Chat Simulator State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'guest' | 'ai'; text: string; time: string }>>([
    { sender: 'guest', text: 'Hello! Does the villa have fast Wi-Fi for remote work?', time: '10:42 AM' },
    { sender: 'ai', text: 'Gamarjoba! Yes, absolutely. We have dedicated fiber-optic internet with 100 Mbps download speed and backup 4G LTE. The workspace also includes an ergonomic chair and panoramic mountain views.', time: '10:42 AM' },
    { sender: 'guest', text: 'Can we arrange an airport pickup from Tbilisi International?', time: '10:43 AM' },
    { sender: 'ai', text: 'Certainly! Our private Mercedes-Benz transfer is available 24/7 for ₾80 direct to your doorstep. Would you like me to book your flight arrival time?', time: '10:43 AM' }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Empty Slot Deal Engine State
  const [emptySlotData, setEmptySlotData] = useState({
    title: 'Rooms Hotel Kazbegi - Mountain Terrace Room',
    date: 'Tomorrow, Oct 18',
    normalPrice: 340,
    dealPrice: 195,
    slotsLeft: 2,
    published: false,
  });

  // Calendar View State
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('month');

  // AI Listing Builder State
  const [builderStep, setBuilderStep] = useState<1 | 2 | 3>(1);
  const [builderForm, setBuilderForm] = useState({
    title: '',
    category: 'hotels',
    type: 'Boutique Stay',
    price_per_night: '240',
    price_unit: 'night',
    location: 'Tbilisi, Vera district',
    city: 'Tbilisi',
    description: '',
    amenities: 'WiFi, Mountain view, Wine bar, Air conditioning, Free parking',
    guests: '4',
    beds: '2',
    baths: '1',
    images: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop',
  });
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [builderPublishSuccess, setBuilderPublishSuccess] = useState(false);

  // Revenue Leak State
  const [resolvedLeaks, setResolvedLeaks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          setUser(authData.user);
        } else {
          // Demo Business Partner fallback
          setUser({ name: 'Giga (Rooms Kazbegi Host)', email: 'giga@kazbegi-hospitality.ge', role: 'business', businessName: 'Kazbegi Hospitality Group' });
        }

        // Fetch host listings from MongoDB
        const listRes = await fetch('/api/listings?mine=true');
        if (listRes.ok) {
          const listData = await listRes.json();
          setListings(listData.listings || []);
        }

        // Fetch bookings
        const bookRes = await fetch('/api/bookings');
        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBookings(Array.isArray(bookData) ? bookData : []);
        }
      } catch (err) {
        console.error('Error loading business suite:', err);
        setUser({ name: 'Giga Host', role: 'business' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  // AI Chat Simulation handler
  const handleSendGuestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newMsg = { sender: 'guest' as const, text: userChatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    const promptText = userChatInput.trim();
    setUserChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = "Madloba for asking! Our property is fully equipped with high-speed WiFi, traditional Georgian breakfast, and 24/7 host assistance. We're happy to tailor your stay!";
      const lower = promptText.toLowerCase();
      if (lower.includes('check') || lower.includes('in') || lower.includes('time')) {
        reply = 'Standard check-in is at 14:00 and check-out is at 12:00. Early check-in and luggage storage can be accommodated with prior notice!';
      } else if (lower.includes('wine') || lower.includes('cellar') || lower.includes('tasting')) {
        reply = 'Yes! We have an authentic underground qvevri wine cellar offering natural Rkatsiteli and Saperavi amber wines. Complimentary tastings are included for our guests.';
      } else if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat')) {
        reply = 'We are proud to be pet-friendly! Well-behaved pets are welcome with a small cleaning deposit of ₾30.';
      } else if (lower.includes('car') || lower.includes('4x4') || lower.includes('transfer')) {
        reply = 'We can provide a high-clearance Toyota Land Cruiser 4x4 with GPS and full mountain insurance for ₾180/day, or private airport transfer for ₾80.';
      }

      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsAiTyping(false);
    }, 1000);
  };

  // 1-Click AI Listing Generator
  const handleGenerateAiListing = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setBuilderForm(prev => ({
        ...prev,
        title: prev.title || 'Authentic Caucasus View Residence & Qvevri Cellar',
        description: `Experience the warmth of true Georgian hospitality in this masterfully crafted ${prev.type.toLowerCase()}. Nestled in ${prev.location}, this sanctuary boasts dramatic mountain panoramas, curated mid-century Georgian cedar furnishings, high-speed fiber internet, and direct access to local vineyards and hiking trails. Every evening, enjoy authentic local wine tastings by the stone fireplace.`,
        amenities: 'High-speed WiFi (100Mbps), Panoramic mountain deck, Traditional stone fireplace, Qvevri wine cellar, Heated floors, Free private parking, Farm-to-table breakfast',
      }));
      setIsGeneratingAi(false);
      setBuilderStep(2);
    }, 900);
  };

  // Publish to MongoDB
  const handlePublishListing = async () => {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: builderForm.title,
          description: builderForm.description,
          category: builderForm.category,
          type: builderForm.type,
          price_per_night: builderForm.price_per_night,
          price_unit: builderForm.price_unit,
          location: builderForm.location,
          city: builderForm.city,
          amenities: builderForm.amenities,
          guests: builderForm.guests,
          beds: builderForm.beds,
          baths: builderForm.baths,
          images: [builderForm.images],
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setListings(prev => [created.listing, ...prev]);
        setBuilderPublishSuccess(true);
        setTimeout(() => {
          setBuilderPublishSuccess(false);
          setActiveModule('home');
        }, 2000);
      } else {
        alert('Failed to save listing to MongoDB');
      }
    } catch {
      alert('Error saving listing');
    }
  };

  const handleAdvanceLead = (leadId: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;
      const stages: Lead['stage'][] = ['new', 'contacted', 'quoted', 'booked', 'completed'];
      const currentIndex = stages.indexOf(lead.stage);
      const nextStage = stages[Math.min(stages.length - 1, currentIndex + 1)];
      return { ...lead, stage: nextStage };
    }));
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newL: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadForm.name || 'Walk-in Traveler',
      email: newLeadForm.email || 'traveler@guest.com',
      phone: newLeadForm.phone || '+995 555 000 111',
      source: 'Direct Phone / Walk-in',
      interest: newLeadForm.interest || 'Stay Reservation',
      value: parseFloat(newLeadForm.value) || 250,
      stage: 'new',
      createdAt: 'Just now',
    };
    setLeads(prev => [newL, ...prev]);
    setNewLeadModal(false);
    setNewLeadForm({ name: '', email: '', phone: '', interest: '', value: '350' });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#94a3b8',
        gap: '16px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '3px solid rgba(217, 101, 59, 0.25)',
          borderTopColor: '#d9653b',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '14px', fontWeight: 600 }}>Loading KAYA Business Suite...</span>
      </div>
    );
  }

  // Bespoke Vector SVG Icons for 9 Modules
  const modulesList = [
    {
      id: 'home',
      label: 'Dashboard Home',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    {
      id: 'receptionist',
      label: 'AI Receptionist',
      badge: 'Live',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8.01" y2="16" />
          <line x1="16" y1="16" x2="16.01" y2="16" />
        </svg>
      )
    },
    {
      id: 'demand',
      label: 'Demand Radar',
      badge: '+42%',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
          <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'empty-slot',
      label: 'Empty Slot Deals',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      )
    },
    {
      id: 'crm',
      label: 'CRM Leads Kanban',
      badge: `${leads.length}`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'calendar',
      label: 'Operations Calendar',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: 'listing-builder',
      label: 'AI Listing Builder',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 4V2m0 16v-2m8-6h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m0-14.14l1.41 1.41m11.32 11.32l1.41 1.41" />
          <polygon points="12 8 13.5 10.5 16 12 13.5 13.5 12 16 10.5 13.5 8 12 10.5 10.5 12 8" />
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Revenue Leak Detector',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      id: 'subscription',
      label: 'Subscription & Plan',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
  ];

  return (
    <div style={{ backgroundColor: '#0B132B', color: '#ffffff', minHeight: '100vh', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
      <DashboardHeader activeRole="business" user={user} />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* Left Navigation Sidebar */}
      <aside className="business-sidebar" style={{
        width: '270px',
        background: '#0B132B',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40,
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d9653b', boxShadow: '0 0 10px #d9653b' }}></span>
            <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '21px', fontWeight: 800, color: '#ffffff' }}>
              kaya<span style={{ color: '#d9653b' }}>.biz</span>
            </span>
          </Link>
          <span style={{ fontSize: '11px', background: 'rgba(217, 101, 59, 0.18)', color: '#fb923c', padding: '3px 8px', borderRadius: '999px', fontWeight: 700, letterSpacing: '0.04em' }}>
            PRO SUITE
          </span>
        </div>

        {/* Host Profile Info */}
        <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #d9653b, #f59e0b)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: '15px' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'H'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#ffffff' }}>
              {user?.name || 'Verified Host'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {user?.email || 'host@kaya.ge'}
            </div>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {modulesList.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id as BusinessModule)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #d9653b, #be4f27)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: isActive ? '#ffffff' : '#94a3b8', display: 'grid', placeItems: 'center' }}>
                    {m.icon}
                  </span>
                  <span>{m.label}</span>
                </div>
                {m.badge && (
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(217,101,59,0.18)',
                    color: isActive ? '#ffffff' : '#fb923c',
                    fontWeight: 700,
                  }}>
                    {m.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Shortcuts */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            &larr; Switch to Tourist Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Business Suite Workspace */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', minHeight: '100vh', background: '#090d16' }}>
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mobile-menu-btn" style={{ display: 'none', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', color: '#ffffff' }}>
                {modulesList.find(m => m.id === activeModule)?.label}
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                KAYA Georgia Business Operations Center &bull; Real-Time Platform Synchronization
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Live Weather Widget with Vector SVGs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#cbd5e1'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                Tbilisi 19°C
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
                Kazbegi 8°C
              </span>
            </div>

            <button
              onClick={() => setActiveModule('listing-builder')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #d9653b, #be4f27)',
                color: '#fff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(217, 101, 59, 0.35)',
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Property / Tour / Car
            </button>
          </div>
        </div>

        {/* MODULE 1: BUSINESS DASHBOARD HOME */}
        {activeModule === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 4 Quick Stat KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Monthly Revenue</span>
                <div style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>₾4,820</div>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>+18.4% vs last month</span>
              </div>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Active Bookings</span>
                <div style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>{bookings.length > 0 ? bookings.length : 14}</div>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>4 upcoming this week</span>
              </div>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>AI Receptionist Inquiries</span>
                <div style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>86</div>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>94% resolved automatically</span>
              </div>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Platform Listings</span>
                <div style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>{listings.length > 0 ? listings.length : 18}</div>
                <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: 700 }}>100% synchronized in MongoDB</span>
              </div>
            </div>

            {/* AI Assistant Banner & Demand Signal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
              <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1e293b 100%)', borderRadius: '20px', padding: '24px 28px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(217, 101, 59, 0.25)', color: '#fb923c', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
                    <span>●</span> KLARA AI ACTIVE 24/7
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px' }}>Your AI Receptionist is handling inquiries in 4 languages</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                    Klara automatically answers guest questions about check-in, Wi-Fi, mountain excursions, and dining reservations in English, Georgian, Russian, and Arabic.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    onClick={() => setActiveModule('receptionist')}
                    style={{ padding: '10px 18px', borderRadius: '999px', background: '#d9653b', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Open Live Chat Simulator &rarr;
                  </button>
                  <button
                    onClick={() => setActiveModule('demand')}
                    style={{ padding: '10px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View Demand Radar
                  </button>
                </div>
              </div>

              {/* Demand Quick Alert */}
              <div style={{ background: '#0d1322', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#d9653b" strokeWidth="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>
                    Georgia Demand Radar
                  </span>
                  <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>HIGH DEMAND</span>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Kazbegi chalets and Kakheti wine tours are seeing a <strong style={{ color: '#ffffff' }}>+42% search surge</strong> for this upcoming weekend.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '12px' }}>
                    <span>Stepantsminda / Kazbegi</span>
                    <strong style={{ color: '#22c55e' }}>+48% searches</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '12px' }}>
                    <span>Kakheti Wine Country</span>
                    <strong style={{ color: '#22c55e' }}>+35% searches</strong>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModule('empty-slot')}
                  style={{ width: '100%', marginTop: '16px', padding: '10px', borderRadius: '10px', border: '1px dashed #d9653b', background: 'rgba(217, 101, 59, 0.1)', color: '#fb923c', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Publish Last-Minute Deal &amp; Turn Empty Slots to Revenue
                </button>
              </div>
            </div>

            {/* Upcoming Bookings Table */}
            <div style={{ background: '#0d1322', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>Recent &amp; Upcoming Bookings</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Connected directly to MongoDB</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '10px 14px' }}>Listing</th>
                      <th style={{ padding: '10px 14px' }}>Guest</th>
                      <th style={{ padding: '10px 14px' }}>Dates</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                      <th style={{ padding: '10px 14px' }}>Total</th>
                      <th style={{ padding: '10px 14px' }}>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b: any, idx) => (
                      <tr key={b._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#ffffff' }}>
                          {b.listing_title || 'Georgian Stay / Experience'}
                        </td>
                        <td style={{ padding: '14px', color: '#cbd5e1' }}>
                          {b.user_name || b.tourist_name || 'Elena Traveler'}
                        </td>
                        <td style={{ padding: '14px', color: '#94a3b8', fontSize: '12px' }}>
                          {b.check_in} &rarr; {b.check_out}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: b.status === 'confirmed' || b.status === 'CONFIRMED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: b.status === 'confirmed' || b.status === 'CONFIRMED' ? '#22c55e' : '#f59e0b',
                          }}>
                            {b.status?.toUpperCase() || 'CONFIRMED'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontWeight: 800, color: '#ffffff' }}>
                          ₾{b.total_price || 420} GEL
                        </td>
                        <td style={{ padding: '14px', color: '#94a3b8', fontSize: '12px' }}>
                          {b.payment_method === 'card' ? 'Online Card' : 'Cash on Arrival'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: AI RECEPTIONIST & SIMULATOR */}
        {activeModule === 'receptionist' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Live Chat Simulator */}
            <div style={{ background: '#0d1322', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', height: '620px' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></span>
                  <strong style={{ fontSize: '15px', color: '#ffffff' }}>Live Receptionist Simulator</strong>
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Try asking guest questions below</span>
              </div>

              {/* Chat messages */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.01)' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.sender === 'guest' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'guest' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.sender === 'guest' ? '#d9653b' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      border: msg.sender === 'guest' ? 'none' : '1px solid rgba(255,255,255,0.08)'
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px', textAlign: msg.sender === 'guest' ? 'right' : 'left' }}>
                      {msg.time}
                    </span>
                  </div>
                ))}
                {isAiTyping && (
                  <div style={{ alignSelf: 'flex-start', padding: '10px 16px', borderRadius: '18px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '12px' }}>
                    Klara is drafting response...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendGuestMessage} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Test a question: 'Is breakfast included?', 'Can we check in early?'"
                  value={userChatInput}
                  onChange={e => setUserChatInput(e.target.value)}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none', fontSize: '13px' }}
                />
                <button type="submit" style={{ padding: '12px 22px', borderRadius: '999px', background: '#d9653b', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                  Send
                </button>
              </form>
            </div>

            {/* AI Receptionist Settings & Knowledge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#0d1322', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 14px', color: '#ffffff' }}>AI Persona &amp; Capabilities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>Multilingual Auto-Translation</span>
                    <strong style={{ color: '#22c55e' }}>EN, KA, RU, AR Active</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>Instant Price &amp; Quote Estimator</span>
                    <strong style={{ color: '#22c55e' }}>Enabled</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>Emergency Escalation to Host Phone</span>
                    <strong style={{ color: '#fb923c' }}>SMS + WhatsApp</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                    <span>Operating Hours</span>
                    <strong style={{ color: '#ffffff' }}>24 Hours / 7 Days</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#0d1322', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px', color: '#ffffff' }}>Knowledge Base Rules</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px' }}>
                  Quick toggles configured for all your Georgian listings:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    ✓ <strong>Wi-Fi credentials:</strong> Auto-shared 2 hours before arrival
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    ✓ <strong>Airport pickup:</strong> Offered automatically to international arrivals
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    ✓ <strong>Wine tasting:</strong> Complimentary 18:00–20:00 every evening
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: DEMAND RADAR & MAP */}
        {activeModule === 'demand' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#0d1322', borderRadius: '24px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Georgia Real-Time Demand Radar</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Live search frequency and traveler inquiries across Sakartvelo</p>
                </div>
                <span style={{ fontSize: '12px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '6px 14px', borderRadius: '999px', fontWeight: 700 }}>
                  Radar Status: Live Scanning
                </span>
              </div>

              {/* Interactive Visual Georgia Map */}
              <div style={{
                height: '280px',
                background: 'radial-gradient(ellipse at 40% 50%, #1e293b 0%, #0a0f1d 100%)',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%', opacity: 0.35 }}>
                  <path d="M 120 180 Q 200 120 350 140 T 520 160 T 680 180 Q 750 240 700 300 T 480 320 T 260 300 Z" fill="#334155" />
                </svg>

                {/* Hotspot Beacons */}
                <div style={{ position: 'absolute', top: '48%', left: '52%', textAlign: 'center' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#d9653b', boxShadow: '0 0 20px #d9653b', margin: '0 auto' }}></div>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, textShadow: '0 1px 4px #000' }}>Tbilisi (High 88%)</span>
                </div>

                <div style={{ position: 'absolute', top: '32%', left: '50%', textAlign: 'center' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 16px #f59e0b', margin: '0 auto' }}></div>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, textShadow: '0 1px 4px #000' }}>Kazbegi (+48%)</span>
                </div>

                <div style={{ position: 'absolute', top: '65%', left: '22%', textAlign: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 14px #38bdf8', margin: '0 auto' }}></div>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, textShadow: '0 1px 4px #000' }}>Batumi (72%)</span>
                </div>

                <div style={{ position: 'absolute', top: '42%', left: '68%', textAlign: 'center' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 16px #a855f7', margin: '0 auto' }}></div>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, textShadow: '0 1px 4px #000' }}>Kakheti (+35%)</span>
                </div>
              </div>

              {/* Opportunity Cards */}
              <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Actionable Demand Opportunities</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: 800 }}>HOT OPPORTUNITY #1</span>
                  <h5 style={{ margin: '6px 0 6px', fontSize: '14px', color: '#ffffff' }}>Kazbegi 4WD Vehicles</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px' }}>18 travelers currently searching for off-road rentals for Saturday morning.</p>
                  <button onClick={() => setActiveModule('empty-slot')} style={{ padding: '8px 14px', borderRadius: '8px', background: '#d9653b', color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    Open Availability
                  </button>
                </div>

                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 800 }}>HOT OPPORTUNITY #2</span>
                  <h5 style={{ margin: '6px 0 6px', fontSize: '14px', color: '#ffffff' }}>Kakheti Wine Supra</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px' }}>Two European tourist groups requested a private Tamada toastmaster feast.</p>
                  <button onClick={() => setActiveModule('crm')} style={{ padding: '8px 14px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    View CRM Leads
                  </button>
                </div>

                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 800 }}>HOT OPPORTUNITY #3</span>
                  <h5 style={{ margin: '6px 0 6px', fontSize: '14px', color: '#ffffff' }}>Tbilisi Vera Apartments</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px' }}>Digital nomads booking 14+ night stays with 100Mbps Wi-Fi.</p>
                  <button onClick={() => setActiveModule('listing-builder')} style={{ padding: '8px 14px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    Add Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 4: EMPTY SLOT / LAST MINUTE DEAL ENGINE */}
        {activeModule === 'empty-slot' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div style={{ background: '#0d1322', borderRadius: '24px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: 800, textTransform: 'uppercase' }}>Last Minute Deal Engine</span>
                <h3 style={{ margin: '4px 0 6px', fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Sell Empty Slots: Turn Unused Capacity into Revenue</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  Automatically broadcast discounted flash deals to high-intent travelers currently browsing Kaya.ge.
                </p>
              </div>

              <form onSubmit={e => { e.preventDefault(); setEmptySlotData(p => ({ ...p, published: true })); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>Select Listing / Tour / Car</label>
                  <select
                    value={emptySlotData.title}
                    onChange={e => setEmptySlotData(p => ({ ...p, title: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="Rooms Hotel Kazbegi - Mountain Terrace Room" style={{ background: '#0d1322' }}>Rooms Hotel Kazbegi - Mountain Terrace Room</option>
                    <option value="Toyota Land Cruiser Prado 4x4 Expedition" style={{ background: '#0d1322' }}>Toyota Land Cruiser Prado 4x4 Expedition</option>
                    <option value="Kakheti 8,000-Vintage Qvevri Wine Trail" style={{ background: '#0d1322' }}>Kakheti 8,000-Vintage Qvevri Wine Trail</option>
                    <option value="Sololaki Heritage High-Ceiling Art Flat" style={{ background: '#0d1322' }}>Sololaki Heritage High-Ceiling Art Flat</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>Normal Price (₾)</label>
                    <input
                      type="number"
                      value={emptySlotData.normalPrice}
                      onChange={e => setEmptySlotData(p => ({ ...p, normalPrice: Number(e.target.value) }))}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>Flash Deal Price (₾)</label>
                    <input
                      type="number"
                      value={emptySlotData.dealPrice}
                      onChange={e => setEmptySlotData(p => ({ ...p, dealPrice: Number(e.target.value) }))}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fb923c', fontSize: '13px', fontWeight: 800 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>Slots / Seats Left</label>
                    <input
                      type="number"
                      value={emptySlotData.slotsLeft}
                      onChange={e => setEmptySlotData(p => ({ ...p, slotsLeft: Number(e.target.value) }))}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>Expires In</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px' }}>
                      <option style={{ background: '#0d1322' }}>Tonight at 23:59</option>
                      <option style={{ background: '#0d1322' }}>In 24 hours</option>
                      <option style={{ background: '#0d1322' }}>In 48 hours</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #d9653b, #be4f27)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 4px 14px rgba(217,101,59,0.3)'
                  }}
                >
                  Publish Empty Slot Deal Now
                </button>
              </form>
            </div>

            {/* Live Card Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>LIVE VISITOR PREVIEW BADGE</span>
              <div style={{ background: '#0d1322', borderRadius: '24px', overflow: 'hidden', border: '2px solid #d9653b', boxShadow: '0 12px 32px rgba(217,101,59,0.2)' }}>
                <div style={{ position: 'relative', height: '180px', background: 'url(https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&fit=crop) 50%/cover' }}>
                  <span style={{ position: 'absolute', top: '14px', left: '14px', background: '#dc2626', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                    LAST {emptySlotData.slotsLeft} SEATS!
                  </span>
                  <span style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', color: '#ffffff', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                    {Math.round((1 - emptySlotData.dealPrice / emptySlotData.normalPrice) * 100)}% OFF
                  </span>
                </div>
                <div style={{ padding: '20px' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#ffffff' }}>{emptySlotData.title}</h4>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>Valid for: {emptySlotData.date}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '13px', marginRight: '8px' }}>₾{emptySlotData.normalPrice}</span>
                      <strong style={{ fontSize: '20px', color: '#fb923c' }}>₾{emptySlotData.dealPrice} GEL</strong>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                      Fast-Selling
                    </span>
                  </div>
                </div>
              </div>

              {emptySlotData.published && (
                <div style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '13px', fontWeight: 700, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  ✓ Deal published! Pushed to homepage banner and Offers directory.
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODULE 5: CRM (LEADS & CUSTOMERS KANBAN) */}
        {activeModule === 'crm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Guest Inquiry Pipeline &amp; CRM</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Track leads from discovery to check-out across all channels</p>
              </div>
              <button
                onClick={() => setNewLeadModal(true)}
                style={{ padding: '10px 18px', borderRadius: '999px', background: '#d9653b', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                + Add New Lead
              </button>
            </div>

            {/* Kanban Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              {(['new', 'contacted', 'quoted', 'booked', 'completed'] as const).map(stageKey => {
                const stageLeads = leads.filter(l => l.stage === stageKey);
                const stageTitles: Record<string, string> = {
                  new: 'New Inquiries',
                  contacted: 'Contacted',
                  quoted: 'Quote Sent',
                  booked: 'Booked & Paid',
                  completed: 'Completed',
                };
                return (
                  <div key={stageKey} style={{ background: '#0d1322', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8' }}>{stageTitles[stageKey]}</strong>
                      <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '999px', fontWeight: 800, color: '#ffffff' }}>{stageLeads.length}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {stageLeads.map(lead => (
                        <div key={lead.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '13px', color: '#ffffff' }}>{lead.name}</strong>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#4ade80' }}>₾{lead.value}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 8px' }}>{lead.interest}</p>
                          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>{lead.phone}</div>
                          {stageKey !== 'completed' && (
                            <button
                              onClick={() => handleAdvanceLead(lead.id)}
                              style={{ width: '100%', padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#cbd5e1' }}
                            >
                              Advance Stage &rarr;
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal to add lead */}
            {newLeadModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                <div style={{ background: '#0d1322', borderRadius: '20px', padding: '28px', maxWidth: '420px', width: '100%', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#ffffff' }}>Add New Lead</h3>
                  <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Lead Name" required value={newLeadForm.name} onChange={e => setNewLeadForm(p => ({ ...p, name: e.target.value }))} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
                    <input type="email" placeholder="Email" value={newLeadForm.email} onChange={e => setNewLeadForm(p => ({ ...p, email: e.target.value }))} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
                    <input type="tel" placeholder="Phone" value={newLeadForm.phone} onChange={e => setNewLeadForm(p => ({ ...p, phone: e.target.value }))} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
                    <input type="text" placeholder="Interest (e.g. Kazbegi Tour)" value={newLeadForm.interest} onChange={e => setNewLeadForm(p => ({ ...p, interest: e.target.value }))} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
                    <input type="number" placeholder="Estimated Value (₾)" value={newLeadForm.value} onChange={e => setNewLeadForm(p => ({ ...p, value: e.target.value }))} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <button type="button" onClick={() => setNewLeadModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#cbd5e1' }}>Cancel</button>
                      <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '999px', background: '#d9653b', color: '#fff', border: 'none', fontWeight: 700 }}>Save Lead</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODULE 6: OPERATIONS & CALENDAR */}
        {activeModule === 'calendar' && (
          <div style={{ background: '#0d1322', borderRadius: '24px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Operations &amp; Turnaround Calendar</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Manage check-ins, key handovers, cleaning slots, and vehicle dispatches</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['day', 'week', 'month'] as const).map(view => (
                  <button
                    key={view}
                    onClick={() => setCalendarView(view)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: calendarView === view ? '#d9653b' : 'rgba(255,255,255,0.04)',
                      color: calendarView === view ? '#fff' : '#94a3b8',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid Representation (October 2026) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ textAlign: 'center', fontWeight: 800, fontSize: '12px', color: '#64748b', padding: '8px' }}>
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(dateNum => {
                const isBooked = [14, 15, 16, 17, 18, 23, 24, 25, 29, 30].includes(dateNum);
                const isDeal = [19, 20].includes(dateNum);
                return (
                  <div
                    key={dateNum}
                    style={{
                      minHeight: '80px',
                      background: isBooked ? 'rgba(34, 197, 94, 0.08)' : isDeal ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      padding: '8px',
                      border: isBooked ? '1px solid rgba(34, 197, 94, 0.25)' : isDeal ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
                      <span style={{ color: '#ffffff' }}>{dateNum}</span>
                      {isBooked && <span style={{ color: '#4ade80' }}>● Booked</span>}
                      {isDeal && <span style={{ color: '#fb923c' }}>Flash Deal</span>}
                    </div>
                    {isBooked && (
                      <div style={{ fontSize: '10px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '3px 6px', borderRadius: '6px', fontWeight: 600 }}>
                        Kazbegi Check-in
                      </div>
                    )}
                    {isDeal && (
                      <div style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fb923c', padding: '3px 6px', borderRadius: '6px', fontWeight: 600 }}>
                        Empty Slot (-40%)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODULE 7: AI LISTING BUILDER (3-STEP WIZARD) */}
        {activeModule === 'listing-builder' && (
          <div style={{ background: '#0d1322', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>AI Listing Builder</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Generate marketing copy, amenities &amp; publish straight to MongoDB in seconds</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
                <span style={{ padding: '6px 12px', borderRadius: '999px', background: builderStep === 1 ? '#d9653b' : 'rgba(255,255,255,0.06)', color: '#fff' }}>1. Basic Info</span>
                <span style={{ padding: '6px 12px', borderRadius: '999px', background: builderStep === 2 ? '#d9653b' : 'rgba(255,255,255,0.06)', color: '#fff' }}>2. AI Copy</span>
                <span style={{ padding: '6px 12px', borderRadius: '999px', background: builderStep === 3 ? '#d9653b' : 'rgba(255,255,255,0.06)', color: '#fff' }}>3. Publish</span>
              </div>
            </div>

            {builderPublishSuccess && (
              <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontWeight: 700, marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                ✓ Successfully Published to MongoDB! Redirecting to dashboard...
              </div>
            )}

            {/* Step 1: Basic Info */}
            {builderStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Category</label>
                    <select
                      value={builderForm.category}
                      onChange={e => setBuilderForm({ ...builderForm, category: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="hotels" style={{ background: '#0d1322' }}>Hotel / Boutique Stay</option>
                      <option value="apartments" style={{ background: '#0d1322' }}>Apartment</option>
                      <option value="houses" style={{ background: '#0d1322' }}>House / Mountain Chalet</option>
                      <option value="villas" style={{ background: '#0d1322' }}>Villa</option>
                      <option value="cars" style={{ background: '#0d1322' }}>4x4 Car Rental / Fleet</option>
                      <option value="tours" style={{ background: '#0d1322' }}>Wine / Mountain Tour</option>
                      <option value="restaurants" style={{ background: '#0d1322' }}>Restaurant / Georgian Table</option>
                      <option value="salons" style={{ background: '#0d1322' }}>Salon / Spa</option>
                      <option value="services" style={{ background: '#0d1322' }}>Service / Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Listing Name / Draft Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Kazbegi Valley Guesthouse"
                      value={builderForm.title}
                      onChange={e => setBuilderForm({ ...builderForm, title: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Price per Night / Day (GEL)</label>
                    <input
                      type="number"
                      placeholder="240"
                      value={builderForm.price_per_night}
                      onChange={e => setBuilderForm({ ...builderForm, price_per_night: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Location / City</label>
                    <input
                      type="text"
                      placeholder="Stepantsminda, Kazbegi"
                      value={builderForm.location}
                      onChange={e => setBuilderForm({ ...builderForm, location: e.target.value, city: e.target.value.split(',')[0].trim() })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiListing}
                  disabled={isGeneratingAi}
                  style={{
                    padding: '14px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #d9653b, #be4f27)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: isGeneratingAi ? 'not-allowed' : 'pointer',
                    marginTop: '10px',
                    boxShadow: '0 4px 14px rgba(217,101,59,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {isGeneratingAi ? 'Generating Caucasian Hospitality Copy...' : 'Generate with 1-Click AI'}
                </button>
              </div>
            )}

            {/* Step 2: AI Copy Review */}
            {builderStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>AI-Generated Title</label>
                  <input
                    type="text"
                    value={builderForm.title}
                    onChange={e => setBuilderForm({ ...builderForm, title: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>AI-Generated Description &amp; Story</label>
                  <textarea
                    rows={5}
                    value={builderForm.description}
                    onChange={e => setBuilderForm({ ...builderForm, description: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Amenities &amp; Features</label>
                  <input
                    type="text"
                    value={builderForm.amenities}
                    onChange={e => setBuilderForm({ ...builderForm, amenities: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button onClick={() => setBuilderStep(1)} style={{ flex: 1, padding: '12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}>
                    &larr; Back
                  </button>
                  <button onClick={() => setBuilderStep(3)} style={{ flex: 2, padding: '12px', borderRadius: '999px', background: '#d9653b', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    Continue to Photo &amp; Publish &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Photo & Publish */}
            {builderStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Cover Image URL</label>
                  <input
                    type="url"
                    value={builderForm.images}
                    onChange={e => setBuilderForm({ ...builderForm, images: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                {/* Preview Image */}
                <div style={{ height: '220px', borderRadius: '16px', background: `url(${builderForm.images}) 50%/cover`, border: '1px solid rgba(255,255,255,0.1)' }}></div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button onClick={() => setBuilderStep(2)} style={{ flex: 1, padding: '12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}>
                    &larr; Back
                  </button>
                  <button onClick={handlePublishListing} style={{ flex: 2, padding: '12px', borderRadius: '999px', background: '#16a34a', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(22,163,74,0.35)' }}>
                    Publish Live to MongoDB
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODULE 8: ANALYTICS & REVENUE LEAK DETECTOR */}
        {activeModule === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Conversion Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Conversion Rate</span>
                <div style={{ fontSize: '26px', fontWeight: 800, margin: '6px 0', color: '#ffffff' }}>4.8%</div>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>+0.6% vs Tbilisi average</span>
              </div>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Average Daily Rate</span>
                <div style={{ fontSize: '26px', fontWeight: 800, margin: '6px 0', color: '#ffffff' }}>₾245</div>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>+12% premium</span>
              </div>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Occupancy Rate</span>
                <div style={{ fontSize: '26px', fontWeight: 800, margin: '6px 0', color: '#ffffff' }}>82%</div>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>Peak season level</span>
              </div>
              <div style={{ background: '#0d1322', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>RevPAR</span>
                <div style={{ fontSize: '26px', fontWeight: 800, margin: '6px 0', color: '#ffffff' }}>₾201</div>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>Top 5% in Georgia</span>
              </div>
            </div>

            {/* Revenue Leak Detector Cards */}
            <div style={{ background: '#0d1322', borderRadius: '24px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Revenue Leak Detector
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>AI-identified lost revenue opportunities with instant 1-click fixes</p>
                </div>
                <span style={{ fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '4px 12px', borderRadius: '999px', fontWeight: 700 }}>
                  Potential: +₾1,480/mo
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    id: 'leak-1',
                    title: 'Unpriced Weekend Slots in November',
                    desc: 'You have 4 weekend nights in November without pricing rules. Surging autumn wine travelers cannot book.',
                    impact: '+₾720 Potential',
                    action: 'Apply Dynamic ₾260/night',
                  },
                  {
                    id: 'leak-2',
                    title: 'Slow Response Time After 22:00 (Tbilisi Time)',
                    desc: '12 European inquiries arrived between 22:00 and 02:00 without instant host response, reducing checkout conversion.',
                    impact: '+₾460 Potential',
                    action: 'Activate 24/7 AI Receptionist Autoreply',
                  },
                  {
                    id: 'leak-3',
                    title: 'Missing Airport Transfer Add-on Option',
                    desc: '42% of guests booking your listings ask for Tbilisi or Kutaisi airport transfers after reservation.',
                    impact: '+₾300 Potential',
                    action: 'Enable ₾80 Private Transfer Add-on',
                  },
                ].map(leak => {
                  const isResolved = resolvedLeaks[leak.id];
                  return (
                    <div
                      key={leak.id}
                      style={{
                        padding: '18px 22px',
                        borderRadius: '16px',
                        background: isResolved ? 'rgba(34, 197, 94, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                        border: isResolved ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '20px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '14px', color: '#ffffff' }}>{leak.title}</strong>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: isResolved ? '#4ade80' : '#fb923c', background: isResolved ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                            {isResolved ? '✓ Fixed' : leak.impact}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{leak.desc}</p>
                      </div>

                      <button
                        onClick={() => setResolvedLeaks(p => ({ ...p, [leak.id]: true }))}
                        disabled={isResolved}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '999px',
                          background: isResolved ? '#16a34a' : '#d9653b',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: isResolved ? 'default' : 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isResolved ? '✓ Resolved' : leak.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 9: SUBSCRIPTION & PLAN */}
        {activeModule === 'subscription' && (
          <div style={{ background: '#0d1322', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', background: 'rgba(217, 101, 59, 0.2)', color: '#fb923c', padding: '4px 10px', borderRadius: '999px', fontWeight: 800 }}>
                  CURRENT ACTIVE PLAN
                </span>
                <h3 style={{ margin: '8px 0 4px', fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>KAYA Pro Business Host</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Billed annually &bull; Renews October 2027</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>₾89</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>/month</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              {[
                'Unlimited AI Receptionist conversations in 4 languages (EN, KA, RU, AR)',
                'Real-Time Georgia Demand Radar alerts & surge insights',
                'Last-Minute Empty Slot deal distribution to homepage banner',
                'Direct booking engine with 0% platform commissions',
                'Automatic SMS & WhatsApp emergency host notifications',
                'Priority ranking in Tbilisi, Batumi, and Kazbegi search results',
              ].map((benefit, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#22c55e', fontWeight: 800 }}>✓</span>
                  <span style={{ color: '#cbd5e1' }}>{benefit}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Payout Destination: <strong style={{ color: '#ffffff' }}>TBC Bank (IBAN GE29TB...)</strong>
              </div>
              <button
                onClick={() => alert('Plan is active and fully paid for 12 months!')}
                style={{ padding: '10px 20px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Manage Billing &amp; Invoices
              </button>
            </div>
          </div>
        )}

      </main>
      </div>
    </div>
  );
}
