'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import styles from './pricing.module.css';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Simple, Transparent Pricing</h1>
          <p className={styles.subtitle}>
            Join Georgia&apos;s fastest-growing travel marketplace. No commissions, 
            no hidden fees. Just one flat monthly rate.
          </p>
        </section>

        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.popularBadge}>Most Popular</span>
            <div className={styles.cardHeader}>
              <p className={styles.cardName}>Professional Host</p>
              <div className={styles.priceRow}>
                <span className={styles.currency}>₾</span>
                <span className={styles.amount}>20</span>
                <span className={styles.period}>/month</span>
              </div>
            </div>

            <ul className={styles.features}>
              <li className={styles.feature}>
                <span className={styles.check}>✓</span> Unlimited listings
              </li>
              <li className={styles.feature}>
                <span className={styles.check}>✓</span> 0% commission on bookings
              </li>
              <li className={styles.feature}>
                <span className={styles.check}>✓</span> Direct contact with guests
              </li>
              <li className={styles.feature}>
                <span className={styles.check}>✓</span> Verified host badge
              </li>
              <li className={styles.feature}>
                <span className={styles.check}>✓</span> 24/7 priority support
              </li>
              <li className={styles.feature}>
                <span className={styles.check}>✓</span> AI-powered visibility boost
              </li>
            </ul>

            <Link href="/login" className={styles.btn}>
              Get Started Now
            </Link>
          </div>
        </div>

        <section className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>Why is there no commission?</h3>
              <p>We believe in a fair marketplace. By charging a flat monthly fee, we allow you to keep 100% of your earnings and maintain lower prices for guests.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can I cancel anytime?</h3>
              <p>Yes, there are no long-term contracts. You can pause or cancel your subscription at any time directly from your host dashboard.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>How do I pay?</h3>
              <p>We support all major Georgian banks, Apple Pay, and credit cards. Payments are securely processed via Stripe.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>What if I have 100+ listings?</h3>
              <p>The price remains the same! Whether you have one guest house or a chain of hotels, it&apos;s still just ₾20/month per host account.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
