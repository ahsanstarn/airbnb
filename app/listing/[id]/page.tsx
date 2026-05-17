'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Map from '../../components/Map';
import styles from './listing.module.css';

function getToken() {
  return localStorage.getItem('kaya_token');
}

const listingData: Record<string, {
  title: string; location: string; price: number; rating: number; reviews: number;
  type: string; host: string; beds: number; baths: number; guests: number;
  desc: string; amenities: string[]; images: string[]; lat: number; lng: number;
  category: string;
}> = {
  '1': { title: 'Panoramic Suite with city views', location: 'Tbilisi, Vera', price: 280, rating: 4.96, reviews: 127, type: 'Entire suite', host: 'Nino', beds: 2, baths: 1, guests: 4, desc: 'Experience Tbilisi from above in this stunning panoramic suite with floor-to-ceiling windows overlooking the historic city. Located in the charming Vera district, steps from galleries, cafes, and the cable car to Narikala fortress. Modern amenities with Georgian hospitality.', amenities: ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Washing machine', 'TV', 'Balcony', 'City view', 'Elevator', 'Iron'], images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'], lat: 41.7060, lng: 44.7820, category: 'hotels' },
  '2': { title: 'Wine Country Villa with vineyard', location: 'Kakheti, Sighnaghi', price: 150, rating: 4.89, reviews: 89, type: 'Entire villa', host: 'Giorgi', beds: 3, baths: 2, guests: 6, desc: 'Escape to Georgia\'s wine heartland. This charming villa sits among Kakheti vineyards with stunning views of the Alazani Valley. Enjoy traditional qvevri wine-making, farm-fresh breakfasts, and the magic of the City of Love.', amenities: ['WiFi', 'Kitchen', 'Free parking', 'Garden', 'BBQ', 'Pool', 'Mountain view', 'Fireplace', 'Breakfast included', 'Wine tasting'], images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop'], lat: 41.6200, lng: 45.9228, category: 'villas' },
};

