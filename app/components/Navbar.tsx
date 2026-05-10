'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user as { email: string } | null;
      setUser(currentUser);
      
      if (currentUser?.email && typeof window !== 'undefined' && window.crypto?.subtle) {
        // Auto-detect admin on load (Browser only)
        window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(currentUser.email.toLowerCase().trim()))
          .then(hashBuffer => {
            const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            if (hashHex === '5a1f85ff5a73d150d8e118522ca01273c5af85ce1318a33a5f98a5846af6439b') {
              localStorage.setItem('kaya_admin', 'true');
              setIsAdmin(true);
            }
          }).catch(() => {
            // Fallback to localStorage if crypto fails
            setIsAdmin(localStorage.getItem('kaya_admin') === 'true');
          });
      }
    });
    setIsAdmin(localStorage.getItem('kaya_admin') === 'true');
  }, []);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.logoSvg}>
            <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#E8573A" opacity="0.15"/>
            <path d="M16 6l3.09 6.26L26 13.27l-5 4.87 1.18 6.88L16 21.77l-6.18 3.25L11 18.14l-5-4.87 6.91-1.01L16 6z" fill="#E8573A"/>
          </svg>
          <span className={styles.logoText}>kaya</span>
        </Link>

        {/* Center Search - Desktop */}
        <form 
          className={`${styles.searchPill} ${scrolled ? styles.searchPillCompact : ''}`} 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = formData.get('q');
            router.push(`/search?region=${query}`);
          }}
        >
          <input
            name="q"
            type="text"
            placeholder="Search destination (e.g. Tbilisi, Batumi...)"
            className={styles.searchFieldInput}
            autoComplete="off"
          />
          <button type="submit" className={styles.searchIconBtn} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Right */}
        <div className={styles.right}>
          <Link href="/login" className={styles.hostLink}>
            List your property
          </Link>
          
          <div className={styles.langWrapper}>
            <button className={styles.langBtn} onClick={() => setLangOpen(!langOpen)} aria-label="Language">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
              <span className={styles.langText}>{currentLang}</span>
            </button>
            
            {langOpen && (
              <div className={styles.langMenu}>
                <button onClick={() => { setCurrentLang('GE'); setLangOpen(false); }}>🇬🇪 Georgian</button>
                <button onClick={() => { setCurrentLang('EN'); setLangOpen(false); }}>🇬🇧 English</button>
                <button onClick={() => { setCurrentLang('RU'); setLangOpen(false); }}>🇷🇺 Russian</button>
              </div>
            )}
          </div>
          <Link href={user ? (isAdmin ? "/admin" : "/dashboard") : "/login"} className={styles.profileBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            <div className={styles.avatar}>
              {user ? (
                <div className={styles.avatarLogged}>
                  <span className={styles.avatarInitial}>{user.email[0].toUpperCase()}</span>
                  {isAdmin && <span className={styles.adminBadge}>Admin</span>}
                </div>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#717171">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18"/>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/search" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Hotels & Stays</Link>
          <Link href="/search" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Restaurants</Link>
          <Link href="/search" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Car Rentals</Link>
          <Link href="/search" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Tours & Experiences</Link>
          <Link href="/search" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Services</Link>
          <Link href="/search" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Beauty & Spa</Link>
          <div className={styles.mobileDivider}></div>
          <Link href="/muse" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Muse — Georgia Guide</Link>
          <Link href="/chat" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>KLARA AI Assistant</Link>
          <div className={styles.mobileDivider}></div>
          <Link href="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Log in</Link>
          <Link href="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Sign up</Link>
        </div>
      )}
    </header>
  );
}
