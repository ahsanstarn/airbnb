'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// =========================================================================
// 1. USERS DIRECTORY MODULE
// =========================================================================
export function UsersDirectoryModule({
  currentUser,
}: {
  currentUser: any;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Ahsan Starn', email: 'ahsanstarn@gmail.com', role: 'SUPER_ADMIN', status: 'ACTIVE', joined: 'Oct 2026', location: 'Tbilisi, Georgia', stays: 18, spent: '₾8,420' },
    { id: 'usr-2', name: 'Nino Kalandadze', email: 'nino.k@gmail.com', role: 'BUSINESS', status: 'ACTIVE', joined: 'Oct 2026', location: 'Kazbegi, Georgia', stays: 0, spent: '₾24,800 host' },
    { id: 'usr-3', name: 'Alexander Wright', email: 'alexexplores@kaya.ge', role: 'TOURIST', status: 'ACTIVE', joined: 'Sep 2026', location: 'London, UK', stays: 6, spent: '₾4,120' },
    { id: 'usr-4', name: 'Giorgi Tsereteli', email: 'giorgi.batumi@kaya.ge', role: 'BUSINESS', status: 'ACTIVE', joined: 'Sep 2026', location: 'Batumi, Georgia', stays: 2, spent: '₾16,500 host' },
    { id: 'usr-5', name: 'Elena Müller', email: 'elena.m@berlin.de', role: 'TOURIST', status: 'ACTIVE', joined: 'Aug 2026', location: 'Berlin, Germany', stays: 4, spent: '₾2,940' },
    { id: 'usr-6', name: 'David Kipiani', email: 'd.kipiani@tbc.ge', role: 'TOURIST', status: 'ACTIVE', joined: 'Jul 2026', location: 'Tbilisi, Georgia', stays: 9, spent: '₾5,200' },
    { id: 'usr-7', name: 'Tamara Asatiani', email: 'tamara.svaneti@kaya.ge', role: 'BUSINESS', status: 'ACTIVE', joined: 'Jul 2026', location: 'Mestia, Svaneti', stays: 0, spent: '₾11,200 host' },
  ]);

  const toggleStatus = (id: string) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  const filtered = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '20px 24px',
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
            User & Account Management
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
            Total 248,320 registered accounts across tourists, verified hosts, and platform administrators.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              outline: 'none',
              width: '240px',
            }}
          />

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#1F2937',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontSize: '12.5px',
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admins</option>
            <option value="BUSINESS">Hosts / Business</option>
            <option value="TOURIST">Tourists / Travelers</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>User Details</th>
                <th style={{ padding: '14px 20px' }}>Role</th>
                <th style={{ padding: '14px 20px' }}>Location</th>
                <th style={{ padding: '14px 20px' }}>Registered</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Activity</th>
                <th style={{ padding: '14px 20px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{u.name}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: u.role === 'SUPER_ADMIN' ? 'rgba(239, 68, 68, 0.15)' : u.role === 'BUSINESS' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: u.role === 'SUPER_ADMIN' ? '#F87171' : u.role === 'BUSINESS' ? '#60A5FA' : '#34D399',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#D1D5DB' }}>{u.location}</td>
                  <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{u.joined}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', color: '#FFFFFF', fontWeight: 600 }}>{u.spent}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: u.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: u.status === 'ACTIVE' ? '#10B981' : '#EF4444',
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {u.role !== 'SUPER_ADMIN' ? (
                      <button
                        type="button"
                        onClick={() => toggleStatus(u.id)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          backgroundColor: 'transparent',
                          color: u.status === 'ACTIVE' ? '#F87171' : '#34D399',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>Root Protected</span>
                    )}
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
// 2. VERIFIED PARTNERS / BUSINESSES MODULE
// =========================================================================
export function BusinessesModule() {
  const [businesses, setBusinesses] = useState([
    { id: 'biz-1', name: 'Rooms Hotel Kazbegi', category: 'Hotel / Resort', location: 'Stepantsminda', status: 'VERIFIED', monthlyRevenue: '₾48,200', activeListings: 12 },
    { id: 'biz-2', name: 'Château Mukhrani Cellars', category: 'Winery / Experience', location: 'Mukhrani', status: 'VERIFIED', monthlyRevenue: '₾28,400', activeListings: 4 },
    { id: 'biz-3', name: 'Batumi Boulevard Luxury Lofts', category: 'Apartments', location: 'Batumi', status: 'VERIFIED', monthlyRevenue: '₾34,100', activeListings: 8 },
    { id: 'biz-4', name: 'Svaneti 4x4 Mountain Fleet', category: 'Car Rental', location: 'Mestia', status: 'VERIFIED', monthlyRevenue: '₾19,600', activeListings: 6 },
    { id: 'biz-5', name: 'Shavi Lomi Old Tbilisi Culinary', category: 'Restaurant', location: 'Tbilisi', status: 'VERIFIED', monthlyRevenue: '₾22,300', activeListings: 2 },
    { id: 'biz-6', name: 'Gergeti Mountain Glamping', category: 'Cabins', location: 'Kazbegi', status: 'PENDING', monthlyRevenue: '₾8,900', activeListings: 3 },
  ]);

  const toggleVerify = (id: string) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED' } : b));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Verified Georgian Business Partners & Hosts
        </h2>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
          6,842 authorized businesses operating hotels, car rentals, private tours, and Georgian gastronomy.
        </p>
      </div>

      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Business Name</th>
                <th style={{ padding: '14px 20px' }}>Category</th>
                <th style={{ padding: '14px 20px' }}>Region</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Active Assets</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Monthly GMV</th>
                <th style={{ padding: '14px 20px', textAlign: 'center' }}>Verification</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#FFFFFF' }}>{b.name}</td>
                  <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{b.category}</td>
                  <td style={{ padding: '14px 20px', color: '#D1D5DB' }}>{b.location}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', color: '#FFFFFF' }}>{b.activeListings}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: '#38BDF8' }}>{b.monthlyRevenue}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: b.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: b.status === 'VERIFIED' ? '#10B981' : '#F59E0B',
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => toggleVerify(b.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backgroundColor: 'transparent',
                        color: b.status === 'VERIFIED' ? '#F87171' : '#34D399',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {b.status === 'VERIFIED' ? 'Suspend' : 'Approve'}
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
// 3. BOOKINGS LEDGER MODULE
// =========================================================================
export function BookingsLedgerModule({
  bookings,
}: {
  bookings: any[];
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const defaultBookings = [
    { id: 'BK-1042', title: 'Kazbegi Mountain Panorama Chalet', user: 'Alexander Wright', date: 'Oct 24 - 28, 2026', total: '€340.00', status: 'CONFIRMED' },
    { id: 'BK-1041', title: 'Batumi Boulevard Penthouse', user: 'Elena Müller', date: 'Oct 22 - 25, 2026', total: '€450.00', status: 'CONFIRMED' },
    { id: 'BK-1040', title: 'Kakheti Private Cellar Tour & Tasting', user: 'Marcus Lind', date: 'Oct 21, 2026', total: '€180.00', status: 'CONFIRMED' },
    { id: 'BK-1039', title: 'Old Tbilisi Sulfur Spa Villa', user: 'Sophie Laurent', date: 'Oct 19 - 22, 2026', total: '€290.00', status: 'COMPLETED' },
    { id: 'BK-1038', title: 'Svaneti 4x4 Expedition Delica', user: 'Luka Gelashvili', date: 'Oct 15 - 18, 2026', total: '€240.00', status: 'CANCELLED' },
  ];

  const list = bookings && bookings.length > 0 ? bookings : defaultBookings;
  const filtered = filterStatus === 'ALL' ? list : list.filter(b => (b.status || 'CONFIRMED') === filterStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
            Platform Bookings Ledger (Republic of Georgia)
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
            Live reservations streaming from MongoDB across villas, mountain chalets, and car fleets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                border: filterStatus === s ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: filterStatus === s ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: filterStatus === s ? '#60A5FA' : '#9CA3AF',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Reservation / Property</th>
                <th style={{ padding: '14px 20px' }}>Guest</th>
                <th style={{ padding: '14px 20px' }}>Dates</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Total GMV</th>
                <th style={{ padding: '14px 20px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b._id || b.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#FFFFFF' }}>{b.listing_title || b.title}</td>
                  <td style={{ padding: '14px 20px', color: '#D1D5DB' }}>{b.user || 'Verified Traveler'}</td>
                  <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{b.check_in || b.date || 'Flexible'}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: '#10B981' }}>{b.total_price ? `€${b.total_price}` : b.total}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: (b.status || 'CONFIRMED') === 'CANCELLED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: (b.status || 'CONFIRMED') === 'CANCELLED' ? '#EF4444' : '#10B981',
                    }}>
                      {b.status || 'CONFIRMED'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => alert(`Opening reservation details for ${b._id || b.id || 'booking'}...`)}
                      style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: '#60A5FA', fontSize: '11.5px', cursor: 'pointer' }}
                    >
                      View Ticket
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
// 4. FINANCIAL LEDGER & REVENUE MODULE
// =========================================================================
export function FinanceModule() {
  const [payoutQueue, setPayoutQueue] = useState([
    { id: 'PAY-891', recipient: 'Rooms Hotel Kazbegi', iban: 'GE29BG0000000123456789', amount: '₾14,800', type: 'Host Settlement', status: 'PENDING' },
    { id: 'PAY-892', recipient: 'Alexander Wright', iban: 'SEPA DE89370400440532013000', amount: '€1,284.50', type: 'Affiliate Commission', status: 'PENDING' },
    { id: 'PAY-893', recipient: 'Château Mukhrani', iban: 'GE41TB7770000987654321', amount: '₾8,420', type: 'Host Settlement', status: 'PENDING' },
  ]);

  const approvePayout = (id: string) => {
    setPayoutQueue(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Gross Booking Volume (GMV)</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', margin: '6px 0' }}>₾1,248,500</div>
          <div style={{ fontSize: '11.5px', color: '#10B981' }}>+24.2% month-over-month</div>
        </div>

        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Platform Take-Rate (12% Net)</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981', margin: '6px 0' }}>₾149,820</div>
          <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>Net software revenue retained</div>
        </div>

        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Payment Gateways Status</div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#10B981' }}>• Bank of Georgia Pay (Operational)</span>
            <span style={{ color: '#10B981' }}>• TBC Checkout (Operational)</span>
            <span style={{ color: '#10B981' }}>• Stripe SEPA / EUR (Operational)</span>
          </div>
        </div>
      </div>

      {/* Payout Approval Queue */}
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
            Host & Affiliate Payout Approval Queue
          </h3>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Requires SuperAdmin Sign-off</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px' }}>Request ID</th>
                <th style={{ padding: '12px 20px' }}>Recipient Partner</th>
                <th style={{ padding: '12px 20px' }}>IBAN / Route</th>
                <th style={{ padding: '12px 20px' }}>Type</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Authorize</th>
              </tr>
            </thead>
            <tbody>
              {payoutQueue.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#FFFFFF' }}>{p.id}</td>
                  <td style={{ padding: '14px 20px', color: '#D1D5DB' }}>{p.recipient}</td>
                  <td style={{ padding: '14px 20px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: '11.5px' }}>{p.iban}</td>
                  <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{p.type}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: '#38BDF8' }}>{p.amount}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: p.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: p.status === 'APPROVED' ? '#10B981' : '#F59E0B',
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {p.status === 'PENDING' ? (
                      <button
                        type="button"
                        onClick={() => approvePayout(p.id)}
                        style={{ padding: '5px 12px', borderRadius: '6px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Authorize Transfer
                      </button>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 600 }}>Settling via API</span>
                    )}
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
// 5. GEORGIA DEMAND RADAR MAP MODULE
// =========================================================================
export function GeorgiaMapModule() {
  const [selectedHotspot, setSelectedHotspot] = useState<string>('Kazbegi');

  const hotspots = [
    { name: 'Kazbegi (Stepantsminda)', activeUsers: 8420, bookingsToday: 192, surge: '+48%', focus: 'Gergeti chalets & Gudauri ski transfers' },
    { name: 'Tbilisi (Old Town & Vera)', activeUsers: 42150, bookingsToday: 840, surge: '+34%', focus: 'Sulfur bath suites & bohemian lofts' },
    { name: 'Batumi (Adjara Coast)', activeUsers: 18900, bookingsToday: 410, surge: '+26%', focus: 'Boulevard seafront apartments & casino resorts' },
    { name: 'Kakheti (Wine Country)', activeUsers: 6420, bookingsToday: 144, surge: '+38%', focus: 'Ancient qvevri wine estates in Sighnaghi' },
    { name: 'Svaneti (Mestia & Ushguli)', activeUsers: 4320, bookingsToday: 96, surge: '+52%', focus: 'UNESCO medieval defensive watchtowers' },
    { name: 'Kutaisi (Imereti Canyons)', activeUsers: 7650, bookingsToday: 134, surge: '+19%', focus: 'Martvili canyon rafting & Prometheus caves' },
  ];

  const current = hotspots.find(h => h.name.startsWith(selectedHotspot)) || hotspots[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Republic of Georgia Real-Time Demand Radar
        </h2>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
          Interactive geospatial tracking of active travelers, live booking surges, and capacity across Georgian regions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Hotspots Selector */}
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>Active Regional Hotspots</div>
          {hotspots.map((h, i) => (
            <div
              key={i}
              onClick={() => setSelectedHotspot(h.name.split(' ')[0])}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: h.name.startsWith(selectedHotspot) ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.06)',
                backgroundColor: h.name.startsWith(selectedHotspot) ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{h.name}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{h.activeUsers.toLocaleString()} active visitors</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981' }}>{h.surge}</span>
            </div>
          ))}
        </div>

        {/* Selected Hotspot Intelligence Details */}
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 700, textTransform: 'uppercase' }}>Selected Hotspot Cockpit</span>
            <h3 style={{ margin: '6px 0 16px 0', fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>
              {current.name}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Active Live Tourists</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>{current.activeUsers.toLocaleString()}</div>
                <div style={{ fontSize: '10.5px', color: '#10B981' }}>Surging across mobile app</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Bookings Today</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#38BDF8', margin: '4px 0' }}>{current.bookingsToday}</div>
                <div style={{ fontSize: '10.5px', color: '#60A5FA' }}>Avg €280/stay</div>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: '#D1D5DB', lineHeight: 1.6 }}>
              <strong>Primary Travel Driver:</strong> {current.focus}. Algorithmic surge pricing is automatically balancing host occupancy rates.
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert(`Broadcast push notification sent to all ${current.activeUsers} active travelers in ${current.name}!`)}
            style={{
              marginTop: '20px',
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
            Dispatch Push Offer to {current.name}
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 6. APPROVALS & MODERATION QUEUE MODULE
// =========================================================================
export function ApprovalsModule({
  pendingApprovals,
  onApprove,
  onReject,
}: {
  pendingApprovals: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Platform Moderation & Approvals Queue
        </h2>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
          {pendingApprovals.length} pending partner submissions awaiting SuperAdmin authorization.
        </p>
      </div>

      {pendingApprovals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>All queues clear!</div>
          <div style={{ fontSize: '13px' }}>Zero pending partner listings, businesses, or flagged reviews.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingApprovals.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{item.name}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', fontSize: '11px', fontWeight: 700 }}>
                    {item.type}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                  Host: {item.host} • Location: {item.location} • Pricing: {item.price} • Submitted: {item.date}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => onApprove(item.id)}
                  style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Approve & Publish
                </button>
                <button
                  type="button"
                  onClick={() => onReject(item.id)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 7. DESTINATIONS & REGIONS MODULE
// =========================================================================
export function DestinationsModule() {
  const [destinations, setDestinations] = useState([
    { name: 'Stepantsminda (Mount Kazbek)', region: 'Mtskheta-Mtianeti', listings: 142, visitors: '24,800/mo', featured: true },
    { name: 'Batumi Boulevard Coast', region: 'Adjara', listings: 380, visitors: '58,400/mo', featured: true },
    { name: 'Old Tbilisi & Narikala Fortress', region: 'Tbilisi', listings: 840, visitors: '142,000/mo', featured: true },
    { name: 'Mestia & Ushguli Watchtowers', region: 'Svaneti', listings: 94, visitors: '16,200/mo', featured: true },
    { name: 'Sighnaghi & Alazani Vineyards', region: 'Kakheti', listings: 186, visitors: '31,500/mo', featured: true },
    { name: 'Prometheus Caves & Martvili', region: 'Imereti & Samegrelo', listings: 78, visitors: '19,800/mo', featured: false },
    { name: 'Borjomi Mineral Springs & Park', region: 'Samtskhe-Javakheti', listings: 64, visitors: '14,100/mo', featured: false },
  ]);

  const toggleFeatured = (name: string) => {
    setDestinations(prev => prev.map(d => d.name === name ? { ...d, featured: !d.featured } : d));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
            Republic of Georgia Destinations Manager
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
            Curate destinations featured on the homepage hero carousel and search filters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Add new destination region modal.')}
          style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
        >
          + Add Region
        </button>
      </div>

      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 20px' }}>Destination Region</th>
              <th style={{ padding: '14px 20px' }}>Administrative Zone</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Active Stays</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Monthly Traffic</th>
              <th style={{ padding: '14px 20px', textAlign: 'center' }}>Hero Carousel</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: '#FFFFFF' }}>{d.name}</td>
                <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{d.region}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right', color: '#FFFFFF' }}>{d.listings}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right', color: '#38BDF8', fontWeight: 600 }}>{d.visitors}</td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: d.featured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: d.featured ? '#10B981' : '#9CA3AF',
                  }}>
                    {d.featured ? 'FEATURED' : 'STANDARD'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(d.name)}
                    style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: '#60A5FA', fontSize: '11.5px', cursor: 'pointer' }}
                  >
                    Toggle Hero
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// 8. BROADCAST & NOTIFICATIONS MODULE
// =========================================================================
export function NotificationsModule() {
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle('');
      setBody('');
      alert(`Broadcast notification dispatched to ${targetAudience === 'ALL' ? 'all 248,320 platform users' : targetAudience}!`);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Broadcast Center (Push Notifications & Email Blasts)
        </h2>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
          Deliver critical alerts, seasonal promotional announcements, or urgent weather advisories across Georgia.
        </p>
      </div>

      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', maxWidth: '640px' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D1D5DB', marginBottom: '4px' }}>Target Audience</label>
            <select
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1F2937', color: '#FFFFFF', fontSize: '13px' }}
            >
              <option value="ALL">All Registered Users (248,320)</option>
              <option value="TOURISTS">Active Tourists in Georgia (58,420)</option>
              <option value="HOSTS">Verified Business Partners & Hosts (6,842)</option>
              <option value="AFFILIATES">Affiliate Partners & Ambassadors (1,420)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D1D5DB', marginBottom: '4px' }}>Broadcast Title</label>
            <input
              type="text"
              placeholder="e.g. Winter Season Opening in Gudauri & Kazbegi!"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1F2937', color: '#FFFFFF', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D1D5DB', marginBottom: '4px' }}>Broadcast Message</label>
            <textarea
              rows={4}
              placeholder="Write your push notification message..."
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1F2937', color: '#FFFFFF', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            disabled={sent}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '6px',
            }}
          >
            {sent ? 'Broadcasting...' : 'Send Live Broadcast'}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// 9. PLATFORM SECURITY & RBAC MODULE
// =========================================================================
export function SecurityModule({
  currentUser,
}: {
  currentUser: any;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Platform Security & RBAC Integrity
        </h2>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
          Role-Based Access Control enforcing SuperAdmin authorization exclusively for ahsanstarn@gmail.com.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>SuperAdmin Root Account</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', margin: '6px 0 2px 0' }}>ahsanstarn@gmail.com</div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Active Session • 2FA Enforced</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Firewall & DDOS Protection</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#10B981', margin: '6px 0 2px 0' }}>Cloudflare Enterprise Active</div>
          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>0 Intrusion Attempts in 24h</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>MongoDB Access Control</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', margin: '6px 0 2px 0' }}>TLS 1.3 Strict Encrypted</div>
          <span style={{ fontSize: '11px', color: '#38BDF8' }}>IP Whitelist Active</span>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 10. GLOBAL SETTINGS MODULE
// =========================================================================
export function SettingsModule() {
  const [currency, setCurrency] = useState('GEL');
  const [takeRate, setTakeRate] = useState('12');
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Platform Settings & Georgian API Configuration
        </h2>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
          Manage platform take-rates, default currency, and operational status.
        </p>
      </div>

      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D1D5DB', marginBottom: '6px' }}>
            Primary Platform Display Currency
          </label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1F2937', color: '#FFFFFF', fontSize: '13px' }}
          >
            <option value="GEL">GEL — Georgian Lari (₾)</option>
            <option value="EUR">EUR — Euro (€)</option>
            <option value="USD">USD — US Dollar ($)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D1D5DB', marginBottom: '6px' }}>
            Platform Booking Take-Rate (%)
          </label>
          <input
            type="number"
            value={takeRate}
            onChange={e => setTakeRate(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1F2937', color: '#FFFFFF', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Emergency Maintenance Mode</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Only SuperAdmins will be allowed into the platform</div>
          </div>
          <button
            type="button"
            onClick={() => setMaintenance(!maintenance)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: maintenance ? '#EF4444' : '#1F2937',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {maintenance ? 'ON (ACTIVE)' : 'OFF'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => alert('Platform configurations saved successfully!')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Save Platform Settings
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 11. GEORGIAN EVENTS & FAIRS MODULE
// =========================================================================
export function EventsModule() {
  const [events, setEvents] = useState([
    { id: 'EV-1', name: 'Rtveli Ancient Wine Harvest Festival', location: 'Telavi & Sighnaghi, Kakheti', dates: 'Oct 15 - Nov 5, 2026', category: 'Wine & Gastronomy', attendees: '18,400', status: 'ACTIVE' },
    { id: 'EV-2', name: 'Gudauri Ski Season Opening & Freeride Cup', location: 'Gudauri Ski Resort', dates: 'Dec 12 - 16, 2026', category: 'Winter Sports', attendees: '12,200', status: 'UPCOMING' },
    { id: 'EV-3', name: 'Black Sea International Jazz Festival', location: 'Batumi Boulevard', dates: 'Jul 22 - 26, 2026', category: 'Music & Culture', attendees: '24,000', status: 'SCHEDULED' },
    { id: 'EV-4', name: 'Tbilisi Open Air Music & Arts', location: 'Lisi Lake, Tbilisi', dates: 'Jun 18 - 21, 2026', category: 'Festival', attendees: '32,000', status: 'SCHEDULED' },
    { id: 'EV-5', name: 'Svanetoba Traditional Mountain Feast', location: 'Mestia, Svaneti', dates: 'Aug 8 - 10, 2026', category: 'Heritage & Folklore', attendees: '6,500', status: 'SCHEDULED' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
            Georgian Cultural Events, Festivals & Fairs
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
            Curate verified regional events across Georgia that trigger tourist surges and high occupancy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Add event modal.')}
          style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
        >
          + Add Event
        </button>
      </div>

      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 20px' }}>Event Name</th>
              <th style={{ padding: '14px 20px' }}>Location</th>
              <th style={{ padding: '14px 20px' }}>Dates</th>
              <th style={{ padding: '14px 20px' }}>Category</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Est. Attendees</th>
              <th style={{ padding: '14px 20px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: '#FFFFFF' }}>{ev.name}</td>
                <td style={{ padding: '14px 20px', color: '#D1D5DB' }}>{ev.location}</td>
                <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{ev.dates}</td>
                <td style={{ padding: '14px 20px', color: '#38BDF8' }}>{ev.category}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: '#10B981' }}>{ev.attendees}</td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: ev.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: ev.status === 'ACTIVE' ? '#10B981' : '#60A5FA' }}>
                    {ev.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// 12. PLATFORM ANALYTICS MODULE
// =========================================================================
export function AnalyticsModule() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
          Platform-Wide Intelligence & Growth Analytics
        </h2>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF' }}>
          Real-time metrics tracking traveler conversions, revenue take-rate, and regional expansion across Georgia.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Conversion Rate (Visit to Booking)</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', margin: '6px 0' }}>3.42%</div>
          <div style={{ fontSize: '11.5px', color: '#10B981' }}>+0.6% above European travel benchmark</div>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Average Basket Size</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981', margin: '6px 0' }}>₾410 (€136)</div>
          <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>2.8 nights average stay</div>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Host Repeat Retention</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#F59E0B', margin: '6px 0' }}>94.8%</div>
          <div style={{ fontSize: '11.5px', color: '#10B981' }}>High merchant loyalty</div>
        </div>
      </div>
    </div>
  );
}
