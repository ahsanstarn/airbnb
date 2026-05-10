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

const trendingDestinations = [
  { id: 'dest1', name: 'Svaneti', count: '124 places', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&h=800&fit=crop' },
  { id: 'dest2', name: 'Kazbegi', count: '89 places', img: 'https://images.unsplash.com/photo-1527269537047-44f103001c4a?w=800&h=600&fit=crop' },
  { id: 'dest3', name: 'Batumi', count: '256 places', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop' },
  { id: 'dest4', name: 'Tbilisi', count: '512 places', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop' },
];

const listings = [
  { id: 1, title: 'Panoramic Suite with city views', location: 'Tbilisi, Vera', price: 280, rating: 4.96, img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop' },
  { id: 2, title: 'Wine Country Villa with vineyard', location: 'Kakheti, Sighnaghi', price: 150, rating: 4.89, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=500&fit=crop' },
  { id: 3, title: 'Modern seaside apartment', location: 'Batumi, Boulevard', price: 95, rating: 4.72, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=500&fit=crop' },
  { id: 4, title: 'Mountain lodge with Kazbek views', location: 'Kazbegi, Stepantsminda', price: 120, rating: 4.93, img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=500&fit=crop' },
];

export default function HomePage() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('all');
  const [savedListings, setSavedListings] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setSavedListings(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveListings, setLiveListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase.from('listings').select('*').limit(4);
        if (!error && data && data.length > 0) setLiveListings(data);
        else setLiveListings(listings);
      } catch { setLiveListings(listings); }
    }
    fetchListings();
  }, []);

  const getExpandedImg = () => {
    if (!expandedId) return null;
    const trending = trendingDestinations.find(d => d.id === expandedId);
    if (trending) return trending.img;
    
    if (typeof expandedId === 'string') {
      if (expandedId === 'hot1') return 'https://images.unsplash.com/photo-1527269537047-44f103001c4a?w=1200&h=800&fit=crop';
      if (expandedId === 'hot2') return 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&h=800&fit=crop';
      if (expandedId === 'hot3') return 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop';
    }
    const listing = liveListings.find(l => l.id === expandedId);
    return listing?.images?.[0] || listing?.img || null;
  };

  return (
    <>
      <Navbar />

      <AnimatePresence>
        {expandedId && (
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
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Image 
                src={getExpandedImg() || ''} 
                alt="Expanded" 
                width={1200} 
                height={800} 
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
        <Map size={20} />
        <span>Show Map</span>
      </motion.div>
      
      <main className={styles.mainContainer}>
        {/* === HERO SECTION === */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image src="/hero.png" alt="Tbilisi Sunset" fill priority className={styles.heroImg} />
            <div className={styles.heroOverlay}></div>
            <div className={styles.cloudMask}></div>
          </div>

          <div className={`container ${styles.heroContent}`}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className={styles.heroTitleWrap}
            >
              <h1 className={styles.heroTitle}>EXPLORE SAKARTVELO</h1>
            </motion.div>
            
            <div className={styles.heroCenter}>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className={styles.heroText}
              >
                <span className={styles.heroLabel}>Welcome Home</span>
                <p className={styles.heroDesc}>
                  Discover Georgia&apos;s hidden gems, from high peaks to ancient vineyards.
                </p>
              </motion.div>

              <div className={styles.hotspots}>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={`hot${i}`}
                    layoutId={`hot${i}`}
                    className={`${styles.hotspot} ${styles[`hot${i}`]}`}
                    onClick={() => setExpandedId(`hot${i}`)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
                  >
                    <div className={styles.hotspotCircle}>
                      <Image src="/hotspot.png" alt={`Location ${i}`} fill />
                    </div>
                    {i === 3 && <div className={styles.pulse}></div>}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className={styles.searchContainer}
            >
              <div className={styles.searchBar}>
                <div className={styles.searchItem}>
                  <MapPin size={24} className={styles.searchIcon} />
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Where to?</span>
                    <span className={styles.searchSub}>Explore destinations</span>
                  </div>
                </div>
                <div className={styles.searchDivider}></div>
                <div className={styles.searchItem}>
                  <Calendar size={24} className={styles.searchIcon} />
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Dates</span>
                    <span className={styles.searchSub}>Add when</span>
                  </div>
                </div>
                <div className={styles.searchDivider}></div>
                <div className={styles.searchItem}>
                  <Users size={24} className={styles.searchIcon} />
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Who</span>
                    <span className={styles.searchSub}>Add guests</span>
                  </div>
                </div>
                <button className={styles.searchBtn} onClick={() => router.push('/search')}>
                  <Search size={28} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trending Destinations */}
        <section className={`container ${styles.trending}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.serifTitle}>Trending Now</h2>
            <p className={styles.sectionSubtitle}>Most searched regions this week</p>
          </div>
          <div className={styles.trendingGrid}>
            {trendingDestinations.map((dest, idx) => (
              <motion.div 
                key={dest.id} 
                layoutId={dest.id}
                className={`${styles.destCard} ${styles[`dest${idx + 1}`]}`}
                onClick={() => setExpandedId(dest.id)}
                whileHover={{ y: -5 }}
              >
                <Image src={dest.img} alt={dest.name} fill className={styles.destImage} />
                <div className={styles.destOverlay}>
                  <h3 className={styles.destTitle}>{dest.name}</h3>
                  <span className={styles.destCount}>{dest.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Category Bar */}
        <div className={`${styles.catBar} ${scrolled ? styles.catBarScrolled : ''}`}>
          <div className={`container ${styles.catBarInner}`}>
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

        {/* === RECOMMENDED SECTION === */}
        <section className={`container ${styles.recommended}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.serifTitle}>Recommended Stays</h2>
            <Link href="/search" className={styles.seeAllBtn}>See All</Link>
          </div>

          <div className={styles.grid}>
            {liveListings.map((listing) => (
              <motion.div key={listing.id} className={styles.card} whileHover={{ y: -10 }}>
                <motion.div 
                  layoutId={listing.id.toString()}
                  className={styles.cardImageWrap} 
                  onClick={() => setExpandedId(listing.id)}
                >
                  <Image src={listing.images?.[0] || listing.img} alt={listing.title} fill className={styles.cardImage} />
                  <div className={styles.cardPriceTag}>
                    ₾{listing.price} <span className={styles.cardPriceUnit}>/ night</span>
                  </div>
                  <button className={styles.cardFav} onClick={(e) => toggleSave(e, listing.id)}>
                    <Heart size={20} fill={savedListings.includes(listing.id) ? "var(--accent)" : "rgba(0,0,0,0.1)"} />
                  </button>
                </motion.div>
                <Link href={`/listing/${listing.id}`} className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardLocation}>📍 {listing.location}</span>
                    <span className={styles.cardRating}>★ {listing.rating}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Banner */}
        <section className={`container ${styles.aiSection}`}>
          <div className={styles.aiBanner}>
            <div className={styles.aiContent}>
              <span className={styles.aiLabel}>AI Companion</span>
              <h2 className={styles.serifTitle}>Meet KLARA</h2>
              <p className={styles.aiDesc}>Your AI travel partner for Georgia.</p>
              <Link href="/chat" className={styles.aiBtn}>Chat Now</Link>
            </div>
            <div className={styles.aiVisual}>
              <div className={styles.aiChatBox}>
                <div className={styles.aiMsg}>&quot;Find me a wine cellar...&quot;</div>
                <div className={`${styles.aiMsg} ${styles.aiReply}`}>&quot;I found 3 verified cellars.&quot;</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`container ${styles.cta}`}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>List on Kaya</h2>
            <p className={styles.ctaDesc}>Flat ₾20/month — no commissions.</p>
            <Link href="/login" className={styles.ctaBtn}>Get started</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
