'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async (email: string) => {
      if (!email || typeof window === 'undefined' || !window.crypto?.subtle) return false;
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase().trim()));
      const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex === '5a1f85ff5a73d150d8e118522ca01273c5af85ce1318a33a5f98a5846af6439b';
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user as { email: string } | null;
      setUser(currentUser);
      if (currentUser?.email) checkAdmin(currentUser.email).then(setIsAdmin);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user as { email: string } | null;
      setUser(currentUser);
      if (currentUser?.email) checkAdmin(currentUser.email).then(setIsAdmin);
      else setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
    >
      <nav className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logo}>
          Kaya.ge
        </Link>

        <div className={styles.menu}>
          {['Hotels', 'Apartments', 'Experiences', 'Wineries'].map((item) => (
            <Link key={item} href="/search" className={styles.menuLink}>
              {item}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          {isAdmin && (
            <Link href="/admin" className={styles.adminBadge}>
              Admin Panel
            </Link>
          )}
          
          <Link href={user ? "/dashboard" : "/login"} className={styles.profileBtn}>
            <div className={styles.burger}>
              <span></span>
              <span></span>
            </div>
            <div className={styles.avatar}>
              {user ? user.email[0].toUpperCase() : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
