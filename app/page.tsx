'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>FIND PLACE TOSTAY</h1>
        </div>
      </section>

      <section className={styles.featuredRegion}>
        <div className={styles.container}>
          <h2 className={styles.regionTitle}>Discover Kakheti</h2>
          <p className={styles.regionDescription}>
            Amber wine, vineyard roads, family tables and slow countryside afternoons.
          </p>
        </div>
      </section>

      <section className={styles.recommended}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recommended Places to Stay</h2>
            <Link href="/search" className={styles.seeAll}>See all</Link>
          </div>
          
          <div className={styles.propertyGrid}>
            <Link href="/listing/1" className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                <Image
                  src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop"
                  alt="Old Town Courtyard"
                  fill
                  className={styles.image}
                />
              </div>
              <h3 className={styles.propertyTitle}>Old Town Courtyard</h3>
            </Link>

            <Link href="/listing/2" className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                <Image
                  src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop"
                  alt="Kakheti Vineyard House"
                  fill
                  className={styles.image}
                />
              </div>
              <h3 className={styles.propertyTitle}>Kakheti Vineyard House</h3>
            </Link>

            <Link href="/listing/3" className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                <Image
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
                  alt="Batumi Sea View Loft"
                  fill
                  className={styles.image}
                />
              </div>
              <h3 className={styles.propertyTitle}>Batumi Sea View Loft</h3>
            </Link>

            <Link href="/listing/4" className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                <Image
                  src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop"
                  alt="Kazbegi Ridge Cabin"
                  fill
                  className={styles.image}
                />
              </div>
              <h3 className={styles.propertyTitle}>Kazbegi Ridge Cabin</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.muse}>
        <div className={styles.container}>
          <h2 className={styles.museTitle}>Kaya Muse</h2>
          <p className={styles.museDescription}>
            Open the guide before you book the trip.
            Region guides, cultural context, weather, phrasebook, emergency contacts and practical travel notes are all part of the basic Muse experience described for Phase 1.
          </p>
          <Link href="/muse" className={styles.exploreBtn}>Explore Muse</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Product</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/hotels">Hotels</Link></li>
              <li><Link href="/restaurants">Restaurants</Link></li>
              <li><Link href="/tours">Tours</Link></li>
              <li><Link href="/muse">Muse</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Company</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Platform</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/dashboard">Tourist dashboard</Link></li>
              <li><Link href="/business/dashboard">Business dashboard</Link></li>
              <li><Link href="/admin">Admin panel</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>kaya.ge</h3>
            <p className={styles.footerDescription}>
              Discover Georgia through curated stays, services, structured platform flows and thoughtful local context.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
