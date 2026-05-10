'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Reimagining Travel in Georgia</h1>
            <p className={styles.subtitle}>
              Kaya.ge is more than a marketplace. It&apos;s a tribute to Sakartvelo — 
              a bridge between traditional hospitality and modern technology.
            </p>
          </div>
        </section>

        <section id="story" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={styles.content}>
                <span className={styles.label}>Our Story</span>
                <h2>Born in Tbilisi, Inspired by the Mountains</h2>
                <p>
                  Kaya started with a simple idea: how can we make the authentic Georgian experience 
                  accessible to the world without losing the soul of local hospitality? 
                  We built a platform where every guest house, winery, and tour guide is verified 
                  and treated as a partner, not just a listing.
                </p>
              </div>
              <div className={styles.imagePlaceholder}>
                <div className={styles.glassCard}>
                  <h3>8,000+</h3>
                  <p>Verified Listings</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="hosting" className={styles.hostingSection}>
          <div className={styles.container}>
            <div className={styles.hostingHeader}>
              <span className={styles.label}>For Hosts</span>
              <h2>How Hosting Works on Kaya</h2>
              <p>Join the community of thousands of hosts across Georgia.</p>
            </div>
            
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3>List Your Property</h3>
                <p>Upload photos, set your flat monthly fee, and tell your story.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3>Chat with Guests</h3>
                <p>Use our direct messaging system to coordinate with travelers.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3>Keep 100% Earnings</h3>
                <p>Since we don&apos;t charge commissions, every Lari goes to you.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
