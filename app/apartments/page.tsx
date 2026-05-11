'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './styles.module.css';
import homeStyles from '../page.module.css';

interface Listing {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  img: string;
  images?: string[];
  type?: string;
}

const staticListings: Listing[] = [
  { id: 3, title: 'Modern Seaside Flat', location: 'Batumi, Georgia', price: 95, rating: 4.72, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=800&fit=crop' },
  { id: 5, title: 'Old Town Guesthouse', location: 'Tbilisi, Georgia', price: 65, rating: 4.85, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=800&fit=crop' },
];

export default function ApartmentsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [liveListings, setLiveListings] = useState<Listing[]>(staticListings);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const { data, error } = await supabase.from('listings').select('*').eq('type', 'Apartment').limit(12);
        if (!error && data && data.length > 0) setLiveListings(data as Listing[]);
        else setLiveListings(staticListings);
      } catch {
        setLiveListings(staticListings);
      }
    }
    init();
  }, []);

  const expandedListing = liveListings.find((l) => l.id === expandedId);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCard}>
            <div className={styles.heroBg}>
              <Image src="/hero.png" alt="Background" fill priority className={styles.heroImg} />
              <div className={styles.heroOverlay} />
            </div>

            <div className={styles.heroTitleWrap}>
              <motion.h1
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className={styles.heroTitle}
              >
                APARTMENTS
              </motion.h1>
            </div>

            <div className={styles.heroContent}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className={styles.searchWrapper}
              >
                <div className={`${styles.searchPill} ${homeStyles.liquidGlass}`}>
                  <Link href="/search?focus=region" className={styles.searchItem}>
                    <span className={styles.searchLabel}>Location</span>
                    <span className={styles.searchVal}>Where to?</span>
                  </Link>
                  <Link href="/search?focus=dates" className={styles.searchItem}>
                    <span className={styles.searchLabel}>Check in</span>
                    <span className={styles.searchVal}>Add dates</span>
                  </Link>
                  <Link href="/search?focus=guests" className={styles.searchItem}>
                    <span className={styles.searchLabel}>Guests</span>
                    <span className={styles.searchVal}>Add visitors</span>
                  </Link>
                  <Link href="/search" className={styles.searchBtn} aria-label="Search">
                    <Search size={20} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className={`container ${styles.listingSection}`}>
          <div className={styles.headerWithToggle}>
            <h2>Featured Apartments</h2>
            <button
              type="button"
              className={styles.mapToggle}
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
          
          {showMap && (
            <div className={styles.mapContainer}>
              <p>Map view coming soon...</p>
            </div>
          )}

          <div className={styles.grid}>
            {liveListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 1 }}
                className={styles.card}
              >
                <div className={styles.imgWrapper} onClick={() => setExpandedId(listing.id)}>
                  <Image src={listing.images?.[0] || listing.img} alt={listing.title} fill className={styles.img} />
                  <div className={styles.priceTag}>₾{listing.price}</div>
                </div>
                <div className={styles.info}>
                  <h3>{listing.title}</h3>
                  <div className={styles.meta}>
                    <span>{listing.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="currentColor" /> {listing.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
