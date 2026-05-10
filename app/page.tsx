'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  { id: 1, title: 'Panoramic Suite with city views', location: 'Tbilisi, Vera', price: 280, rating: 4.96, badge: 'Guest favorite', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop', dates: 'Jun 1–6' },
  { id: 2, title: 'Wine Country Villa with vineyard', location: 'Kakheti, Sighnaghi', price: 150, rating: 4.89, badge: null, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=500&fit=crop', dates: 'Jun 8–13' },
  { id: 3, title: 'Modern seaside apartment', location: 'Batumi, Boulevard', price: 95, rating: 4.72, badge: null, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=500&fit=crop', dates: 'Jun 15–20' },
  { id: 4, title: 'Mountain lodge with Kazbek views', location: 'Kazbegi, Stepantsminda', price: 120, rating: 4.93, badge: 'Guest favorite', img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=500&fit=crop', dates: 'Jun 5–10' },
  { id: 5, title: 'Cozy Old Town guesthouse', location: 'Tbilisi, Abanotubani', price: 65, rating: 4.85, badge: null, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=500&fit=crop', dates: 'Jun 10–15' },
  { id: 6, title: 'Boutique hotel on Rustaveli', location: 'Tbilisi, Rustaveli', price: 195, rating: 4.91, badge: null, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=500&fit=crop', dates: 'Jun 3–8' },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(`.${styles.reveal}`).forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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
        const { data, error } = await supabase.from('listings').select('*').limit(8);
        if (!error && data && data.length > 0) setLiveListings(data);
        else setLiveListings(listings);
      } catch { setLiveListings(listings); }
    }
    fetchListings();
  }, []);

  const handleFeatureClick = (title: string) => {
    if (title === 'Trip Mood Planner') router.push('/chat');
    else if (title === 'Georgian Table') router.push('/search?cat=restaurants');
    else alert(`Feature "${title}" is coming soon! Our team in Tbilisi is working on it.`);
  };

  return (
    <>
      <Navbar />
      
      <main className={styles.mainContainer}>
        {/* === HERO SECTION === */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image 
              src="/hero.png" 
              alt="Tbilisi Sunset" 
              fill 
              priority
              className={styles.heroImg}
            />
            <div className={styles.heroOverlay}></div>
            <div className={styles.cloudMask}></div>
          </div>

          <div className={`container ${styles.heroContent}`}>
            <div className={styles.heroTitleWrap}>
              <h1 className={styles.heroTitle}>WELCOME TO GEORGIA</h1>
            </div>
            
            <div className={styles.heroCenter}>
              <div className={styles.heroText}>
                <span className={styles.heroLabel}>Discover Sakartvelo</span>
                <p className={styles.heroDesc}>
                  Discover Georgia&apos;s best places to stay and visit. 
                  Find suitable ones for you and your family.
                </p>
              </div>

              <div className={styles.hotspots}>
                <div className={`${styles.hotspot} ${styles.hot1}`}>
                  <div className={styles.hotspotCircle}>
                    <Image src="/hotspot.png" alt="Caucasus" fill priority />
                  </div>
                </div>
                <div className={`${styles.hotspot} ${styles.hot2}`}>
                  <div className={styles.hotspotCircle}>
                    <Image src="/hotspot.png" alt="Kakheti" fill priority />
                  </div>
                </div>
                <div className={`${styles.hotspot} ${styles.hot3}`}>
                  <div className={styles.hotspotCircle}>
                    <Image src="/hotspot.png" alt="Batumi" fill priority />
                  </div>
                  <div className={styles.pulse}></div>
                </div>
              </div>
            </div>

            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <div className={styles.searchItem}>
                  <span className={styles.searchIcon}>📍</span>
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Georgia</span>
                    <span className={styles.searchSub}>Choose destination</span>
                  </div>
                </div>
                <div className={styles.searchDivider}></div>
                <div className={styles.searchItem}>
                  <span className={styles.searchIcon}>📅</span>
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Check in</span>
                    <span className={styles.searchSub}>Add date</span>
                  </div>
                </div>
                <div className={styles.searchDivider}></div>
                <div className={styles.searchItem}>
                  <span className={styles.searchIcon}>📅</span>
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Check out</span>
                    <span className={styles.searchSub}>Add date</span>
                  </div>
                </div>
                <div className={styles.searchDivider}></div>
                <div className={styles.searchItem}>
                  <span className={styles.searchIcon}>👥</span>
                  <div className={styles.searchLabels}>
                    <span className={styles.searchTitle}>Visitors</span>
                    <span className={styles.searchSub}>Add guests</span>
                  </div>
                </div>
                <button className={styles.searchBtn} onClick={() => router.push('/search')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
              </div>
            </div>
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
        <section className={`container ${styles.recommended} ${styles.reveal}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.serifTitle}>Recommended Places to Stay</h2>
            <Link href="/search" className={styles.seeAllBtn}>See All</Link>
          </div>

          <div className={styles.grid}>
            {liveListings
              .filter((listing) => {
                if (activeCat === 'all') return true;
                const categoryMap: Record<string, string[]> = {
                  hotels: ['hotel', 'lodge', 'suite', 'resort', 'stay'],
                  apartments: ['apartment', 'flat', 'studio', 'condo', 'loft'],
                  guesthouses: ['guesthouse', 'villa', 'house', 'cottage', 'cabin'],
                };
                const keywords = categoryMap[activeCat] || [activeCat];
                return keywords.some(kw => listing.type?.toLowerCase().includes(kw) || listing.title?.toLowerCase().includes(kw));
              })
              .map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`} className={`${styles.card} ${styles.reveal}`}>
                <div className={styles.cardImageWrap}>
                  <Image src={listing.images?.[0] || listing.img} alt={listing.title} fill className={styles.cardImage} />
                  <div className={styles.cardPriceTag}>
                    ₾{listing.price} <span className={styles.cardPriceUnit}>/ night</span>
                  </div>
                  <button className={styles.cardFav} onClick={(e) => toggleSave(e, listing.id)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={savedListings.includes(listing.id) ? "var(--accent)" : "rgba(255,255,255,0.3)"} stroke="white" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardLocation}>📍 {listing.location}</span>
                    <span className={styles.cardRating}>★ {listing.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Unique Features */}
        <section className={`container ${styles.features} ${styles.reveal}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.serifTitle}>Only on Kaya</h2>
            <p className={styles.sectionSubtitle}>Four features you won&apos;t find anywhere else</p>
          </div>
          <div className={styles.featuresGrid}>
            {uniqueFeatures.map((feat) => (
              <div key={feat.title} className={`${styles.featureCard} ${styles.reveal}`} onClick={() => handleFeatureClick(feat.title)}>
                <span className={styles.featureIcon}>{feat.icon}</span>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureDesc}>{feat.desc}</p>
                <span className={styles.featureTag}>{feat.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* AI Banner */}
        <section className={`container ${styles.aiSection} ${styles.reveal}`}>
          <div className={styles.aiBanner}>
            <div className={styles.aiContent}>
              <span className={styles.aiLabel}>AI Travel Assistant</span>
              <h2 className={styles.serifTitle}>Meet KLARA</h2>
              <p className={styles.aiDesc}>Your AI travel companion who knows Georgia inside out. Ask about hotels, hidden gems, weather, or culture.</p>
              <Link href="/chat" className={styles.aiBtn}>Start Chatting</Link>
            </div>
            <div className={styles.aiVisual}>
              <div className={styles.aiChatBox}>
                <div className={styles.aiMsg}>&quot;Find me a wine cellar in Kakheti...&quot;</div>
                <div className={`${styles.aiMsg} ${styles.aiReply}`}>&quot;I found 3 verified wineries with tasting rooms nearby.&quot;</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`container ${styles.cta} ${styles.reveal}`}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>List your property on Kaya</h2>
            <p className={styles.ctaDesc}>Join Georgia&apos;s fastest-growing travel marketplace. Flat ₾20/month — no commissions.</p>
            <Link href="/login" className={styles.ctaBtn}>Get started</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
