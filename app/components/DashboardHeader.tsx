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
        minHeight: '64px',
        backgroundColor: '#0B132B',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Brand Logo & Role Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', maxWidth: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Kaya<span style={{ color: '#c8a983' }}>.</span>
          </span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(200, 169, 131, 0.15)', color: '#c8a983', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
            GEORGIA
          </span>
        </Link>

        {/* Role Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '3px', border: '1px solid rgba(255, 255, 255, 0.08)', overflowX: 'auto', maxWidth: '100%' }}>
          {ROLES.map(role => {
            const isActive = activeRole === role.id || pathname === role.href;
            return (
              <Link
                key={role.id}
                href={role.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0B132B' : '#94a3b8',
                  backgroundColor: isActive ? '#c8a983' : 'transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
            {(user?.name || 'K')[0]}
          </div>
          <div style={{ display: 'none' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{user?.name || 'KAYA Account'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
