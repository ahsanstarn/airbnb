'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import styles from './page.module.css';

const categories = [
  { id: 'all', icon: '✦', label: 'All' },
  { id: 'hotels', icon: '🏨', label: 'Hotels' },
  { id: 'apartments', icon: '🏢', label: 'Apartments' },
  { id: 'experiences', icon: '🏔️', label: 'Experiences' },
  { id: 'wineries', icon: '🍷', label: 'Wineries' },
  { id: 'cars', icon: '🚗', label: 'Cars' },
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
  
  // Real Liquid Glass Tracking
  const glassRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!glassRef.current) return;
    const rect = glassRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glassRef.current.style.setProperty('--x', `${x}%`);
    glassRef.current.style.setProperty('--y', `${y}%`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveListings, setLiveListings] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const { data, error } = await supabase.from('listings').select('*').limit(12);
        if (!error && data && data.length > 0) setLiveListings(data);
        else setLiveListings(listings);
      } catch { setLiveListings(listings); }
    }
    init();
  }, []);

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
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Image 
                src={(liveListings.find(l => l.id === expandedId) as any)?.images?.[0] || (liveListings.find(l => l.id === expandedId) as any)?.img || ''} 
                alt="Expanded" width={1200} height={1200} className={styles.expandedImg} priority 
              />
              <button className={styles.closeBtn} onClick={() => setExpandedId(null)}><X size={28}/></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={styles.main}>
        {/* === THE REAL LIQUID GLASS HERO === */}
        <section className={styles.hero} onMouseMove={handleMouseMove}>
          <div ref={glassRef} className={styles.heroCard}>
            <div className={styles.heroBg}>
              <Image src="/hero.png" alt="Background" fill priority className={styles.heroImg} />
              <div className={styles.heroOverlay}></div>
            </div>

            <div className={styles.heroTitleWrap}>
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className={styles.heroTitle}
              >
                EXPLORE<br/>GEORGIA
              </motion.h1>
            </div>

            <div className={styles.heroContent}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className={styles.searchWrapper}
              >
                <div className={`${styles.searchPill} ${styles.liquidGlass}`}>
                  <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>Location</span>
                    <span className={styles.searchVal}>Where to?</span>
                  </div>
                  <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>Check in</span>
                    <span className={styles.searchVal}>Add dates</span>
                  </div>
                  <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>Guests</span>
                    <span className={styles.searchVal}>Add visitors</span>
                  </div>
                  <button className={styles.searchBtn} onClick={() => router.push('/search')}>
                    <Search size={24} />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Perfect Hotspots */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className={styles.hotspots}
            >
              <div className={`${styles.hotspot} ${styles.liquidGlass}`} style={{ top: '35%', left: '25%' }}>
                <MapPin size={20} />
                <div className={styles.pulse}></div>
              </div>
              <div className={`${styles.hotspot} ${styles.liquidGlass}`} style={{ top: '48%', right: '18%' }}>
                <MapPin size={20} />
                <div className={styles.pulse}></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className={styles.catSection}>
          <div className="container">
            <div className={`${styles.catGrid} ${styles.liquidGlass}`}>
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

        {/* Grid */}
        <section className={`container ${styles.listingSection}`}>
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
                <motion.div layoutId={listing.id.toString()} className={styles.imgWrapper} onClick={() => setExpandedId(listing.id)}>
                  <Image src={listing.images?.[0] || listing.img} alt={listing.title} fill className={styles.img} />
                  <div className={styles.priceTag}>₾{listing.price}</div>
                </motion.div>
                <div className={styles.info}>
                  <h3>{listing.title}</h3>
                  <div className={styles.meta}>
                    <span>📍 {listing.location}</span>
                    <span>★ {listing.rating}</span>
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
