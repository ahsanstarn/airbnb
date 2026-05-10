'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import styles from './page.module.css';

const categories = [
  { id: 'all', icon: '✦', label: 'All' },
  { id: 'hotels', icon: '🏨', label: 'Hotels' },
  { id: 'apartments', icon: '🏢', label: 'Apartments' },
  { id: 'guesthouses', icon: '🏡', label: 'Guesthouses' },
  { id: 'restaurants', icon: '🍷', label: 'Restaurants' },
  { id: 'wineries', icon: '🍇', label: 'Wineries' },
  { id: 'cars', icon: '🚗', label: 'Cars' },
  { id: 'tours', icon: '🏔️', label: 'Tours' },
];

const listings = [
  { id: 1, title: 'Panoramic Suite Vera', location: 'Tbilisi, Georgia', price: 280, rating: 4.96, img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=800&fit=crop' },
  { id: 2, title: 'Wine Country Villa', location: 'Kakheti, Georgia', price: 150, rating: 4.89, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=800&fit=crop' },
  { id: 3, title: 'Modern Seaside Flat', location: 'Batumi, Georgia', price: 95, rating: 4.72, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=800&fit=crop' },
  { id: 4, title: 'Mountain Lodge Kazbek', location: 'Kazbegi, Georgia', price: 120, rating: 4.93, img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=800&fit=crop' },
  { id: 5, title: 'Old Town Guesthouse', location: 'Tbilisi, Georgia', price: 65, rating: 4.85, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=800&fit=crop' },
  { id: 6, title: 'Boutique Rustaveli', location: 'Tbilisi, Georgia', price: 195, rating: 4.91, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=800&fit=crop' },
];

export default function HomePage() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveListings, setLiveListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase.from('listings').select('*').limit(12);
        if (!error && data && data.length > 0) setLiveListings(data);
        else setLiveListings(listings);
      } catch { setLiveListings(listings); }
    }
    fetchListings();
  }, []);

  const getExpandedImg = () => {
    if (expandedId === null) return null;
    const listing = liveListings.find(l => l.id === expandedId);
    return listing?.images?.[0] || listing?.img || null;
  };

  return (
    <>
      <Navbar />

      <AnimatePresence>
        {expandedId !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modal} 
            onClick={() => setExpandedId(null)}
          >
            <motion.div 
              layoutId={expandedId.toString()}
              className={styles.modalContent}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
              <Image 
                src={getExpandedImg() || ''} 
                alt="Expanded" 
                width={1200} 
                height={1200} 
                className={styles.expandedImg} 
                priority
              />
              <button className={styles.closeBtn} onClick={() => setExpandedId(null)}><X size={28}/></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={styles.main}>
        {/* === TEMPLATE HERO === */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image src="/hero.png" alt="Background" fill priority className={styles.heroImg} />
            <div className={styles.heroOverlay}></div>
          </div>

          <div className={styles.heroContent}>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className={styles.heroTitle}
            >
              EXPLORE<br/>GEORGIA
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className={styles.heroSubtitle}
            >
              Find verified stays, local experiences, and hidden gems across Sakartvelo.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className={styles.searchWrapper}
            >
              <div className={styles.searchPill}>
                <div className={styles.searchItem}>
                  <span className={styles.searchLabel}>Destination</span>
                  <span className={styles.searchVal}>Where to?</span>
                </div>
                <div className={styles.searchItem}>
                  <span className={styles.searchLabel}>Date</span>
                  <span className={styles.searchVal}>Add when</span>
                </div>
                <div className={styles.searchItem}>
                  <span className={styles.searchLabel}>Guests</span>
                  <span className={styles.searchVal}>Add who</span>
                </div>
                <button className={styles.searchBtn} onClick={() => router.push('/search')}>
                  <Search size={28} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Bar */}
        <section className={styles.catSection}>
          <div className="container">
            <div className={styles.catGrid}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.catBtn} ${activeCat === cat.id ? styles.catBtnActive : ''}`}
                  onClick={() => setActiveCat(cat.id)}
                >
                  <span className={styles.catIcon}>{cat.icon}</span>
                  <span className={styles.catText}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Listing Grid */}
        <section className={`container ${styles.listingSection}`}>
          <div className={styles.grid}>
            {liveListings.map((listing) => (
              <div key={listing.id} className={styles.card}>
                <motion.div 
                  layoutId={listing.id.toString()}
                  className={styles.imgWrapper} 
                  onClick={() => setExpandedId(listing.id)}
                >
                  <Image 
                    src={listing.images?.[0] || listing.img} 
                    alt={listing.title} 
                    fill 
                    className={styles.img} 
                  />
                  <div className={styles.priceTag}>
                    ₾{listing.price}
                  </div>
                </motion.div>
                <div className={styles.info}>
                  <h3>{listing.title}</h3>
                  <div className={styles.meta}>
                    <span>📍 {listing.location}</span>
                    <span>★ {listing.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
