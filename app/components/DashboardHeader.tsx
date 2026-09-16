'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/lang-context';
import { useTheme } from '@/lib/theme-context';

interface DashboardHeaderProps {
  activeRole: 'tourist' | 'affiliate' | 'business' | 'admin';
  user?: any;
}

export default function DashboardHeader({ activeRole, user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);

  const ROLES = [
    { id: 'tourist', label: t('dash.tourist', 'Tourist Studio'), icon: '✈️', href: '/tourist/dashboard' },
    { id: 'affiliate', label: t('dash.affiliate', 'Affiliate Studio'), icon: '🤝', href: '/dashboard' },
    { id: 'business', label: t('dash.business', 'Business Suite'), icon: '💼', href: '/business/dashboard' },
    { id: 'admin', label: t('dash.admin', 'Admin Command'), icon: '🛡️', href: '/admin' },
  ];

  return (
    <header
      style={{
        minHeight: '64px',
        backgroundColor: isDark ? '#0B132B' : 'rgba(255, 252, 248, 0.96)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(26, 18, 14, 0.08)',
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
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div className="dash-header-wrap">
        {/* Row 1 on mobile: Logo on left, Actions on right. On desktop: Logo + Roles on left, Actions on right */}
        <div className="dash-header-left">
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#ffffff' : '#1a120e', letterSpacing: '-0.5px' }}>
              Kaya<span style={{ color: '#c8a983' }}>.</span>
            </span>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(200, 169, 131, 0.15)', color: '#c8a983', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
              GEORGIA
            </span>
          </Link>

          {/* Role Switcher Pills */}
          <div className="dash-header-roles" style={{ display: 'flex', alignItems: 'center', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 18, 14, 0.04)', borderRadius: '12px', padding: '3px', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(26, 18, 14, 0.08)' }}>
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
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#0B132B' : (isDark ? '#94a3b8' : '#64748b'),
                    backgroundColor: isActive ? '#c8a983' : 'transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <span>{role.icon}</span>
                  <span>{role.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Actions: Theme Toggle, Language Switcher, User Avatar */}
        <div className="dash-header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,18,14,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(26,18,14,0.1)',
              color: isDark ? '#fbbf24' : '#d9653b',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26,18,14,0.04)',
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(26,18,14,0.1)',
                borderRadius: '20px',
                padding: '6px 12px',
                color: isDark ? '#ffffff' : '#1a120e',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span>🌐</span>
              <span>{lang}</span>
            </button>

            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(26,18,14,0.12)',
                  borderRadius: '12px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 200,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  minWidth: '130px',
                }}
              >
                <button onClick={() => { setLang('EN'); setLangOpen(false); }} style={{ padding: '8px 12px', border: 'none', background: 'none', color: isDark ? '#fff' : '#1a120e', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', textAlign: 'left', fontWeight: lang === 'EN' ? 700 : 400 }}>🇬🇧 English</button>
                <button onClick={() => { setLang('KA'); setLangOpen(false); }} style={{ padding: '8px 12px', border: 'none', background: 'none', color: isDark ? '#fff' : '#1a120e', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', textAlign: 'left', fontWeight: lang === 'KA' ? 700 : 400 }}>🇬🇪 ქართული</button>
                <button onClick={() => { setLang('RU'); setLangOpen(false); }} style={{ padding: '8px 12px', border: 'none', background: 'none', color: isDark ? '#fff' : '#1a120e', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', textAlign: 'left', fontWeight: lang === 'RU' ? 700 : 400 }}>🇷🇺 Русский</button>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#c8a983', color: '#0B132B', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 2px 8px rgba(200, 169, 131, 0.3)' }}>
              {(user?.name || 'K')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