const defaultData = { title: 'Mountain lodge with Kazbek views', location: 'Kazbegi, Stepantsminda', price: 120, rating: 4.93, reviews: 64, type: 'Entire lodge', host: 'Dato', beds: 2, baths: 1, guests: 4, desc: 'Wake up to the majestic Mount Kazbek every morning. This cozy mountain lodge offers the perfect balance of rustic charm and modern comfort. Ideal base for hiking, horse riding, and exploring one of the most breathtaking regions in the Caucasus.', amenities: ['WiFi', 'Kitchen', 'Free parking', 'Mountain view', 'Fireplace', 'Heating', 'Garden', 'Hiking trails', 'Breakfast available', 'Hot water'], images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'], lat: 42.6568, lng: 44.6433, category: 'cabins' };

const reviews = [
  { name: 'Sarah M.', country: '🇺🇸', rating: 5, date: 'May 2025', text: 'Absolutely stunning views! The host was incredibly welcoming and the space was spotless. Would definitely return.' },
  { name: 'Thomas K.', country: '🇩🇪', rating: 5, date: 'Apr 2025', text: 'Perfect location and beautifully decorated. The local tips from the host made our trip so much better.' },
  { name: 'Yuki T.', country: '🇯🇵', rating: 4, date: 'Mar 2025', text: 'Great place, very comfortable. Slight noise from the street but overall wonderful experience in Georgia.' },
];

export default function ListingPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveListing, setLiveListing] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('kaya_favorites') || '[]');
    setIsFavorited(favs.includes(params.id));
  }, [params.id]);

  const toggleFavorite = () => {
    const favs: string[] = JSON.parse(localStorage.getItem('kaya_favorites') || '[]');
    if (favs.includes(params.id)) {
      const updated = favs.filter((id: string) => id !== params.id);
      localStorage.setItem('kaya_favorites', JSON.stringify(updated));
      setIsFavorited(false);
    } else {
      favs.push(params.id);
      localStorage.setItem('kaya_favorites', JSON.stringify(favs));
      setIsFavorited(true);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()).then(data => {
        if (data.user?.id) setUserId(data.user.id);
      }).catch(() => {});
    }

    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setLiveListing(data);
        }
      } catch {
        console.error('Failed to fetch listing');
      }
    }
    fetchListing();
  }, [params.id]);

  const listing = liveListing || listingData[params.id] || defaultData;

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 3;
  const total = listing.price * nights;

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    
    if (!userId) {
      alert('Please log in to reserve this property.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          listing_id: params.id,
          check_in: checkIn,
          check_out: checkOut,
          guest_count: guests,
        }),
      });

      if (res.ok) {
        alert('Reservation successfully created!');
        setCheckIn('');
        setCheckOut('');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Booking failed');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Error making reservation: ${err.message}`);
      } else {
        alert('Error making reservation');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <div className="shell">
        {/* Inline glass nav matching homepage */}
        <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
          <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
            <Link href="/" className="nav-brand">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </Link>
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
            <div className="nav-links">
              <Link href="/klara">KLARA</Link>
              <Link href="/search">Visitors</Link>
              <Link href="/hotels">Stays</Link>
              <Link href="/muse">Where to go</Link>
              <Link href="/contact">Contact us</Link>
            </div>
            <div className="nav-spacer"></div>
            <div className="nav-right">
              <Link href="/login">Become a host</Link>
              <Link href="/login" className="nav-icon" aria-label="Login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path></svg>
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
          <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
          <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
          <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
          <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>Stays</Link>
          <Link href="/muse" onClick={() => setMobileNavOpen(false)}>Where to go</Link>
          <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact us</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)}>Become a host</Link>
        </div>

      <main className={`${styles.page} shell`} style={{ marginTop: '80px' }}>
        {/* Title */}
        <div className={`${styles.titleBar} animate-section`}>
          <span className={styles.categoryBadge}>{listing.category || 'stays'}</span>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{listing.title}</h1>
            <button className={`${styles.heartBtn} ${isFavorited ? styles.heartActive : ''}`} onClick={toggleFavorite} aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
              <span className={styles.heartIcon}>{isFavorited ? '♥' : '♡'}</span>
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
          <div className={styles.titleMeta}>
            <span>★ {listing.rating} · {listing.reviews} reviews</span>
            <span>·</span>
            <span>{listing.location}</span>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className={`${styles.photos} animate-section`}>
          <div className={styles.photoMain}>
            <Image 
              src={listing.images?.[activeImage] || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop'} 
              alt={listing.title} 
              fill 
              sizes="100vw" 
              style={{ objectFit: 'cover' }} 
              priority 
            />
          </div>
          {listing.images?.length > 1 && (
            <>
              <button className={styles.galleryPrev} onClick={() => setActiveImage(prev => (prev - 1 + listing.images.length) % listing.images.length)} aria-label="Previous photo">‹</button>
              <button className={styles.galleryNext} onClick={() => setActiveImage(prev => (prev + 1) % listing.images.length)} aria-label="Next photo">›</button>
              <div className={styles.photoCounter}>{activeImage + 1} / {listing.images.length}</div>
            </>
          )}
        </div>
        {listing.images?.length > 1 && (
          <div className={styles.thumbnailStrip}>
            {listing.images.map((img: string, i: number) => (
              <div key={i} className={`${styles.thumbnail} ${i === activeImage ? styles.thumbnailActive : ''}`} onClick={() => setActiveImage(i)}>
                <Image src={img} alt={`Thumbnail ${i + 1}`} fill sizes="80px" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className={`${styles.content} animate-section`}>
          <div className={styles.left}>
            {/* Host Info */}
            <div className={styles.glassSection}>
              <div className={styles.hostInfo}>
                <div>
                  <h2 className={styles.hostTitle}>{listing.type} hosted by {listing.host}</h2>
                  <p className={styles.hostMeta}>{listing.guests} guests · {listing.beds} bedroom{listing.beds > 1 ? 's' : ''} · {listing.baths} bath{listing.baths > 1 ? 's' : ''}</p>
                </div>
                <div className={styles.hostAvatar}>
                  {listing.host[0]}
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className={`${styles.glassSection}`}>
              <div className={styles.highlights}>
                <div className={styles.highlight}>
                  <span className={styles.highlightIcon}>🏠</span>
                  <div>
                    <strong>Entire place</strong>
                    <p>You&apos;ll have the entire space to yourself.</p>
                  </div>
                </div>
                <div className={styles.highlight}>
                  <span className={styles.highlightIcon}>🧹</span>
                  <div>
                    <strong>Enhanced Clean</strong>
                    <p>This host committed to Kaya&apos;s enhanced cleaning process.</p>
                  </div>
                </div>
                <div className={styles.highlight}>
                  <span className={styles.highlightIcon}>📍</span>
                  <div>
                    <strong>Great location</strong>
                    <p>95% of recent guests gave the location a 5-star rating.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={`${styles.glassSection}`}>
              <div className={styles.desc}>
                <p>{listing.desc}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className={`${styles.glassSection}`}>
              <div className={styles.amenities}>
                <h3>What this place offers</h3>
                <div className={styles.amenitiesGrid}>
                  {listing.amenities?.map((a: string) => (
                    <div key={a} className={styles.amenity}>✓ {a}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className={`${styles.glassSection}`}>
              <div className={styles.mapSection}>
                <h3>Where you&apos;ll be</h3>
                <p className={styles.mapLocation}>{listing.location}</p>
                <div className={styles.mapContainer}>
                  <Map 
                    locations={[{ lat: listing.lat, lng: listing.lng, price: listing.price }]} 
                    center={{ lat: listing.lat, lng: listing.lng }} 
                    zoom={14} 
                  />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className={`${styles.glassSection}`}>
              <div className={styles.reviewsSection}>
                <h3>★ {listing.rating} · {listing.reviews} reviews</h3>
                <div className={styles.reviewsList}>
                  {reviews.map((r, i) => (
                    <div key={i} className={styles.review}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAvatar}>{r.name[0]}</div>
                        <div>
                          <strong>{r.name}</strong> {r.country}
                          <p className={styles.reviewDate}>{r.date}</p>
                        </div>
                      </div>
                      <p className={styles.reviewText}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className={styles.right}>
            <div className={`${styles.bookingCard}`}>
              <div className={styles.bookingPrice}>
                <span className={styles.bookingAmount}>₾{listing.price}</span> / night
              </div>

              <div className={styles.bookingForm}>
                <div className={styles.bookingDates}>
                  <div className={styles.bookingField}>
                    <label>CHECK-IN</label>
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                  </div>
                  <div className={styles.bookingField}>
                    <label>CHECK-OUT</label>
                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                  </div>
                </div>
                <div className={styles.bookingField}>
                  <label>GUESTS</label>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleReserve}
                disabled={loading}
                className={`btn btn-primary ${styles.bookBtn}`}
              >
                {loading ? 'Reserving...' : 'Reserve'}
              </button>

              <div className={styles.bookingBreakdown}>
                <div className={styles.breakdownRow}>
                  <span>₾{listing.price} × {nights} nights</span>
                  <span>₾{total}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Service fee</span>
                  <span>₾0</span>
                </div>
                <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
                  <strong>Total</strong>
                  <strong>₾{total}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Inline footer */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </div>
            <p className="footer-tagline">Discover Georgia, your way.</p>
          </div>
          <div className="footer-links">
            <h4>Stays</h4>
            <Link href="/hotels">Hotels</Link>
            <Link href="/apartments">Apartments</Link>
            <Link href="/search?type=guesthouses">Guesthouses</Link>
            <Link href="/search?type=cabins">Cabins</Link>
          </div>
          <div className="footer-links">
            <h4>Discover</h4>
            <Link href="/muse">Where to go</Link>
            <Link href="/blog">Travel blog</Link>
            <Link href="/about">About us</Link>
            <Link href="/careers">Careers</Link>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <Link href="/contact">Contact us</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/resources">Resources</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; crafted in Tbilisi</span>
        </div>
      </footer>
      </div>
    </div>
  );
}
