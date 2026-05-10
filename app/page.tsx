'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Calendar, Search, X, Heart, Map } from 'lucide-react';
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
  const [savedListings, setSavedListings] = useState<number[]>([]);
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
            className={styles.imgModal} 
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
              <button className={styles.closeBtn} onClick={() => setExpandedId(null)}><X size={32}/></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className={styles.floatingMap}
        onClick={() => router.push('/search?view=map')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Map size={24} />
        <span>Show Map</span>
      </motion.div>
      
      <main className={styles.mainContainer}>
        {/* === HERO SECTION === */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image src="/hero.png" alt="Georgia" fill priority className={styles.heroImg} />
            <div className={styles.heroOverlay}></div>
          </div>

          <div className={styles.heroContent}>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className={styles.heroTitle}
            >
              EXPLORE<br/>GEORGIA
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className={styles.heroDesc}
            >
              Discover the most unique places to stay and experience across Sakartvelo.
            </motion.p>
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <div className={styles.searchItem}>
                <MapPin size={24} />
                <div className={styles.searchLabels}>
                  <span className={styles.searchTitle}>Destination</span>
                  <span className={styles.searchSub}>Where are you going?</span>
                </div>
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchItem}>
                <Calendar size={24} />
                <div className={styles.searchLabels}>
                  <span className={styles.searchTitle}>Check in</span>
                  <span className={styles.searchSub}>Add date</span>
                </div>
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchItem}>
                <Users size={24} />
                <div className={styles.searchLabels}>
                  <span className={styles.searchTitle}>Guests</span>
                  <span className={styles.searchSub}>Add visitors</span>
                </div>
              </div>
              <button className={styles.searchBtn} onClick={() => router.push('/search')}>
                <Search size={32} />
              </button>
            </div>
          </div>
        </section>

        {/* Category Bar */}
        <div className={styles.catBar}>
          <div className="container">
            <div className={styles.catScroll}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.catItem} ${activeCat === cat.id ? styles.catItemActive : ''}`}
                  onClick={() => setActiveCat(cat.id)}
                >
                  <span className={styles.catIcon}>{cat.icon}</span>
                  <span className={styles.catLabel}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* === GRID SECTION === */}
        <section className={`container ${styles.recommended}`}>
          <div className={styles.grid}>
            {liveListings.map((listing) => (
              <div key={listing.id} className={styles.card}>
                <motion.div 
                  layoutId={listing.id.toString()}
                  className={styles.cardImageWrap} 
                  onClick={() => setExpandedId(listing.id)}
                >
                  <Image 
                    src={listing.images?.[0] || listing.img} 
                    alt={listing.title} 
                    fill 
                    className={styles.cardImage} 
                  />
                  <div className={styles.cardPriceTag}>
                    ₾{listing.price}
                  </div>
                </motion.div>
                <div className={styles.cardContent}>
                  <h3>{listing.title}</h3>
                  <div className={styles.cardMeta}>
                    <span>{listing.location}</span>
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
