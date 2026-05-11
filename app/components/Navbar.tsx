'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            kaya.ge
          </Link>
        </div>

        <div className={styles.right}>
          <Link href="/login" className={styles.hostBtn}>
            Become a host
          </Link>
        </div>
      </nav>
    </header>
  );
}
