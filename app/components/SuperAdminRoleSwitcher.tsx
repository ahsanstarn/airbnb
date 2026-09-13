'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UserRoleInfo {
  name?: string;
  email?: string;
  role?: string;
  isSuperAdmin?: boolean;
}

const ROLE_CONFIG = {
  admin: {
    label: 'Super Admin',
    shortLabel: 'Admin',
    icon: '🛡️',
    color: '#d9653b',
    bgColor: 'rgba(217, 101, 59, 0.15)',
    borderColor: 'rgba(217, 101, 59, 0.4)',
    route: '/admin',
    desc: 'Platform control, system stats, live view & listing management',
  },
  business: {
    label: 'Host / Business',
    shortLabel: 'Host',
    icon: '🏨',
    color: '#2a9d8f',
    bgColor: 'rgba(42, 157, 143, 0.15)',
    borderColor: 'rgba(42, 157, 143, 0.4)',
    route: '/business/dashboard',
    desc: 'Property listings, reservations, guest bookings & host earnings',
  },
  tourist: {
    label: 'Tourist / Traveler',
    shortLabel: 'Tourist',
    icon: '🎒',
    color: '#e76f51',
    bgColor: 'rgba(231, 111, 81, 0.15)',
    borderColor: 'rgba(231, 111, 81, 0.4)',
    route: '/dashboard',
    desc: 'Travel itineraries, booked stays, favorites & travel profile',
  },
};

export default function SuperAdminRoleSwitcher({ initialUser }: { initialUser?: UserRoleInfo | null }) {
  const router = useRouter();
  const [user, setUser] = useState<UserRoleInfo | null>(initialUser || null);
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [activeRole, setActiveRole] = useState<'admin' | 'business' | 'tourist'>('admin');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('kaya_token')) : null;
    fetch('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          if (data.user.role && (data.user.role === 'admin' || data.user.role === 'business' || data.user.role === 'tourist')) {
            setActiveRole(data.user.role);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // STRICT AUTHORIZATION: ONLY show for ahsanstarn@gmail.com
  if (user?.email?.toLowerCase().trim() !== 'ahsanstarn@gmail.com') {
    return null;
  }

  const currentCfg = ROLE_CONFIG[activeRole] || ROLE_CONFIG.admin;

  const handleRoleChange = async (targetRole: 'admin' | 'business' | 'tourist') => {
    if (targetRole === activeRole || switching) return;
    setSwitching(true);

    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('kaya_token')) : null;
      const res = await fetch('/api/auth/role-switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: targetRole }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('kaya_token', data.token);
        }
        setActiveRole(targetRole);
        setOpen(false);

        // Redirect directly to destination dashboard for this role
        const targetRoute = ROLE_CONFIG[targetRole]?.route || '/';
        router.push(targetRoute);
        // Force refresh state
        setTimeout(() => {
          window.location.href = targetRoute;
        }, 150);
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 99999,
        fontFamily: 'inherit',
      }}
    >
      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={switching}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          borderRadius: '9999px',
          background: 'rgba(23, 23, 23, 0.92)',
          color: '#ffffff',
          border: `1px solid ${currentCfg.borderColor}`,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36), 0 0 16px rgba(217, 101, 59, 0.15)',
          cursor: switching ? 'wait' : 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.borderColor = currentCfg.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.borderColor = currentCfg.borderColor;
        }}
        title="Super Admin Role Switcher (Only visible to ahsanstarn@gmail.com)"
      >
        <span style={{ fontSize: '14px' }}>👑</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Role:</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: currentCfg.color,
            background: currentCfg.bgColor,
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
          }}
        >
          <span>{currentCfg.icon}</span>
          <span>{switching ? 'Switching...' : currentCfg.label}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.7,
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Popover Menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: 0,
            width: '320px',
            borderRadius: '16px',
            background: 'rgba(23, 23, 23, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5), 0 0 24px rgba(217, 101, 59, 0.2)',
            backdropFilter: 'blur(20px)',
            padding: '16px',
            animation: 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '15px' }}>👑</span>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>Superadmin Role Switcher</span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(217, 101, 59, 0.2)',
                  color: '#d9653b',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontWeight: 600,
                }}
              >
                Owner
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
              Choose your active role to test and experience Kaya.ge from any perspective:
            </p>
          </div>

          {/* Role Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(Object.keys(ROLE_CONFIG) as Array<'admin' | 'business' | 'tourist'>).map((roleKey) => {
              const cfg = ROLE_CONFIG[roleKey];
              const isCurrent = activeRole === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleChange(roleKey)}
                  disabled={switching}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: isCurrent ? cfg.bgColor : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isCurrent ? cfg.borderColor : 'transparent'}`,
                    color: '#ffffff',
                    cursor: switching ? 'wait' : 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>{cfg.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: isCurrent ? cfg.color : '#ffffff' }}>
                        {cfg.label}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '10px', color: cfg.color, fontWeight: 700 }}>● Active</span>
                      )}
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.3 }}>
                      {cfg.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div
            style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center',
            }}
          >
            🔒 Confidential • Only active for <strong>ahsanstarn@gmail.com</strong>
          </div>
        </div>
      )}
    </div>
  );
}
