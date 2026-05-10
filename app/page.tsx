'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Calendar, Search, X, Heart } from 'lucide-react';
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
  { id: 'experiences', icon: '🎭', label: 'Experiences' },
];

const listings = [
  { id: 1, title: 'Panoramic Suite with city views', location: 'Tbilisi, Vera', price: 280, rating: 4.96, img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop' },
  { id: 2, title: 'Wine Country Villa with vineyard', location: 'Kakheti, Sighnaghi', price: 150, rating: 4.89, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=500&fit=crop' },
  { id: 3, title: 'Modern seaside apartment', location: 'Batumi, Boulevard', price: 95, rating: 4.72, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=500&fit=crop' },
  { id: 4, title: 'Mountain lodge with Kazbek views', location: 'Kazbegi, Stepantsminda', price: 120, rating: 4.93, img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=500&fit=crop' },
  { id: 5, title: 'Cozy Old Town guesthouse', location: 'Tbilisi, Abanotubani', price: 65, rating: 4.85, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=500&fit=crop' },
  { id: 6, title: 'Boutique hotel on Rustaveli', location: 'Tbilisi, Rustaveli', price: 195, rating: 4.91, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=500&fit=crop' },
];

const uniqueFeatures = [
  { icon: '⚡', title: 'Georgian Moment', desc: 'Last-minute authentic micro-experiences bookable within 24 hours.', tag: 'Only on Kaya' },
  { icon: '🤝', title: 'Kaya Connect', desc: 'Book a verified local as your city buddy who shows you real Georgia.', tag: 'Unique' },
  { icon: '🎭', title: 'Trip Mood Planner', desc: "AI builds your perfect itinerary from real listings based on your mood.", tag: 'AI Powered' },
  { icon: '🍽️', title: 'Georgian Table', desc: 'Join a real Georgian family supra feast at their home.', tag: 'World First' },
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

  const [liveListings, setLiveListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase.from('listings').select('*').limit(8);
        if (!error && data && data.length > 0) setLiveListings(data);
        else setLiveListings(listings);
      } catch { setLiveListings(listings); }
    }
    fetchListings();
  }, []);

  const getExpandedImg = () => {
    if (!expandedId) return null;
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
                  Discover Georgia&apos;s hidden gems, from the high peaks of Svaneti to the vineyards of Kakheti.
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
                    <span className={styles.searchTitle}>Destination</span>
                    <span className={styles.searchSub}>Where are you going?</span>
                  </div>
                </div>
                <div className={styles.searchDivider}></div>
                <div className={styles.searchItem}>
                  <Calendar size={24} className={styles.searchIcon} />
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Arrival</span>
                    <span className={styles.searchSub}>Add date</span>
                  </div>
                </div>
                <div className={styles.searchDivider}></div>
                <div className={styles.searchItem}>
                  <Users size={24} className={styles.searchIcon} />
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Guests</span>
                    <span className={styles.searchSub}>Add visitors</span>
                  </div>
                </div>
                <button className={styles.searchBtn} onClick={() => router.push('/search')}>
                  <Search size={28} />
                </button>
              </div>
            </motion.div>
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
            <h2 className={styles.serifTitle}>Recommended Places</h2>
            <Link href="/search" className={styles.seeAllBtn}>See All</Link>
          </div>

          <div className={styles.grid}>
            {liveListings
              .filter((listing) => {
                if (activeCat === 'all') return true;
                const keywords = (activeCat === 'hotels') ? ['hotel', 'stay'] : [activeCat];
                return keywords.some(kw => listing.title?.toLowerCase().includes(kw));
              })
              .map((listing) => (
              <motion.div 
                key={listing.id} 
                className={styles.card}
                whileHover={{ y: -10 }}
              >
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
              <span className={styles.aiLabel}>AI Assistant</span>
              <h2 className={styles.serifTitle}>Meet KLARA</h2>
              <p className={styles.aiDesc}>Your AI travel companion who knows Georgia inside out.</p>
              <Link href="/chat" className={styles.aiBtn}>Chat Now</Link>
            </div>
            <div className={styles.aiVisual}>
              <div className={styles.aiChatBox}>
                <div className={styles.aiMsg}>&quot;Find me a wine cellar in Kakheti...&quot;</div>
                <div className={`${styles.aiMsg} ${styles.aiReply}`}>&quot;I found 3 verified wineries nearby.&quot;</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`container ${styles.cta}`}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>List your property on Kaya</h2>
            <p className={styles.ctaDesc}>Join Georgia&apos;s fastest-growing marketplace.</p>
            <Link href="/login" className={styles.ctaBtn}>Get started</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
