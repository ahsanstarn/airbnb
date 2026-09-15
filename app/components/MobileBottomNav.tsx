'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/lang-context';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('kaya_token')) : null;
    if (!token) return;

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Hide on admin routes or checkout booking flows to maintain focused checkout
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/book/')) {
    return null;
  }

  const profileHref = currentUser
    ? currentUser.role === 'business'
      ? '/business/dashboard'
      : '/tourist/dashboard'
    : '/tourist/dashboard';

  const profileLabel = currentUser
    ? (currentUser.name && !currentUser.name.toLowerCase().startsWith('kaya') ? currentUser.name.split(' ')[0] : t('nav.account', 'Account'))
    : t('nav.login', 'Log In');

  const isHomeActive = pathname === '/';
  const isSearchActive = pathname === '/search';
  const isStaysActive = pathname.startsWith('/hotels') || pathname.startsWith('/apartments');
  const isProfileActive = pathname.startsWith('/dashboard') || pathname.startsWith('/business/dashboard') || pathname.startsWith('/login');

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Explore / Home */}
      <Link
        href="/"
        className={`mobile-bottom-nav-item ${isHomeActive ? 'active' : ''}`}
        aria-label="Explore homepage"
      >
        <span className="mobile-bottom-nav-icon">
          <svg viewBox="0 0 24 24" fill={isHomeActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" width="22" height="22">
            <path d="M3 10.25L12 3l9 7.25V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V10.25z" />
            <path d="M9 21v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
          </svg>
        </span>
        <span className="mobile-bottom-nav-label">{t('nav.home', 'Explore')}</span>
      </Link>

      {/* 2. Search */}
      <Link
        href="/search"
        className={`mobile-bottom-nav-item ${isSearchActive ? 'active' : ''}`}
        aria-label="Search listings"
      >
        <span className="mobile-bottom-nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" width="21" height="21">
            <circle cx="11" cy="11" r="7.5" />
            <path d="M16.5 16.5L21.5 21.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="mobile-bottom-nav-label">{t('nav.search', 'Search')}</span>
      </Link>

      {/* 3. Stays */}
      <Link
        href="/hotels"
        className={`mobile-bottom-nav-item ${isStaysActive ? 'active' : ''}`}
        aria-label="Browse stays and hotels"
      >
        <span className="mobile-bottom-nav-icon">
          <svg viewBox="0 0 24 24" fill={isStaysActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" width="22" height="22">
            <path d="M3 21h18" strokeLinecap="round" />
            <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            <path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" strokeLinecap="round" />
          </svg>
        </span>
        <span className="mobile-bottom-nav-label">{t('nav.stays', 'Stays')}</span>
      </Link>


      {/* 5. Profile / Account */}
      <Link
        href={profileHref}
        className={`mobile-bottom-nav-item ${isProfileActive ? 'active' : ''}`}
        aria-label={currentUser ? `Profile for ${currentUser.name}` : 'Log In or Sign Up'}
      >
        <span className="mobile-bottom-nav-icon">
          {currentUser ? (
            <div className="mobile-nav-avatar">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
          ) : (
            <svg viewBox="0 0 24 24" fill={isProfileActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" width="22" height="22">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <span className="mobile-bottom-nav-label">{profileLabel}</span>
      </Link>
    </nav>
  );
}
