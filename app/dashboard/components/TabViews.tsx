'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// =========================================================================
// 1. MY LINKS MANAGER TAB
// =========================================================================
export function LinksTabView({
  customLinks,
  user,
  affiliateStats,
  onOpenCreateModal,
  onSimulateClick,
  copyToClipboard,
  copySuccess,
}: {
  customLinks: any[];
  user?: any;
  affiliateStats?: any;
  onOpenCreateModal: () => void;
  onSimulateClick: (linkId?: string) => void;
  copyToClipboard: (text: string) => void;
  copySuccess: boolean;
}) {
  const [filterRegion, setFilterRegion] = useState('All');
  const [showQrModal, setShowQrModal] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kaya.ge';
  const userRef = user?.affiliateCode || (user?.email ? user.email.split('@')[0] : 'kaya');

  // Dynamic rich links based on real user code and stats
  const defaultLinks = [
    {
      _id: 'link_1',
      title: 'Kazbegi Winter Ski & Summit Trek',
      destination: 'Kazbegi',
      url: `${origin}/kazbegi?ref=${userRef}-ski`,
      clicks: affiliateStats?.totalClicks ? Math.round(affiliateStats.totalClicks * 0.45) : 0,
      conversions: affiliateStats?.conversions ? Math.round(affiliateStats.conversions * 0.45) : 0,
      rate: `${affiliateStats?.conversionRate || 2.8}%`,
      earnings: `€${((affiliateStats?.totalEarnings || 0) * 0.45).toFixed(2)}`,
      status: 'ACTIVE',
    },
    {
      _id: 'link_2',
      title: 'Batumi Black Sea Coastal Suites',
      destination: 'Batumi',
      url: `${origin}/batumi?ref=${userRef}-sea`,
      clicks: affiliateStats?.totalClicks ? Math.round(affiliateStats.totalClicks * 0.25) : 0,
      conversions: affiliateStats?.conversions ? Math.round(affiliateStats.conversions * 0.25) : 0,
      rate: `${affiliateStats?.conversionRate || 2.7}%`,
      earnings: `€${((affiliateStats?.totalEarnings || 0) * 0.25).toFixed(2)}`,
      status: 'ACTIVE',
    },
    {
      _id: 'link_3',
      title: 'Old Tbilisi Heritage Sulfur Spa Lofts',
      destination: 'Tbilisi',
      url: `${origin}/tbilisi?ref=${userRef}-tbilisi`,
      clicks: affiliateStats?.totalClicks ? Math.round(affiliateStats.totalClicks * 0.18) : 0,
      conversions: affiliateStats?.conversions ? Math.round(affiliateStats.conversions * 0.18) : 0,
      rate: `${affiliateStats?.conversionRate || 3.0}%`,
      earnings: `€${((affiliateStats?.totalEarnings || 0) * 0.18).toFixed(2)}`,
      status: 'ACTIVE',
    },
    {
      _id: 'link_4',
      title: 'Kakheti Ancient Qvevri Wine Harvest',
      destination: 'Kakheti',
      url: `${origin}/kakheti?ref=${userRef}-wine`,
      clicks: affiliateStats?.totalClicks ? Math.round(affiliateStats.totalClicks * 0.08) : 0,
      conversions: affiliateStats?.conversions ? Math.round(affiliateStats.conversions * 0.08) : 0,
      rate: `${affiliateStats?.conversionRate || 3.2}%`,
      earnings: `€${((affiliateStats?.totalEarnings || 0) * 0.08).toFixed(2)}`,
      status: 'ACTIVE',
    },
  ];

  const displayLinks = customLinks && customLinks.length > 0
    ? [...customLinks, ...defaultLinks.slice(customLinks.length)]
    : defaultLinks;

  const filtered = filterRegion === 'All' 
    ? displayLinks 
    : displayLinks.filter(l => l.destination?.toLowerCase() === filterRegion.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Actions Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        padding: '24px 28px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            My Affiliate & Tracking Links
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Generate custom tracked URLs for any Georgian destination, track live clicks, and earn up to 15% commissions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onSimulateClick()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              border: '1px solid #FCD34D',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Simulate Real-Time Click</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Create New Link</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Mini-Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Active Links', value: `${displayLinks.length}`, sub: 'All monitored', color: '#2563EB' },
          { label: 'Total Tracked Clicks', value: '18,342', sub: '+38 today', color: '#059669' },
          { label: 'Confirmed Bookings', value: '523', sub: '2.85% conv. rate', color: '#7C3AED' },
          { label: 'Avg. Earnings / Click', value: '€0.07', sub: 'High ROI tier', color: '#D97706' },
        ].map((item, idx) => (
          <div key={idx} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>{item.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{item.value}</div>
            <div style={{ fontSize: '11.5px', color: item.color, fontWeight: 500 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'Kazbegi', 'Batumi', 'Tbilisi', 'Kakheti', 'Svaneti'].map(reg => (
          <button
            key={reg}
            type="button"
            onClick={() => setFilterRegion(reg)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              border: filterRegion === reg ? '1px solid #2563EB' : '1px solid #E2E8F0',
              backgroundColor: filterRegion === reg ? '#EFF6FF' : '#FFFFFF',
              color: filterRegion === reg ? '#2563EB' : '#475569',
            }}
          >
            {reg === 'All' ? 'All Destinations' : reg}
          </button>
        ))}
      </div>

      {/* Links Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Campaign / Destination</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Tracking URL</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Clicks</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Bookings</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>CR %</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Earnings</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((link, idx) => (
                <tr key={link._id || idx} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>{link.title}</div>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {link.destination || 'Georgia'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', maxWidth: '280px' }}>
                    <code style={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      backgroundColor: '#F8FAFC',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      color: '#334155',
                    }}>
                      {link.url || `https://kaya.ge/${(link.destination || 'georgia').toLowerCase()}?ref=${link.customSlug || 'custom'}`}
                    </code>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                    {Number(link.clicks || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                    {link.conversions || 0}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', color: '#64748B' }}>
                    {link.rate || '2.8%'}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                    {link.earnings || '€142.50'}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(link.url || `https://kaya.ge/${(link.destination || 'georgia').toLowerCase()}?ref=${link.customSlug || 'custom'}`)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #BFDBFE',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => onSimulateClick(link._id)}
                        title="Simulate 1 Click"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#F8FAFC',
                          color: '#64748B',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowQrModal(link.url || 'https://kaya.ge')}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#F8FAFC',
                          color: '#64748B',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal Preview */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 999,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '28px',
            width: '100%',
            maxWidth: '380px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Instant QR Code
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '12.5px', color: '#64748B' }}>
              Print on travel brochures, stickers, or display on social media stories.
            </p>
            <div style={{
              display: 'inline-block',
              padding: '16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px',
            }}>
              <svg width="180" height="180" viewBox="0 0 100 100" fill="#0F172A">
                <rect width="100" height="100" fill="#FFFFFF"/>
                <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z M50 15h5v5h-5z M50 30h5v15h-5z M70 50h15v5h-15z M60 65h10v10h-10z M80 75h10v15h-10z M50 60h5v25h-5z M75 60h10v5h-10z"/>
              </svg>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowQrModal(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. ACTIVE CAMPAIGNS TAB
// =========================================================================
export function CampaignsTabView({
  user,
  onPromoteCampaign,
  copyToClipboard,
}: {
  user?: any;
  onPromoteCampaign: (campaign: any) => void;
  copyToClipboard: (text: string) => void;
}) {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kaya.ge';
  const userRef = user?.affiliateCode || (user?.email ? user.email.split('@')[0] : 'kaya');

  const campaigns = [
    {
      id: 'cmp_kazbegi',
      region: 'Kazbegi',
      title: 'Kazbegi Winter Ski & Alpine Retreat',
      rate: '14% Commission',
      avgEarning: '€44.80 per booking',
      avgBooking: '€320.00',
      period: 'Active through April 2026',
      image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&auto=format&fit=crop&q=80',
      description: 'Exclusive mountain chalets, Gergeti Trinity guided snowshoe hikes, and Gudauri heli-skiing packages.',
      features: ['Gergeti Chalets', 'Gudauri Heli-Ski', '4x4 Transfers', 'Instant 14%'],
      targetUrl: `${origin}/hotels?city=kazbegi&ref=${userRef}&campaign=alpine-winter`,
    },
    {
      id: 'cmp_batumi',
      region: 'Batumi',
      title: 'Batumi Black Sea Luxury Suites',
      rate: '12% Commission',
      avgEarning: '€54.00 per booking',
      avgBooking: '€450.00',
      period: 'Active Spring & Summer 2026',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop&q=80',
      description: 'High-end seaside penthouses on Batumi Boulevard, private Black Sea yacht charters, and sunset rooftop dining.',
      features: ['Seafront Penthouses', 'Private Yacht Charters', 'Casino Resorts'],
      targetUrl: `${origin}/hotels?city=batumi&ref=${userRef}&campaign=coastal-luxury`,
    },
    {
      id: 'cmp_kakheti',
      region: 'Kakheti',
      title: 'Kakheti Ancient Qvevri Wine Harvest',
      rate: '15% Commission (Highest Tier)',
      avgEarning: '€42.00 per booking',
      avgBooking: '€280.00',
      period: 'Year-Round Active',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=80',
      description: '8,000-year-old Georgian winemaking châteaux, Sighnaghi cobblestone boutique stays, and masterclass feasts.',
      features: ['Château Stays', 'Qvevri Tastings', 'Sighnaghi City of Love'],
      targetUrl: `${origin}/georgian-table?ref=${userRef}&campaign=wine-harvest`,
    },
    {
      id: 'cmp_svaneti',
      region: 'Svaneti',
      title: 'Svaneti UNESCO Watchtower Odyssey',
      rate: '10% Commission',
      avgEarning: '€19.00 per booking',
      avgBooking: '€190.00',
      period: 'Active through October 2026',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
      description: 'Medieval stone defensive towers in Mestia and Ushguli, Shkhara glacier expeditions, and authentic mountain homestays.',
      features: ['Mestia Towers', 'Ushguli Highest Village', 'Glacier Guides'],
      targetUrl: 'https://kaya.ge/svaneti?campaign=svaneti-towers',
    },
    {
      id: 'cmp_tbilisi',
      region: 'Tbilisi',
      title: 'Old Tbilisi Heritage Sulfur Baths & Lofts',
      rate: '11% Commission',
      avgEarning: '€23.10 per booking',
      avgBooking: '€210.00',
      period: 'Year-Round Active',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=80',
      description: 'Abanotubani sulfur baths, Narikala fortress lofts, bohemian Vera cafe crawls, and design boutique hotels.',
      features: ['Sulfur Baths', 'Narikala Fortress', 'Bohemian Vera Lofts'],
      targetUrl: 'https://kaya.ge/tbilisi?campaign=old-tbilisi',
    },
    {
      id: 'cmp_martvili',
      region: 'Kutaisi',
      title: 'Martvili Canyon & Prometheus Caves Safari',
      rate: '13% Commission',
      avgEarning: '€22.75 per booking',
      avgBooking: '€175.00',
      period: 'Year-Round Active',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      description: 'Emerald canyon boat rafting, ancient stalactite caverns in Prometheus, and UNESCO Bagrati Cathedral stays.',
      features: ['Emerald Canyons', 'Prometheus Cave', 'Imeretian Wine Feasts'],
      targetUrl: 'https://kaya.ge/kutaisi?campaign=canyon-safari',
    },
  ];

  const filtered = selectedRegion === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.region.toLowerCase() === selectedRegion.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '24px 28px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
          Active Georgian Campaigns & Commission Boosters
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
          Join official regional campaigns curated by KAYA. Enjoy elevated commissions (up to 15%) and pre-approved media assets.
        </p>

        {/* Region Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {['All', 'Kazbegi', 'Batumi', 'Kakheti', 'Svaneti', 'Tbilisi', 'Kutaisi'].map(reg => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedRegion === reg ? '1px solid #2563EB' : '1px solid #E2E8F0',
                backgroundColor: selectedRegion === reg ? '#EFF6FF' : '#FFFFFF',
                color: selectedRegion === reg ? '#2563EB' : '#475569',
              }}
            >
              {reg === 'All' ? 'All Regions' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map(cmp => (
          <div key={cmp.id} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Image Banner with Badge */}
            <div style={{
              height: '160px',
              backgroundImage: `url(${cmp.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
              
              <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                  {cmp.rate}
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>{cmp.region}, Georgia</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{cmp.title}</div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                {cmp.description}
              </p>

              {/* Stats Box */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Avg. Earning</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#059669' }}>{cmp.avgEarning}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Avg. Booking</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>{cmp.avgBooking}</div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px', marginTop: 'auto' }}>
                {cmp.features.map((feat, i) => (
                  <span key={i} style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: 500 }}>
                    {feat}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(cmp.targetUrl);
                    alert(`Tracking link copied to clipboard!\n\n${cmp.targetUrl}`);
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  <span>Promote Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Downloading media pack for ${cmp.title}... Includes 4K images and reel templates.`)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Media Pack
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 3. PERFORMANCE ANALYTICS TAB
// =========================================================================
export function PerformanceTabView({
  stats,
  chartPoints,
}: {
  stats: any;
  chartPoints: any[];
}) {
  const [range, setRange] = useState('Last 21 days');
  const impressions = stats?.impressions ?? 0;
  const clicks = stats?.clicks ?? 0;
  const bookingsCount = stats?.bookingsCount ?? stats?.conversions ?? 0;
  const earnings = stats?.earnings ?? stats?.totalEarnings ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        padding: '24px 28px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            Performance Deep-Dive & Conversion Analytics
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Multi-touch conversion tracking, regional destination breakdowns, and channel attribution across Georgia.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['Last 7 days', 'Last 21 days', 'Last 90 days', 'Year to Date'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: range === r ? '1px solid #2563EB' : '1px solid #CBD5E1',
                backgroundColor: range === r ? '#EFF6FF' : '#FFFFFF',
                color: range === r ? '#2563EB' : '#475569',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Big Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Impressions', val: impressions.toLocaleString(), delta: '+12.4%', good: true },
          { label: 'Tracked Link Clicks', val: clicks.toLocaleString(), delta: '+8.2%', good: true },
          { label: 'Confirmed Bookings', val: bookingsCount.toLocaleString(), delta: '+18.6%', good: true },
          { label: 'Total Commission Earned', val: `€${earnings}`, delta: '+22.1%', good: true },
        ].map((m, i) => (
          <div key={i} style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, marginBottom: '6px' }}>{m.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>{m.val}</div>
            <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>{m.delta} vs previous period</div>
          </div>
        ))}
      </div>

      {/* Conversion Funnel Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
          Traveler Conversion Funnel
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { stage: '1. Ad & Story Impressions', count: impressions.toLocaleString(), pct: 100, color: '#93C5FD' },
            { stage: '2. Link Clicks', count: clicks.toLocaleString(), pct: 65, color: '#60A5FA' },
            { stage: '3. Stay Detail Page Views', count: Math.round(clicks * 0.6).toLocaleString(), pct: 45, color: '#3B82F6' },
            { stage: '4. Booking Checkout Initiated', count: Math.round(bookingsCount * 1.5).toLocaleString(), pct: 24, color: '#2563EB' },
            { stage: '5. Confirmed Paid Reservations', count: bookingsCount.toLocaleString(), pct: 15, color: '#1D4ED8' },
          ].map((f, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{f.stage}</span>
                <strong style={{ color: '#0F172A' }}>{f.count}</strong>
              </div>
              <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${f.pct}%`, height: '100%', backgroundColor: f.color, borderRadius: '6px', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Regional Revenue & Traffic Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Regional Breakdown */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Earnings by Georgian Region
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { reg: 'Stepantsminda / Kazbegi', rev: '€540.20', pct: 42, color: '#3B82F6' },
              { reg: 'Old Tbilisi & Vera', rev: '€360.00', pct: 28, color: '#10B981' },
              { reg: 'Batumi Coastline', rev: '€205.50', pct: 16, color: '#F59E0B' },
              { reg: 'Kakheti Wine Country', rev: '€128.80', pct: 10, color: '#8B5CF6' },
              { reg: 'Svaneti & Kutaisi', rev: '€50.00', pct: 4, color: '#EC4899' },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>{r.reg}</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.rev} ({r.pct}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', backgroundColor: r.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Channels */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Traffic Source Channels
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { src: 'Instagram Stories & Reels', share: '45%', earnings: '€578.00' },
              { src: 'Travel Blog Guides', share: '28%', earnings: '€360.00' },
              { src: 'YouTube Travel Vlogs', share: '17%', earnings: '€218.00' },
              { src: 'Direct Messaging & WhatsApp', share: '10%', earnings: '€128.50' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{s.src}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Share: {s.share}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB' }}>
                  {s.earnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 4. BALANCE & PAYOUTS TAB
// =========================================================================
export function PayoutsTabView({
  stats,
  onOpenPayoutModal,
}: {
  stats?: any;
  onOpenPayoutModal: () => void;
}) {
  const available = stats?.totalEarnings !== undefined ? Number(stats.totalEarnings).toFixed(2) : '0.00';
  const gel = (Number(available) * 3.0).toFixed(2);

  const [payoutsList, setPayoutsList] = useState([
    { id: 'TX-9421', date: 'Oct 15, 2026', method: 'Bank of Georgia (IBAN GE29BG...)', amount: '€450.00', status: 'COMPLETED' },
    { id: 'TX-8832', date: 'Sep 30, 2026', method: 'TBC Bank (IBAN GE41TB...)', amount: '€380.00', status: 'COMPLETED' },
    { id: 'TX-7640', date: 'Sep 15, 2026', method: 'Bank of Georgia (IBAN GE29BG...)', amount: '€520.00', status: 'COMPLETED' },
    { id: 'TX-6520', date: 'Aug 31, 2026', method: 'SEPA Euro Transfer', amount: '€610.00', status: 'COMPLETED' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 3 Balances Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#0B132B', color: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Available for Withdrawal</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#38BDF8', margin: '8px 0 4px 0' }}>€{available}</div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>≈ ₾{gel} GEL</div>
          </div>
          <button
            type="button"
            onClick={onOpenPayoutModal}
            style={{
              marginTop: '18px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Request Payout Now
          </button>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>In Escrow / Clearance</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: '8px 0 4px 0' }}>€340.00</div>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Clears automatically when guests complete check-in at their Georgian villa or hotel.
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Lifetime Payouts</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#059669', margin: '8px 0 4px 0' }}>€4,890.20</div>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Total verified earnings settled to your Georgian and European bank accounts.
          </p>
        </div>
      </div>

      {/* Linked Accounts */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Connected Payout Accounts
          </h3>
          <button
            type="button"
            onClick={() => alert('Add bank account modal: You can link Bank of Georgia, TBC Bank, or SEPA IBAN.')}
            style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Add Bank Account
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Bank of Georgia (BOG)</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>IBAN: GE29BG0000000123456789</div>
              <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#16A34A', fontWeight: 600 }}>Default • Verified</span>
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>TBC Bank</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>IBAN: GE41TB7770000987654321</div>
              <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}>Secondary • Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Withdrawal History Ledger
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Settlement Cycle: 1st & 15th of each month</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 24px' }}>Transaction ID</th>
                <th style={{ padding: '12px 24px' }}>Date</th>
                <th style={{ padding: '12px 24px' }}>Destination Method</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px 24px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payoutsList.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 24px', fontWeight: 600, color: '#0F172A' }}>{p.id}</td>
                  <td style={{ padding: '14px 24px', color: '#64748B' }}>{p.date}</td>
                  <td style={{ padding: '14px 24px', color: '#334155' }}>{p.method}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>{p.amount}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: '11.5px', fontWeight: 600 }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading official PDF statement for ${p.id}...`)}
                      style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#2563EB', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 5. REFERRALS & SUB-AFFILIATE TAB
// =========================================================================
export function ReferralsTabView({
  referralUrl,
  copyToClipboard,
}: {
  referralUrl: string;
  copyToClipboard: (text: string) => void;
}) {
  const subAffiliates = [
    { name: 'Nika Beridze (Tbilisi)', joined: 'Oct 2, 2026', bookings: 34, gross: '€8,240', override: '€41.20', status: 'ACTIVE' },
    { name: 'Elena Rostova (Batumi)', joined: 'Sep 21, 2026', bookings: 28, gross: '€6,720', override: '€33.60', status: 'ACTIVE' },
    { name: 'Marcus Lind (Berlin)', joined: 'Sep 10, 2026', bookings: 52, gross: '€14,800', override: '€74.00', status: 'ACTIVE' },
    { name: 'Sophie Laurent (Paris)', joined: 'Aug 28, 2026', bookings: 41, gross: '€11,200', override: '€56.00', status: 'ACTIVE' },
    { name: 'Luka Gelashvili (Kutaisi)', joined: 'Aug 14, 2026', bookings: 12, gross: '€2,720', override: '€13.60', status: 'ACTIVE' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with 5% Tier Override */}
      <div style={{
        backgroundColor: '#0B132B',
        color: '#FFFFFF',
        padding: '28px',
        borderRadius: '16px',
        border: '1px solid #1E293B',
      }}>
        <div style={{ maxWidth: '640px' }}>
          <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Two-Tier Creator Program
          </span>
          <h2 style={{ margin: '8px 0', fontSize: '22px', fontWeight: 700 }}>
            Invite Creators & Earn a 5% Lifetime Override
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
            Share your invite link with fellow travel influencers, tour guides, and bloggers. When they earn commissions on KAYA, you automatically receive a 5% platform bonus on all their referred bookings forever.
          </p>
        </div>

        {/* Copy Box */}
        <div style={{ display: 'flex', gap: '10px', maxWidth: '540px' }}>
          <input
            type="text"
            readOnly
            value={`${referralUrl}&type=creator`}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#111C3A', color: '#F8FAFC', fontSize: '13px' }}
          />
          <button
            type="button"
            onClick={() => copyToClipboard(`${referralUrl}&type=creator`)}
            style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
          >
            Copy Invite Link
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>Total Invited Creators</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: '4px 0' }}>14</div>
          <div style={{ fontSize: '11.5px', color: '#059669' }}>9 actively referring</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>Sub-Network Sales</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: '4px 0' }}>€43,680</div>
          <div style={{ fontSize: '11.5px', color: '#64748B' }}>Gross bookings generated</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>Your 5% Override Earning</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563EB', margin: '4px 0' }}>€218.40</div>
          <div style={{ fontSize: '11.5px', color: '#059669' }}>Passive income this month</div>
        </div>
      </div>

      {/* Referrals Directory */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Registered Creator Network
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 24px' }}>Creator</th>
                <th style={{ padding: '12px 24px' }}>Join Date</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Bookings</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Gross Sales</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Your 5% Override</th>
                <th style={{ padding: '12px 24px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {subAffiliates.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 24px', fontWeight: 600, color: '#0F172A' }}>{s.name}</td>
                  <td style={{ padding: '14px 24px', color: '#64748B' }}>{s.joined}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 600 }}>{s.bookings}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', color: '#334155' }}>{s.gross}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>{s.override}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: '11px', fontWeight: 600 }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 6. MARKETING ASSETS & MEDIA KIT TAB
// =========================================================================
export function AssetsTabView({
  user,
  copyToClipboard,
}: {
  user?: any;
  copyToClipboard: (text: string) => void;
}) {
  const assets = [
    { title: 'Gergeti Trinity Mountain Hero (4K)', type: '16:9 Landscape', res: '3840x2160', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&auto=format&fit=crop&q=80' },
    { title: 'Batumi Boulevard Sunset Palms (4K)', type: '16:9 Landscape', res: '3840x2160', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop&q=80' },
    { title: 'Svaneti Watchtowers Glacier Story', type: '9:16 Vertical Reel', res: '1080x1920', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80' },
    { title: 'Kakheti Ancient Qvevri Harvest Story', type: '9:16 Vertical Reel', res: '1080x1920', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=80' },
    { title: 'Old Tbilisi Sulfur Baths Square', type: '1:1 Square Post', res: '1080x1080', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=80' },
    { title: 'Martvili Canyon Boat Rafting', type: '1:1 Square Post', res: '1080x1080', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80' },
  ];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kaya.ge';
  const userRef = user?.affiliateCode || (user?.email ? user.email.split('@')[0] : 'kaya');
  const embedCode = `<iframe src="${origin}/embed/booking-widget?ref=${userRef}" width="100%" height="220" frameborder="0" style="border-radius:12px;border:1px solid #E2E8F0;"></iframe>`;

  const captions = [
    {
      title: 'Instagram / TikTok Reel Caption (English)',
      text: 'Waking up to snowcapped Caucasus peaks at Mount Kazbek 🏔️ Book the exact mountain chalet we stayed at through KAYA (link in bio) and save up to 15% with my code! #GeorgiaTravel #Kazbegi #Caucasus',
    },
    {
      title: 'Georgian Authentic Travel Caption (ქართული)',
      text: 'აღმოაჩინეთ საქართველოს ულამაზესი კუთხეები KAYA-სთან ერთად. დაჯავშნეთ საუკეთესო სასტუმროები და კოტეჯები ყაზბეგში, ბათუმსა და სვანეთში!',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px 28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
          Marketing Media Kit & Creative Studio
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
          Official high-resolution Georgian photography, vertical story reels, pre-tested caption swipe files, and embeddable booking widgets.
        </p>
      </div>

      {/* Visual Assets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {assets.map((a, i) => (
          <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ height: '140px', backgroundImage: `url(${a.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: 600 }}>
                {a.type}
              </span>
            </div>
            <div style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{a.title}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{a.res} • High-Res JPG</div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Starting download for ${a.title} (${a.res})...`)}
                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Embed Widget Generator */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
          Embeddable KAYA Search Widget for Websites & Blogs
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: '#64748B' }}>
          Paste this snippet into your WordPress, Squarespace, or Webflow travel blog. All bookings initiated through the widget automatically track to your affiliate ID.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            readOnly
            value={embedCode}
            rows={2}
            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#334155', fontSize: '12px', fontFamily: 'monospace' }}
          />
          <button
            type="button"
            onClick={() => {
              copyToClipboard(embedCode);
              alert('Embed widget code copied to clipboard!');
            }}
            style={{ padding: '10px 18px', borderRadius: '8px', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            Copy Snippet
          </button>
        </div>
      </div>

      {/* Caption Swipe File */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
          Pre-Written Copywriting Swipe File
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {captions.map((c, i) => (
            <div key={i} style={{ padding: '14px 18px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{c.title}</div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{c.text}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(c.text);
                  alert('Caption copied to clipboard!');
                }}
                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#2563EB', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Copy Text
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 7. AUDIENCE DEMOGRAPHICS TAB
// =========================================================================
export function AudienceTabView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px 28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
          Audience Demographics & Traveler Insights
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
          Real-time traveler origin, stay duration preferences, and booking behavior across the Republic of Georgia.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Origin Countries */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Top Visitor Countries of Origin
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { country: 'Germany & DACH', pct: 24, count: '4,402 visitors' },
              { country: 'Georgia (Domestic)', pct: 22, count: '4,035 visitors' },
              { country: 'Poland & Central Europe', pct: 16, count: '2,934 visitors' },
              { country: 'United Kingdom', pct: 14, count: '2,567 visitors' },
              { country: 'United States & Canada', pct: 12, count: '2,201 visitors' },
              { country: 'UAE & Gulf Region', pct: 12, count: '2,201 visitors' },
            ].map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{c.country}</span>
                  <span style={{ color: '#64748B' }}>{c.pct}% ({c.count})</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct * 3}%`, height: '100%', backgroundColor: '#2563EB', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation Category Preferences */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Stay & Experience Preferences
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { type: 'Mountain Cabins & Chalets (Kazbegi/Gudauri)', pct: 42, color: '#059669' },
              { type: 'Boutique Heritage Stays (Old Tbilisi)', pct: 31, color: '#2563EB' },
              { type: 'Black Sea Waterfront Lofts (Batumi)', pct: 18, color: '#F59E0B' },
              { type: '4x4 Self-Drive & Wine Safari Packages', pct: 9, color: '#8B5CF6' },
            ].map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{p.type}</span>
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>{p.pct}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', backgroundColor: p.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Traveler Insight Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Avg. Stay Duration', val: '4.8 Nights', sub: 'Extended alpine trips' },
          { label: 'Avg. Booking Lead Time', val: '19 Days', sub: 'Advance planning' },
          { label: 'Peak Booking Hour', val: '21:00 - 23:00', sub: 'Evening mobile surfing' },
          { label: 'Group Composition', val: 'Couples (52%)', sub: 'Romantic escapes' },
        ].map((item, i) => (
          <div key={i} style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '4px 0' }}>{item.val}</div>
            <div style={{ fontSize: '11px', color: '#059669' }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 8. REPORTS & TAX EXPORTS TAB
// =========================================================================
export function ReportsTabView() {
  const downloadCSV = () => {
    const rows = [
      ['Date', 'Destination', 'Campaign', 'Clicks', 'Conversions', 'Gross GMV (EUR)', 'Commission Rate', 'Net Commission (EUR)', 'Status'],
      ['2026-10-21', 'Kazbegi', 'Stepantsminda Alpine', '142', '4', '1280.00', '14%', '179.20', 'CONFIRMED'],
      ['2026-10-20', 'Batumi', 'Black Sea Coastal Suites', '210', '6', '2700.00', '12%', '324.00', 'CONFIRMED'],
      ['2026-10-19', 'Tbilisi', 'Old Town Heritage Lofts', '185', '5', '1050.00', '11%', '115.50', 'CONFIRMED'],
      ['2026-10-18', 'Kakheti', 'Ancient Qvevri Harvest', '98', '3', '840.00', '15%', '126.00', 'CONFIRMED'],
      ['2026-10-17', 'Svaneti', 'Mestia Watchtower Glamping', '64', '2', '380.00', '10%', '38.00', 'CONFIRMED'],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kaya-affiliate-report-2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthlyStatements = [
    { month: 'October 2026 (MTD)', clicks: 18342, bookings: 523, gross: '€18,420', commission: '€1,284.50', tax: '€0.00 (Small Biz)', net: '€1,284.50' },
    { month: 'September 2026', clicks: 14820, bookings: 412, gross: '€14,800', commission: '€1,180.00', tax: '€0.00 (Small Biz)', net: '€1,180.00' },
    { month: 'August 2026', clicks: 16100, bookings: 460, gross: '€16,500', commission: '€1,320.00', tax: '€0.00 (Small Biz)', net: '€1,320.00' },
    { month: 'July 2026', clicks: 13400, bookings: 380, gross: '€13,100', commission: '€1,048.00', tax: '€0.00 (Small Biz)', net: '€1,048.00' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        padding: '24px 28px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            Financial Reports & Tax Statements
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Export transaction logs, monthly payout receipts, and Georgian Revenue Service (RS.ge) compliance certificates.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadCSV}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: '#059669',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Export Master CSV Report</span>
        </button>
      </div>

      {/* Tax Certificate Info Box */}
      <div style={{ padding: '18px 24px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE', display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#DBEAFE', color: '#1D4ED8', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E3A8A' }}>
            Georgian Small Business Tax Relief (1% Flat Rate)
          </div>
          <div style={{ fontSize: '12px', color: '#1E40AF', marginTop: '2px', lineHeight: 1.5 }}>
            Registered Georgian Individual Entrepreneurs benefit from 1% turnover taxation on KAYA affiliate revenue under RS.ge guidelines. International partners receive zero-withholding cross-border invoices.
          </div>
        </div>
      </div>

      {/* Monthly Statements Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Monthly Settlement Statements
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 24px' }}>Period</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Clicks</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Bookings</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Gross GMV</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Commission</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Tax Status</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Net Paid</th>
                <th style={{ padding: '12px 24px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStatements.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 24px', fontWeight: 600, color: '#0F172A' }}>{m.month}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', color: '#64748B' }}>{m.clicks.toLocaleString()}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>{m.bookings}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', color: '#334155' }}>{m.gross}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>{m.commission}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px' }}>{m.tax}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 700, color: '#2563EB' }}>{m.net}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading statement PDF for ${m.month}...`)}
                      style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 9. REWARDS & LEVELS GAMIFICATION TAB
// =========================================================================
export function RewardsTabView() {
  const [xp, setXp] = useState(420);

  const levels = [
    { lvl: 'Level 1', name: 'Trail Starter', xp: '0 XP', rate: '8% Commission', unlocked: true },
    { lvl: 'Level 2', name: 'Pathfinder', xp: '100 XP', rate: '9% + Custom Vanity Slug', unlocked: true },
    { lvl: 'Level 3', name: 'Voyager', xp: '250 XP', rate: '10% + 24-Hour Instant Payouts', unlocked: true },
    { lvl: 'Level 4', name: 'Explorer Affiliate', xp: '500 XP', rate: '12% Peak Season Commission Boost', unlocked: true, current: true },
    { lvl: 'Level 5', name: 'Alpine Ambassador', xp: '1,000 XP', rate: '13% + 1 Free Weekend Stay at Kazbegi Chalet', unlocked: false },
    { lvl: 'Level 6', name: 'Silk Road Partner', xp: '2,500 XP', rate: '14% + Dedicated 24/7 Georgian Concierge', unlocked: false },
    { lvl: 'Level 7', name: 'KAYA Legend', xp: '5,000 XP', rate: '15% VIP Take-Rate + Annual Svaneti Retreat', unlocked: false },
  ];

  const quests = [
    { title: 'Refer 3 bookings to Stepantsminda in October', reward: '+200 XP', done: '2 / 3', completed: false },
    { title: 'Share your customized tracking link on Instagram', reward: '+50 XP', done: 'Done', completed: true },
    { title: 'Generate €1,500 in monthly bookings volume', reward: '+300 XP', done: '€1,284 / €1,500', completed: false },
    { title: 'Embed the KAYA search widget on a personal site', reward: '+100 XP', done: 'Done', completed: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Current Level Card */}
      <div style={{
        backgroundColor: '#0B132B',
        color: '#FFFFFF',
        padding: '28px',
        borderRadius: '16px',
        border: '1px solid #1E293B',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 700, textTransform: 'uppercase' }}>Current Creator Tier</span>
            <h2 style={{ margin: '4px 0', fontSize: '24px', fontWeight: 700 }}>Level 4 • Explorer Affiliate</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
              Enjoy 12% peak season commission rate and priority placement on partner listings.
            </p>
          </div>

          <div style={{ backgroundColor: '#111C3A', padding: '12px 20px', borderRadius: '12px', border: '1px solid #1E293B', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>XP Progress</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8' }}>{xp} / 1,000 XP</div>
            <div style={{ fontSize: '11px', color: '#60A5FA', marginTop: '2px' }}>580 XP to Level 5</div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div>
          <div style={{ height: '8px', backgroundColor: '#1E293B', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${(xp / 1000) * 100}%`, height: '100%', backgroundColor: '#38BDF8', borderRadius: '6px', transition: 'width 0.4s' }} />
          </div>
        </div>
      </div>

      {/* 2-Column Split: Roadmap & Active Quests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Tier Roadmap */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Explorer Tier Roadmap
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {levels.map((l, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: l.current ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: l.current ? '#EFF6FF' : l.unlocked ? '#F8FAFC' : '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: l.unlocked ? '#0F172A' : '#94A3B8' }}>{l.lvl} • {l.name}</span>
                    {l.current && (
                      <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '10px', fontWeight: 700 }}>YOU</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: l.unlocked ? '#475569' : '#94A3B8', marginTop: '2px' }}>{l.rate}</div>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: l.unlocked ? '#059669' : '#94A3B8' }}>{l.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active XP Quests */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Active XP Missions & Challenges
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quests.map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: q.completed ? '#F0FDF4' : '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>{q.title}</div>
                  <div style={{ fontSize: '11.5px', color: q.completed ? '#16A34A' : '#64748B', marginTop: '2px' }}>Progress: {q.done}</div>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: q.completed ? '#DCFCE7' : '#EFF6FF', color: q.completed ? '#16A34A' : '#2563EB', fontSize: '11.5px', fontWeight: 700 }}>
                  {q.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 10. STAYS & BOOKINGS TAB
// =========================================================================
export function StaysTabView({
  bookings,
  onCancelBooking,
  actionLoading,
}: {
  bookings: any[];
  onCancelBooking: (id: string) => void;
  actionLoading: string | null;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        padding: '24px 28px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            My Stays & Live Reservations
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Real-time itinerary manager connected to the KAYA MongoDB database.
          </p>
        </div>

        <Link
          href="/hotels"
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Explore More Stays
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', color: '#94A3B8' }}>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', margin: '0 0 6px 0' }}>No active reservations found.</p>
          <p style={{ fontSize: '13px', margin: '0 0 20px 0' }}>Book a boutique villa in Stepantsminda, Old Tbilisi, or Batumi to view live itinerary tickets here.</p>
          <Link
            href="/hotels"
            style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}
          >
            Browse Georgian Stays
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {bookings.map(b => (
            <div
              key={b._id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '18px 24px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  {b.listing_title || 'Georgian Boutique Experience'}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
                  Check-in: <strong>{b.check_in || 'Flexible'}</strong> • {b.guests || 2} Guests • Total: <strong style={{ color: '#0F172A' }}>€{b.total_price || 240}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: b.status === 'CANCELLED' ? '#FEE2E2' : '#DCFCE7',
                  color: b.status === 'CANCELLED' ? '#DC2626' : '#16A34A',
                }}>
                  {b.status || 'CONFIRMED'}
                </span>

                {b.status !== 'CANCELLED' && (
                  <button
                    type="button"
                    onClick={() => onCancelBooking(b._id)}
                    disabled={actionLoading === b._id}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DC2626',
                      color: '#DC2626',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {actionLoading === b._id ? 'Cancelling...' : 'Cancel Reservation'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 11. HELP & SUPPORT TAB
// =========================================================================
export function HelpTabView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Payouts');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does KAYA tracking and cookie attribution work?',
      a: 'We use a 60-day first-party tracking cookie. Any visitor who clicks your custom link will be credited to your account if they complete a booking on any Georgian accommodation or tour within 60 days, even if they leave and return later.',
    },
    {
      q: 'When and how are commission payouts distributed?',
      a: 'Payouts are cleared on the 1st and 15th of each month once the traveler checks in. You can withdraw directly to Bank of Georgia (BOG), TBC Bank, or international SEPA / Wise accounts with zero domestic transfer fees.',
    },
    {
      q: 'Do I need a Georgian tax number to receive payments?',
      a: 'No. International affiliates receive cross-border B2B payouts with an EU-compliant invoice. For Georgian tax residents, registering as an Individual Entrepreneur allows you to enjoy Georgia\'s 1% preferential small business tax rate.',
    },
    {
      q: 'Can I run paid ads (Google / Meta) to my affiliate links?',
      a: 'Yes, you may run paid search and social campaigns targeting Georgian travel queries, provided your ads do not bid on trademark terms "KAYA.ge" directly as exact match.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setMessage('');
      alert('Support ticket created successfully! Our Tbilisi partner success team will respond within 2 hours.');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px 28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
          Help & Priority Partner Support
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
          Find answers to common questions or submit an expedited ticket to our Georgian partner relations team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* FAQ Accordion */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: openFaq === i ? '#F8FAFC' : '#FFFFFF',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span>{f.q}</span>
                  <span style={{ fontSize: '16px', color: '#64748B' }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '12px 16px', fontSize: '12.5px', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Open 24/7 Priority Support Ticket
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
              >
                <option>Payouts & Bank Transfers</option>
                <option>Tracking & Cookies</option>
                <option>Campaign Inquiries</option>
                <option>Custom Content & High-Res Footage</option>
                <option>Technical Issue</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Subject</label>
              <input
                type="text"
                placeholder="Brief summary of your question"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Message Details</label>
              <textarea
                rows={4}
                placeholder="Explain what you need assistance with..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {submitted ? 'Submitting...' : 'Send Priority Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
