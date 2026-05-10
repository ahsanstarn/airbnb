'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import styles from './search.module.css';

const allListings = [
  { id: 1, title: 'Panoramic Suite with city views', location: 'Tbilisi, Vera', price: 280, rating: 4.96, type: 'Hotel', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop', beds: 2, guests: 4, lat: 41.7060, lng: 44.7820 },
  { id: 2, title: 'Wine Country Villa with vineyard', location: 'Kakheti, Sighnaghi', price: 150, rating: 4.89, type: 'Villa', img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=500&fit=crop', beds: 3, guests: 6, lat: 41.6200, lng: 45.9228 },
  { id: 3, title: 'Modern seaside apartment', location: 'Batumi, Boulevard', price: 95, rating: 4.72, type: 'Apartment', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=500&fit=crop', beds: 1, guests: 2, lat: 41.6168, lng: 41.6367 },
  { id: 4, title: 'Mountain lodge with Kazbek views', location: 'Kazbegi, Stepantsminda', price: 120, rating: 4.93, type: 'Lodge', img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=500&fit=crop', beds: 2, guests: 4, lat: 42.6568, lng: 44.6433 },
  { id: 5, title: 'Cozy Old Town guesthouse', location: 'Tbilisi, Abanotubani', price: 65, rating: 4.85, type: 'Guesthouse', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=500&fit=crop', beds: 1, guests: 2, lat: 41.6880, lng: 44.8105 },
  { id: 6, title: 'Boutique hotel on Rustaveli', location: 'Tbilisi, Rustaveli', price: 195, rating: 4.91, type: 'Hotel', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=500&fit=crop', beds: 2, guests: 3, lat: 41.6980, lng: 44.7950 },
  { id: 7, title: 'Traditional Svanetian tower house', location: 'Mestia, Svaneti', price: 85, rating: 4.88, type: 'Unique', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=500&fit=crop', beds: 2, guests: 4, lat: 43.0458, lng: 42.7278 },
  { id: 8, title: 'Beachfront flat with pool', location: 'Batumi, New Boulevard', price: 110, rating: 4.77, type: 'Apartment', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=500&fit=crop', beds: 2, guests: 4, lat: 41.6368, lng: 41.6167 },
];

const regions = ['All Regions', 'Tbilisi', 'Batumi', 'Kakheti', 'Kazbegi', 'Mestia'];
const types = ['All Types', 'Hotel', 'Apartment', 'Villa', 'Guesthouse', 'Lodge', 'Unique'];
const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

export default function SearchPage() {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('Recommended');
  const [region, setRegion] = useState('All Regions');
  const [type, setType] = useState('All Types');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveListings, setLiveListings] = useState<any[]>(allListings);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase.from('listings').select('*');
        if (!error && data && data.length > 0) {
          setLiveListings(data);
        }
      } catch (err) {
        console.error('Failed to fetch from Supabase', err);
      }
    }
    fetchListings();
  }, []);

  const filtered = liveListings
    .filter(l => region === 'All Regions' || l.location.includes(region))
    .filter(l => type === 'All Types' || l.type === type)
    .filter(l => l.price >= priceRange[0] && l.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Top Rated') return b.rating - a.rating;
      return 0;
    });

  // Calculate center based on filtered locations, default to Tbilisi
  const mapCenter = filtered.length > 0 
    ? { lat: filtered[0].lat, lng: filtered[0].lng } 
    : { lat: 41.7151, lng: 44.8271 };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        {/* Filters Bar */}
        <div className={styles.filtersBar}>
          <div className={styles.filtersRow}>
            <select value={region} onChange={e => setRegion(e.target.value)} className={styles.select}>
              {regions.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)} className={styles.select}>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <div className={styles.priceFilter}>
              <span className={styles.priceLabel}>Up to ₾{priceRange[1]}</span>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={e => setPriceRange([0, Number(e.target.value)])}
                className={styles.slider}
              />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.select}>
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Split View */}
        <div className={styles.splitView}>
          <div className={styles.listPane}>
            <p className={styles.resultCount}>{filtered.length} stays found</p>
            <div className={styles.grid}>
              {filtered.map(listing => (
                <Link key={listing.id} href={`/listing/${listing.id}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    <Image src={listing.images?.[0] || listing.img || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop'} alt={listing.title} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                    <button className={styles.cardFav} onClick={e => e.preventDefault()} aria-label="Save">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.5)" stroke="white" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    </button>
                    <span className={styles.cardType}>{listing.type}</span>
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardRow}>
                      <h3 className={styles.cardTitle}>{listing.title}</h3>
                      <span className={styles.cardRating}>★ {listing.rating}</span>
                    </div>
                    <p className={styles.cardLoc}>{listing.location}</p>
                    <p className={styles.cardMeta}>{listing.beds} bed{listing.beds > 1 ? 's' : ''} · {listing.guests} guests</p>
                    <p className={styles.cardPrice}><strong>₾{listing.price}</strong> / night</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.mapPane}>
            <Map 
              locations={filtered} 
              center={mapCenter} 
              zoom={region === 'All Regions' ? 7 : 12} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
