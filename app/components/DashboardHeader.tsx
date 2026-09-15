'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardHeaderProps {
  activeRole: 'tourist' | 'affiliate' | 'business' | 'admin';
  user?: any;
}

export default function DashboardHeader({ activeRole, user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const ROLES = [
    { id: 'tourist', label: 'Tourist', icon: '✈️', href: '/tourist/dashboard' },
    { id: 'affiliate', label: 'Affiliate', icon: '🤝', href: '/dashboard' },
    { id: 'business', label: 'Business Suite', icon: '💼', href: '/business/dashboard' },
    { id: 'admin', label: 'Admin Command', icon: '🛡️', href: '/admin' },
  ];

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#0B132B',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Kaya<span style={{ color: '#c8a983' }}>.</span>
          </span>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', tracking: '1px', backgroundColor: 'rgba(200, 169, 131, 0.15)', color: '#c8a983', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
            GEORGIA
          </span>
        </Link>

        {/* Role Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {ROLES.map(role => {
            const isActive = activeRole === role.id || pathname === role.href;
            return (
              <Link
                key={role.id}
                href={role.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0B132B' : '#94a3b8',
                  backgroundColor: isActive ? '#c8a983' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{role.icon}</span>
                <span>{role.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right User Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search bookings, stays, partners..."
            style={{
              padding: '8px 14px 8px 36px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '13px',
              width: '240px',
              outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#94a3b8' }}>🔍</span>
        </div>

        {/* Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
            {(user?.name || 'K')[0]}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{user?.name || 'KAYA Account'}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>{activeRole} mode</div>
          </div>
        </div>
      </div>
    </header>
  );
}
