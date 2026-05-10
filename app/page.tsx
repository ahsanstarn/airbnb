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
  { id: 'beauty', icon: '💆', label: 'Beauty' },
  { id: 'spas', icon: '♨️', label: 'Spas' },
  { id: 'photographers', icon: '📸', label: 'Photographers' },
  { id: 'chefs', icon: '👨‍🍳', label: 'Private Chefs' },
  { id: 'transport', icon: '🚐', label: 'Transport' },
];

const listings = [
  { id: 1, title: 'Panoramic Suite with city views', location: 'Tbilisi, Vera', price: 280, rating: 4.96, badge: 'Guest favorite', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop', dates: 'Jun 1–6' },
  { id: 2, title: 'Wine Country Villa with vineyard', location: 'Kakheti, Sighnaghi', price: 150, rating: 4.89, badge: null, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=500&fit=crop', dates: 'Jun 8–13' },
  { id: 3, title: 'Modern seaside apartment', location: 'Batumi, Boulevard', price: 95, rating: 4.72, badge: null, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=500&fit=crop', dates: 'Jun 15–20' },
  { id: 4, title: 'Mountain lodge with Kazbek views', location: 'Kazbegi, Stepantsminda', price: 120, rating: 4.93, badge: 'Guest favorite', img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=500&fit=crop', dates: 'Jun 5–10' },
  { id: 5, title: 'Cozy Old Town guesthouse', location: 'Tbilisi, Abanotubani', price: 65, rating: 4.85, badge: null, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=500&fit=crop', dates: 'Jun 10–15' },
  { id: 6, title: 'Boutique hotel on Rustaveli', location: 'Tbilisi, Rustaveli', price: 195, rating: 4.91, badge: null, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=500&fit=crop', dates: 'Jun 3–8' },
  { id: 7, title: 'Traditional Svanetian tower house', location: 'Mestia, Svaneti', price: 85, rating: 4.88, badge: 'Guest favorite', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=500&fit=crop', dates: 'Jun 20–25' },
  { id: 8, title: 'Beachfront flat with pool', location: 'Batumi, New Boulevard', price: 110, rating: 4.77, badge: null, img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=500&fit=crop', dates: 'Jun 12–17' },
];

const uniqueFeatures = [
  { icon: '⚡', title: 'Georgian Moment', desc: 'Last-minute authentic micro-experiences bookable within 24 hours. Cooking lessons, wine tastings, farm visits.', tag: 'Only on Kaya' },
  { icon: '🤝', title: 'Kaya Connect', desc: 'Book a verified local as your city buddy — not a tour guide, a genuine friend who shows you real Georgia.', tag: 'Unique' },
  { icon: '🎭', title: 'Trip Mood Planner', desc: "Choose how you want to feel. Adventurous? Romantic? AI builds your perfect itinerary from real listings.", tag: 'AI Powered' },
  { icon: '🍽️', title: 'Georgian Table', desc: 'Join a real Georgian family supra feast at their home. Book individual seats at traditional gatherings.', tag: 'World First' },
];

export default function HomePage() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('all');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveListings, setLiveListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .limit(8);
        
        if (!error && data && data.length > 0) {
          setLiveListings(data);
        } else {
          setLiveListings(listings); // Fallback to mock
        }
      } catch {
        setLiveListings(listings); // Fallback to mock
      }
    }
    fetchListings();
  }, []);

  return (
    <>
      <Navbar />

      {/* Category Bar */}
      <div className={styles.catBar}>
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
          <button className={styles.filtersBtn} onClick={() => router.push('/search')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
              <circle cx="6" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="18" r="2" fill="currentColor"/>
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Listing Grid */}
      <main className={`${styles.main} container`}>
        <div className={styles.grid}>
          {liveListings
            .filter((listing) => {
              if (activeCat === 'all') return true;
              // Map categories to types/keywords loosely for demonstration
              const categoryMap: Record<string, string[]> = {
                hotels: ['hotel', 'lodge', 'suite', 'resort', 'stay'],
                apartments: ['apartment', 'flat', 'studio', 'condo', 'loft'],
                guesthouses: ['guesthouse', 'villa', 'house', 'cottage', 'cabin'],
                restaurants: ['restaurant', 'cafe', 'dining', 'food', 'supper', 'feast'],
                wineries: ['wine', 'vineyard', 'cellar', 'degustation'],
                cars: ['car', 'rental', 'drive', 'auto', 'vehicle'],
                tours: ['tour', 'guide', 'trip', 'hiking', 'explore'],
                experiences: ['experience', 'unique', 'lesson', 'class', 'activity'],
                beauty: ['beauty', 'salon', 'hair', 'makeup', 'nails'],
                spas: ['spa', 'wellness', 'massage', 'sauna', 'bath', 'relax'],
                photographers: ['photo', 'camera', 'shoot', 'video'],
                chefs: ['chef', 'cook', 'kitchen', 'meal', 'suva'],
                transport: ['transport', 'shuttle', 'bus', 'van', 'airport', 'transfer'],
              };
              const keywords = categoryMap[activeCat] || [activeCat];
              return keywords.some(kw => 
                listing.type?.toLowerCase().includes(kw) || 
                listing.title?.toLowerCase().includes(kw)
              );
            })
            .map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className={styles.card}>
              <div className={styles.cardImageWrap}>
                <Image
                  src={listing.images?.[0] || listing.img || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop'}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={styles.cardImage}
                />
                {listing.badge && (
                  <span className={styles.cardBadge}>{listing.badge}</span>
                )}
                <button className={styles.cardFav} aria-label="Save" onClick={(e) => e.preventDefault()}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.5)" stroke="white" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>
              </div>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{listing.title}</h3>
                <span className={styles.cardRating}>
                  <span className={styles.cardStar}>★</span> {listing.rating}
                </span>
              </div>
              <p className={styles.cardLocation}>{listing.location}</p>
              <p className={styles.cardDates}>{listing.dates}</p>
              <div className={styles.cardPrice}>
                <span className={styles.cardPriceValue}>₾{listing.price}</span>
                <span className={styles.cardPriceUnit}> / night</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <div className="container"><hr className="divider" /></div>

      {/* Unique Features */}
      <section className={`${styles.features} container`}>
        <div className={styles.featuresHeader}>
          <h2 className="section-title">Only on Kaya</h2>
          <p className="section-subtitle">Four features you won&apos;t find anywhere else</p>
        </div>
        <div className={styles.featuresGrid}>
          {uniqueFeatures.map((feat) => (
            <div key={feat.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{feat.icon}</span>
              <h3 className={styles.featureTitle}>{feat.title}</h3>
              <p className={styles.featureDesc}>{feat.desc}</p>
              <span className={styles.featureTag}>{feat.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="container"><hr className="divider" /></div>

      {/* AI Banner */}
      <section className={`${styles.aiBanner} container`}>
        <div className={styles.aiBannerInner}>
          <div className={styles.aiContent}>
            <p className={styles.aiLabel}>AI Travel Assistant</p>
            <h2 className={styles.aiTitle}>
              Meet <span className={styles.aiTitleHighlight}>KLARA</span>
            </h2>
            <p className={styles.aiDesc}>
              Your AI travel companion who knows Georgia inside out. Ask about
              hotels, hidden gems, weather, or culture — KLARA plans your perfect trip.
            </p>
            <div className={styles.aiTags}>
              <Link href="/chat" className={styles.aiTag} style={{textDecoration: 'none'}}>🏨 Hotels</Link>
              <Link href="/chat" className={styles.aiTag} style={{textDecoration: 'none'}}>🗺️ Itineraries</Link>
              <Link href="/chat" className={styles.aiTag} style={{textDecoration: 'none'}}>🌤️ Weather</Link>
              <Link href="/chat" className={styles.aiTag} style={{textDecoration: 'none'}}>🍷 Local tips</Link>
            </div>
            <Link href="/chat" className="btn btn-primary btn-lg">
              Chat with KLARA
            </Link>
          </div>
          <div className={styles.aiDemo}>
            <div className={styles.aiChat}>
              <div className={styles.aiChatTop}>
                <span className={styles.aiOnline}></span>
                🤖 KLARA
              </div>
              <div className={styles.aiMessages}>
                <div className={styles.aiMsgUser}>
                  3 days in Tbilisi, love wine and hiking!
                </div>
                <div className={styles.aiMsgBot}>
                  <strong>Day 1:</strong> Old Tbilisi + sulfur baths<br/>
                  <strong>Day 2:</strong> Kakheti wine region<br/>
                  <strong>Day 3:</strong> Turtle Lake hike<br/><br/>
                  Want me to find hotels near the old town? 🏨
                </div>
              </div>
              <div className={styles.aiChatBottom}>
                <input type="text" placeholder="Ask KLARA anything..." readOnly />
                <button className={styles.aiSendBtn}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container"><hr className="divider" /></div>

      {/* CTA */}
      <section className={`${styles.cta} container`}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>List your property on Kaya</h2>
          <p className={styles.ctaDesc}>
            Join Georgia&apos;s fastest-growing travel marketplace.
            Flat ₾20/month — no commissions, no hidden fees.
          </p>
          <Link href="/login" className={styles.ctaBtn}>
            Get started
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
