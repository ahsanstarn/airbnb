'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/lang-context';
import { useTheme } from '@/lib/theme-context';

export default function SharedNav() {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langOpen && !(e.target as HTMLElement).closest('.nav-right')) setLangOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [langOpen]);

  return (
    <>
      <div className={`global-nav-shell ${scrolled ? 'visible' : ''}`}>
        <nav className="nav-sticky-bar">
          <Link className="nav-brand" href="/">
            <span className="brandmark-dot"></span>
            <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
          </Link>
          
          <div className="nav-links">
            <Link href="/offers" className="nav-link-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
              {t('offers') || 'Offers'}
            </Link>
            <Link href="/tours" className="nav-link-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
              {t('tours') || 'Tours'}
            </Link>
            <Link href="/guides" className="nav-link-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>
              {t('guides') || 'Guides'}
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

            <button type="button" className="nav-icon nav-action-btn nav-theme-icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z"/></svg>
              )}
            </button>
            
            <Link className="nav-auth-link" href="/login">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-link-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              {t('login') || 'SIGN UP/LOGIN'}
            </Link>
            
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu" style={{ display: 'none' }}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>
      </div>

      <div className={`global-mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
        <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        <Link href="/offers" onClick={() => setMobileNavOpen(false)}>{t('offers') || 'Offers'}</Link>
        <Link href="/tours" onClick={() => setMobileNavOpen(false)}>{t('tours') || 'Tours'}</Link>
        <Link href="/guides" onClick={() => setMobileNavOpen(false)}>{t('guides') || 'Guides'}</Link>
        <Link href="/login" onClick={() => setMobileNavOpen(false)}>{t('login') || 'SIGN UP/LOGIN'}</Link>
      </div>
    </>
  );
}
