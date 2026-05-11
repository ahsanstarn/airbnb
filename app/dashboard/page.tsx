'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user?.email) {
        router.replace('/login');
        return;
      }
      setEmail(session.user.email);
      setLoading(false);
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <p className={styles.loading}>Loading…</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <h1 className={styles.title}>Your account</h1>
            <p className={styles.email}>{email}</p>
            <div className={styles.links}>
              <Link href="/search" className={styles.link}>
                Search stays
              </Link>
              <Link href="/chat" className={styles.link}>
                Trip planning chat
              </Link>
              <Link href="/cars" className={styles.link}>
                Car rentals
              </Link>
            </div>
            <button type="button" className={styles.signOut} onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
