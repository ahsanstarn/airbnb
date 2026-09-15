'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/lang-context';
import { useTheme } from '@/lib/theme-context';

export default function SharedNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; email?: string } | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('kaya_token')) : null;
    fetch('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('kaya_token');
      setCurrentUser(null);
      window.location.href = '/login';
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('kaya_token');
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langOpen && !(e.target as HTMLElement).closest('.nav-dropdown') && !(e.target as HTMLElement).closest('.nav-action-btn')) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [langOpen]);

  if (pathname === '/login') return null;

  const isHome = pathname === '/';
  const showNav = !isHome || scrolled;

  return (
    <>
      <div className={`global-nav-shell ${showNav ? 'visible' : ''} ${isHome ? 'home-nav' : ''}`}>
        <nav className="nav-sticky-bar">
          <Link className="nav-brand" href="/">
            <span className="brandmark-dot"></span>
            <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
          </Link>
          
          <div className="nav-links">
            <Link href="/hotels" className="nav-link-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="nav-link-icon"><path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M10 11h2M10 15h2M14 11h2M14 15h2M18 11h2M18 15h2M9 3h6v4H9z"/></svg>
              {t('nav.stays', 'Stays')}
            </Link>
            <Link href="/apartments" className="nav-link-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="nav-link-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>
              {t('nav.apartments', 'Apartments')}
            </Link>
            <Link href="/search" className="nav-link-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="nav-link-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              {t('nav.search', 'Search')}
            </Link>
            <Link href="/offers" className="nav-link-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
              {t('nav.offers', 'Offers')}
            </Link>
            <Link href="/tours" className="nav-link-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
              {t('nav.tours', 'Tours')}
            </Link>
            <Link href="/guides" className="nav-link-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>
              {t('nav.guides', 'Guides')}
            </Link>
          </div>
          
          <div className="nav-spacer"></div>
          
          <div className="nav-right" style={{ position: 'relative' }}>
            <button type="button" className="nav-icon nav-action-btn" onClick={() => setLangOpen(!langOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg>
              <span style={{ fontSize: '10px', marginLeft: '2px', fontWeight: 'bold' }}>{lang}</span>
            </button>
            
            {langOpen && (
              <div className="nav-dropdown" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0 }}>
                <button className="nav-dropdown-button" onClick={() => { setLang('EN'); setLangOpen(false); }}>🇬🇧 English (GEL)</button>
                <button className="nav-dropdown-button" onClick={() => { setLang('KA'); setLangOpen(false); }}>🇬🇪 ქართული (GEL)</button>
                <button className="nav-dropdown-button" onClick={() => { setLang('RU'); setLangOpen(false); }}>🇷🇺 Русский (GEL)</button>
              </div>
            )}

            <button type="button" className="nav-icon nav-action-btn nav-theme-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z"/></svg>
              )}
            </button>
            
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  className="nav-auth-link"
                  href={
                    currentUser.role === 'business'
                      ? '/business/dashboard'
                      : currentUser.role === 'admin'
                      ? '/admin'
                      : '/tourist/dashboard'
                  }
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent, #d9653b)'
                  }}></span>
                  <span>
                    {currentUser.name && !currentUser.name.toLowerCase().startsWith('kaya')
                      ? currentUser.name.split(' ')[0]
                      : t('nav.account', 'My Account')}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title={t('nav.logout', 'Logout')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '12px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            ) : (
              <Link className="nav-auth-link nav-login-btn" href="/login">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                {t('nav.login', 'Log In')}
              </Link>
            )}
            
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>
      </div>

      <div 
        className={`global-mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}
        style={{ display: mobileNavOpen ? 'flex' : 'none' }}
      >
        <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>{t('nav.stays', 'Stays')}</Link>
        <Link href="/apartments" onClick={() => setMobileNavOpen(false)}>{t('nav.apartments', 'Apartments')}</Link>
        <Link href="/search" onClick={() => setMobileNavOpen(false)}>{t('nav.search', 'Search')}</Link>
        <Link href="/offers" onClick={() => setMobileNavOpen(false)}>{t('nav.offers', 'Offers')}</Link>
        <Link href="/tours" onClick={() => setMobileNavOpen(false)}>{t('nav.tours', 'Tours')}</Link>
        <Link href="/guides" onClick={() => setMobileNavOpen(false)}>{t('nav.guides', 'Guides')}</Link>
        {currentUser ? (
          <>
            <Link href={currentUser.role === 'business' ? '/business/dashboard' : '/dashboard'} onClick={() => setMobileNavOpen(false)}>
              {t('nav.dashboard', 'My Account')} ({currentUser.name && !currentUser.name.toLowerCase().startsWith('kaya') ? currentUser.name.split(' ')[0] : 'Account'})
            </Link>
            <Link href="/dashboard/affiliates" onClick={() => setMobileNavOpen(false)}>
              {t('nav.affiliates', 'Affiliate Program')}
            </Link>
            <button
              onClick={() => { setMobileNavOpen(false); handleLogout(); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent, #d9653b)',
                textAlign: 'left',
                padding: '12px 0',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              {t('nav.logout', 'Logout')}
            </button>
          </>
        ) : (
          <Link href="/login" onClick={() => setMobileNavOpen(false)}>{t('nav.login', 'Log In')}</Link>
        )}
      </div>
    </>
  );
}
