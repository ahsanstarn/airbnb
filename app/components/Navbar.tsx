'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async (email: string) => {
      if (!email || typeof window === 'undefined' || !window.crypto?.subtle) return false;
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase().trim()));
      const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      const isKayaAdmin = hashHex === '5a1f85ff5a73d150d8e118522ca01273c5af85ce1318a33a5f98a5846af6439b';
      return isKayaAdmin;
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user as { email: string } | null;
      setUser(currentUser);
      if (currentUser?.email) checkAdmin(currentUser.email).then(setIsAdmin);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user as { email: string } | null;
      setUser(currentUser);
      if (currentUser?.email) {
        const adminStatus = await checkAdmin(currentUser.email);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''} ${scrolled ? styles.scrolled : styles.notScrolled}`}>
      <nav className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logo}>
          Kaya.ge
        </Link>

        <div className={styles.menu}>
          <Link href="/search" className={styles.menuLink}>Hotels</Link>
          <Link href="/search" className={styles.menuLink}>Apartments</Link>
          <Link href="/muse" className={styles.menuLink}>Where to go</Link>
          <Link href="/contact" className={styles.menuLink}>Contact Us</Link>
        </div>

        <div className={styles.right}>
          <Link href="/login" className={styles.hostBtn}>Become a host</Link>
          
          <Link href={user ? (isAdmin ? "/admin" : "/dashboard") : "/login"} className={styles.profileBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            <div className={styles.avatar}>
              {user ? (
                <div className={styles.avatarLogged}>
                  {isAdmin && <span className={styles.adminBadge}>Admin</span>}
                  <span>{user.email[0].toUpperCase()}</span>
                </div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#717171">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
