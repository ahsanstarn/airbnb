'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../components/Navbar';
import styles from './admin.module.css';

export default function AdminPanel() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ listings: 0, bookings: 0, users: 0 });

  useEffect(() => {
    const checkAdmin = () => {
      const isA = localStorage.getItem('kaya_admin') === 'true';
      if (!isA) {
        router.push('/login');
      } else {
        setIsAdmin(true);
        fetchStats();
      }
      setLoading(false);
    };

    async function fetchStats() {
      const { count: listingCount } = await supabase.from('listings').select('*', { count: 'exact', head: true });
      const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
      setStats({
        listings: listingCount || 0,
        bookings: bookingCount || 0,
        users: 1 // Placeholder for now
      });
    }

    checkAdmin();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Listings</h3>
            <p className={styles.statValue}>{stats.listings}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Bookings</h3>
            <p className={styles.statValue}>{stats.bookings}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Users</h3>
            <p className={styles.statValue}>{stats.users}</p>
          </div>
        </div>

        <div className={styles.recentSection}>
          <h2>Platform Overview</h2>
          <div className={styles.placeholderTable}>
            <p>Welcome to the Kaya.ge Admin Panel. From here you can moderate listings, view global analytics, and manage disputes.</p>
            <button className="btn btn-primary" onClick={() => router.push('/')}>View Site</button>
            <button className="btn btn-outline" onClick={() => {
              localStorage.removeItem('kaya_admin');
              supabase.auth.signOut();
              router.push('/login');
            }}>Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
