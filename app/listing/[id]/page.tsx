'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Map from '../../components/Map';
import styles from './listing.module.css';

// ... (keep listingData, defaultData, reviews exactly as they were)
const listingData: Record<string, {
  title: string; location: string; price: number; rating: number; reviews: number;
  type: string; host: string; beds: number; baths: number; guests: number;
  desc: string; amenities: string[]; images: string[]; lat: number; lng: number;
}> = {
  '1': { title: 'Panoramic Suite with city views', location: 'Tbilisi, Vera', price: 280, rating: 4.96, reviews: 127, type: 'Entire suite', host: 'Nino', beds: 2, baths: 1, guests: 4, desc: 'Experience Tbilisi from above in this stunning panoramic suite with floor-to-ceiling windows overlooking the historic city. Located in the charming Vera district, steps from galleries, cafes, and the cable car to Narikala fortress. Modern amenities with Georgian hospitality.', amenities: ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Washing machine', 'TV', 'Balcony', 'City view', 'Elevator', 'Iron'], images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'], lat: 41.7060, lng: 44.7820 },
  '2': { title: 'Wine Country Villa with vineyard', location: 'Kakheti, Sighnaghi', price: 150, rating: 4.89, reviews: 89, type: 'Entire villa', host: 'Giorgi', beds: 3, baths: 2, guests: 6, desc: 'Escape to Georgia\'s wine heartland. This charming villa sits among Kakheti vineyards with stunning views of the Alazani Valley. Enjoy traditional qvevri wine-making, farm-fresh breakfasts, and the magic of the City of Love.', amenities: ['WiFi', 'Kitchen', 'Free parking', 'Garden', 'BBQ', 'Pool', 'Mountain view', 'Fireplace', 'Breakfast included', 'Wine tasting'], images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop'], lat: 41.6200, lng: 45.9228 },
};

const defaultData = { title: 'Mountain lodge with Kazbek views', location: 'Kazbegi, Stepantsminda', price: 120, rating: 4.93, reviews: 64, type: 'Entire lodge', host: 'Dato', beds: 2, baths: 1, guests: 4, desc: 'Wake up to the majestic Mount Kazbek every morning. This cozy mountain lodge offers the perfect balance of rustic charm and modern comfort. Ideal base for hiking, horse riding, and exploring one of the most breathtaking regions in the Caucasus.', amenities: ['WiFi', 'Kitchen', 'Free parking', 'Mountain view', 'Fireplace', 'Heating', 'Garden', 'Hiking trails', 'Breakfast available', 'Hot water'], images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'], lat: 42.6568, lng: 44.6433 };

const reviews = [
  { name: 'Sarah M.', country: '🇺🇸', rating: 5, date: 'May 2025', text: 'Absolutely stunning views! The host was incredibly welcoming and the space was spotless. Would definitely return.' },
  { name: 'Thomas K.', country: '🇩🇪', rating: 5, date: 'Apr 2025', text: 'Perfect location and beautifully decorated. The local tips from the host made our trip so much better.' },
  { name: 'Yuki T.', country: '🇯🇵', rating: 4, date: 'Mar 2025', text: 'Great place, very comfortable. Slight noise from the street but overall wonderful experience in Georgia.' },
];

export default function ListingPage({ params }: { params: { id: string } }) {
  const listing = listingData[params.id] || defaultData;
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      }
    });
  }, []);

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
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: params.id, // Using real UUID in production
          userId,
          checkIn,
          checkOut,
          guests,
          totalAmount: total
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Reservation successfully created!');
        setCheckIn('');
        setCheckOut('');
      } else {
        throw new Error(data.error);
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
    <>
      <Navbar />
      <main className={`${styles.page} container`}>
        {/* Title */}
        <div className={styles.titleBar}>
          <h1 className={styles.title}>{listing.title}</h1>
          <div className={styles.titleMeta}>
            <span>★ {listing.rating} · {listing.reviews} reviews</span>
            <span>·</span>
            <span>{listing.location}</span>
          </div>
        </div>

        {/* Photo Grid */}
        <div className={styles.photos}>
          <div className={styles.photoMain}>
            <Image src={listing.images[0]} alt={listing.title} fill sizes="50vw" style={{ objectFit: 'cover' }} priority />
          </div>
          <div className={styles.photoGrid}>
            {listing.images.slice(1, 5).map((img, i) => (
              <div key={i} className={styles.photoSmall}>
                <Image src={img} alt={`Photo ${i + 2}`} fill sizes="25vw" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.left}>
            {/* Host Info */}
            <div className={styles.hostInfo}>
              <div>
                <h2 className={styles.hostTitle}>{listing.type} hosted by {listing.host}</h2>
                <p className={styles.hostMeta}>{listing.guests} guests · {listing.beds} bedroom{listing.beds > 1 ? 's' : ''} · {listing.baths} bath{listing.baths > 1 ? 's' : ''}</p>
              </div>
              <div className={styles.hostAvatar}>
                {listing.host[0]}
              </div>
            </div>

            <hr className={styles.hr} />

            {/* Highlights */}
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

            <hr className={styles.hr} />

            {/* Description */}
            <div className={styles.desc}>
              <p>{listing.desc}</p>
            </div>

            <hr className={styles.hr} />

            {/* Amenities */}
            <div className={styles.amenities}>
              <h3>What this place offers</h3>
              <div className={styles.amenitiesGrid}>
                {listing.amenities.map(a => (
                  <div key={a} className={styles.amenity}>✓ {a}</div>
                ))}
              </div>
            </div>

            <hr className={styles.hr} />

            {/* Map Section */}
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

            <hr className={styles.hr} />

            {/* Reviews */}
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

          {/* Booking Widget */}
          <div className={styles.right}>
            <div className={styles.bookingCard}>
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
      <Footer />
    </>
  );
}
