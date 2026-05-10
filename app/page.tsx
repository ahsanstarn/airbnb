'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, X, ArrowRight, Star, MapPin } from 'lucide-react';
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

const trendingDestinations = [
  { id: 1, name: 'Svaneti', properties: 124, img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=800&fit=crop' },
  { id: 2, name: 'Kazbegi', properties: 86, img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=800&fit=crop' },
  { id: 3, name: 'Kakheti', properties: 210, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=800&fit=crop' },
  { id: 4, name: 'Batumi', properties: 342, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=800&fit=crop' },
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

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Smooth Cursor
  const cursorX = useSpring(0, { stiffness: 500, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 50 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveListings, setLiveListings] = useState<any[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

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

  const getExpandedImg = () => {
    if (expandedId === null) return null;
    const listing = liveListings.find(l => l.id === expandedId);
    return listing?.images?.[0] || listing?.img || null;
  };

  return (
    <>
      <Navbar />

      {/* CUSTOM LIQUID CURSOR */}
      <motion.div 
        className={styles.customCursor}
        style={{ x: cursorX, y: cursorY }}
      />

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
              <Image src={getExpandedImg() || ''} alt="Expanded" width={1200} height={1200} className={styles.expandedImg} priority />
              <button className={styles.closeBtn} onClick={() => setExpandedId(null)}><X size={28}/></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={styles.main}>
        {/* === ULTIMATE LIQUID HERO === */}
        <section className={styles.hero}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className={styles.heroBg}>
            <Image src="/hero.png" alt="Background" fill priority className={styles.heroImg} />
            
            <motion.div 
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
              className={styles.behindText}
            >
              <h1 className={styles.heroTitle}>GEORGIA</h1>
            </motion.div>

            <div className={styles.heroOverlay}></div>
          </motion.div>

          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className={styles.heroHeaders}
            >
              <span className={styles.heroTag}>Sakartvelo Unveiled</span>
              <h2 className={styles.heroSubTitle}>Explore the soul of the Caucasus</h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.2 }}
              className={styles.searchWrapper}
            >
              <div className={`${styles.searchPill} ${styles.liquidGlass}`}>
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
                  <Search size={24} />
                </button>
              </div>
            </motion.div>

            <div className={styles.hotspots}>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={`hot${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.2, type: 'spring' }}
                  className={`${styles.hotspot} ${styles[`hot${i}`]} ${styles.liquidGlass}`}
                >
                  <MapPin size={20} />
                  <div className={styles.pulse}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Destinations */}
        <section className={styles.trendingSection}>
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.sectionHeader}
            >
              <h2 className={styles.sectionTitle}>Trending Destinations</h2>
              <button className={styles.viewAll}>View All <ArrowRight size={18}/></button>
            </motion.div>

            <div className={styles.trendingScroll}>
              {trendingDestinations.map((dest, i) => (
                <motion.div 
                  key={dest.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className={`${styles.destCard} ${styles.liquidGlassCard}`}
                >
                  <div className={styles.destImg}>
                    <Image src={dest.img} alt={dest.name} fill className={styles.img} />
                    <div className={styles.destOverlay}>
                      <h3>{dest.name}</h3>
                      <span>{dest.properties} Properties</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className={styles.catSection}>
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${styles.catGrid} ${styles.liquidGlass}`}
            >
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
            </motion.div>
          </div>
        </section>

        {/* Listing Grid */}
        <section className={`container ${styles.listingSection}`}>
          <div className={styles.grid}>
            {liveListings.map((listing, i) => (
              <motion.div 
                key={listing.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 3) * 0.1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
                className={styles.card}
              >
                <motion.div layoutId={listing.id.toString()} className={styles.imgWrapper} onClick={() => setExpandedId(listing.id)}>
                  <Image src={listing.images?.[0] || listing.img} alt={listing.title} fill className={styles.img} />
                  <div className={styles.priceTag}>₾{listing.price}</div>
                </motion.div>
                <div className={styles.info}>
                  <div className={styles.cardHeader}>
                    <h3>{listing.title}</h3>
                    <div className={styles.rating}><Star size={14} fill="currentColor" /> {listing.rating}</div>
                  </div>
                  <span className={styles.loc}>📍 {listing.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Immersive Experience Banner */}
        <section className={styles.experienceBanner}>
          <div className={styles.expBg}>
            <Image src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1600&h=800&fit=crop" alt="Experience" fill className={styles.img} />
            <div className={styles.expOverlay}></div>
          </div>
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${styles.expContent} ${styles.liquidGlassCard}`}
            >
              <h2>Unforgettable Moments</h2>
              <p>Discover unique experiences curated by locals, from mountain treks to ancient wine tastings.</p>
              <button className={styles.expBtn}>Explore Sakartvelo</button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
