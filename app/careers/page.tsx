'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../about/about.module.css'; // Reuse about styles

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Join the Kaya Team</h1>
            <p className={styles.subtitle}>Help us build the future of travel in Sakartvelo.</p>
          </div>
        </div>
        <div className={styles.container} style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <h2>Current Openings</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>No open positions at the moment. Check back soon!</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
