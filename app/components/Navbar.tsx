'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
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
        <div className={`${styles.searchPill} ${scrolled ? styles.searchPillCompact : ''}`}>
          <button className={styles.searchField}>
            <span className={styles.searchFieldText}>Anywhere</span>
          </button>
          <span className={styles.searchSep}></span>
          <button className={styles.searchField}>
            <span className={styles.searchFieldText}>Any week</span>
          </button>
          <span className={styles.searchSep}></span>
          <button className={`${styles.searchField} ${styles.searchFieldMuted}`}>
            <span className={styles.searchFieldText}>Add guests</span>
          </button>
          <button className={styles.searchIconBtn} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>

        {/* Right */}
        <div className={styles.right}>
          <Link href="/register?type=business" className={styles.hostLink}>
            List your property
          </Link>
          <button className={styles.langBtn} aria-label="Language">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
          </button>
          <Link href="/login" className={styles.profileBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            <div className={styles.avatar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#717171">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
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
          <Link href="/hotels" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Hotels & Stays</Link>
          <Link href="/restaurants" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Restaurants</Link>
          <Link href="/cars" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Car Rentals</Link>
          <Link href="/tours" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Tours & Experiences</Link>
          <Link href="/services" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Services</Link>
          <Link href="/salons" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Beauty & Spa</Link>
          <div className={styles.mobileDivider}></div>
          <Link href="/muse" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Muse — Georgia Guide</Link>
          <Link href="/chat" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>KLARA AI Assistant</Link>
          <div className={styles.mobileDivider}></div>
          <Link href="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Log in</Link>
          <Link href="/register" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Sign up</Link>
        </div>
      )}
    </header>
  );
}
