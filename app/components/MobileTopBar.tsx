'use client';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/lang-context';
import { useEffect, useState } from 'react';

export default function MobileTopBar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`mobile-top-bar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="nav-brand" style={{ color: 'var(--ink)', fontSize: '20px' }}>
        <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
      </Link>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setLang(lang === 'EN' ? 'KA' : 'EN')}
          className="nav-icon" 
          aria-label="Language toggle"
          style={{ width: '36px', height: '36px', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--ink)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>
        <button 
          onClick={toggleTheme} 
          className="nav-icon" 
          aria-label="Toggle theme"
          style={{ width: '36px', height: '36px', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--ink)' }}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
