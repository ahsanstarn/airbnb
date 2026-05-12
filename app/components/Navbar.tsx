'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          kaya.ge
        </Link>

        <div className={styles.links}>
          <Link href="/search" className={styles.link}>Visitors</Link>
          <Link href="/hotels" className={styles.link}>Stays</Link>
          <Link href="/muse" className={styles.link}>Where to go</Link>
          <Link href="/contact" className={styles.link}>Contact us</Link>
        </div>

        <div className={styles.right}>
          <Link href="/login" className={styles.hostBtn}>
            Become a host
          </Link>
          <Link href="/login" className={styles.loginIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
