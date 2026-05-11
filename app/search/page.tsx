'use client';

import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import styles from './search.module.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=500&fit=crop';

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

const DEFAULT_CENTER = { lat: 41.7151, lng: 44.8271 };

const regions = ['All Regions', 'Tbilisi', 'Batumi', 'Kakheti', 'Kazbegi', 'Mestia'];
const types = ['All Types', 'Hotel', 'Apartment', 'Villa', 'Guesthouse', 'Lodge', 'Unique'];
const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

const EXPERIENCE_TYPES = new Set(['lodge', 'unique', 'guesthouse']);

type NormalizedListing = Omit<(typeof allListings)[number], 'id'> & {
  id: number | string;
  images?: string[];
};

/** Region dropdown + DB text: match title/location with common aliases */
function listingMatchesRegion(listing: Pick<NormalizedListing, 'title' | 'location'>, region: string): boolean {
  if (region === 'All Regions') return true;
  const hay = `${listing.title} ${listing.location}`.toLowerCase();
  const r = region.toLowerCase();
  if (hay.includes(r)) return true;
  const aliases: Record<string, readonly string[]> = {
    Kazbegi: ['stepantsminda', 'kazbegi', 'kazbek'],
    Mestia: ['svaneti', 'mestia'],
    Kakheti: ['sighnaghi', 'telavi', 'kakheti'],
    Tbilisi: ['vera', 'abanotubani', 'rustaveli', 'old town', 'tbilisi'],
    Batumi: ['boulevard', 'batumi'],
  };
  const keys = aliases[region];
  if (keys) return keys.some((k) => hay.includes(k));
  return false;
}

function normalizeListing(row: Record<string, unknown>): NormalizedListing {
  const idRaw = row.id;
  const numId = typeof idRaw === 'number' ? idRaw : parseInt(String(idRaw), 10);
  const mock = Number.isFinite(numId) ? allListings.find((l) => l.id === numId) : undefined;

  const latRaw = Number(row.lat);
  const lngRaw = Number(row.lng);
  const lat = Number.isFinite(latRaw) ? latRaw : (mock?.lat ?? DEFAULT_CENTER.lat);
  const lng = Number.isFinite(lngRaw) ? lngRaw : (mock?.lng ?? DEFAULT_CENTER.lng);

  const typeRaw = row.type != null && String(row.type).trim() !== '' ? String(row.type) : (mock?.type ?? 'Stay');

  const rowImages = row.images;
  const firstGallery =
    Array.isArray(rowImages) && rowImages.length > 0 ? String(rowImages[0]) : null;
  const imgVal =
    (row.img != null && String(row.img)) || firstGallery || mock?.img || FALLBACK_IMG;

  return {
    id: idRaw != null ? (idRaw as number | string) : (mock?.id ?? numId),
    title: String(row.title ?? mock?.title ?? 'Georgia stay'),
    location: String(row.location ?? mock?.location ?? 'Tbilisi, Georgia'),
    price: Number(row.price ?? mock?.price ?? 100),
    rating: Number(row.rating ?? mock?.rating ?? 4.5),
    type: typeRaw,
    img: imgVal,
    beds: Number(row.beds ?? mock?.beds ?? 1),
    guests: Number(row.guests ?? mock?.guests ?? 2),
    lat,
    lng,
    images: Array.isArray(row.images) ? (row.images as string[]) : undefined,
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState('Recommended');
  const [region, setRegion] = useState(searchParams.get('region') || 'All Regions');
  const [type, setType] = useState(searchParams.get('type') || 'All Types');
  const [experienceMode, setExperienceMode] = useState(searchParams.get('experience') === '1');
  const [liveListings, setLiveListings] = useState<NormalizedListing[]>(allListings.map(normalizeListing));
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [minGuests, setMinGuests] = useState(1);
  const [destQuery, setDestQuery] = useState(() => searchParams.get('q') ?? '');

  const regionRef = useRef<HTMLSelectElement>(null);
  const destRef = useRef<HTMLInputElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qRegion = searchParams.get('region');
    const qType = searchParams.get('type');
    const qExp = searchParams.get('experience');
    if (qRegion !== null) setRegion(qRegion || 'All Regions');
    const qDest = searchParams.get('q');
    if (qDest !== null) setDestQuery(qDest);
    if (qExp === '1') {
      setExperienceMode(true);
      setType('All Types');
    } else {
      setExperienceMode(false);
      if (qType !== null) setType(qType || 'All Types');
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase.from('listings').select('*');
        if (!error && data && data.length > 0) {
          setLiveListings(data.map((row) => normalizeListing(row as Record<string, unknown>)));
        }
      } catch (err) {
        console.error('Failed to fetch from Supabase', err);
      }
    }
    fetchListings();
  }, []);

  useEffect(() => {
    const focus = searchParams.get('focus');
    const id = window.requestAnimationFrame(() => {
      if (focus === 'region') {
        destRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        destRef.current?.focus();
      } else if (focus === 'dates') {
        datesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        datesRef.current?.querySelector('input')?.focus();
      } else if (focus === 'guests') {
        guestsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        guestsRef.current?.querySelector('input')?.focus();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = destQuery.trim().toLowerCase();
    return liveListings
      .filter((l) => listingMatchesRegion(l, region))
      .filter((l) => {
        if (!q) return true;
        return `${l.title} ${l.location}`.toLowerCase().includes(q);
      })
      .filter((l) => {
        if (experienceMode) {
          return EXPERIENCE_TYPES.has(l.type.toLowerCase());
        }
        if (type === 'All Types') return true;
        return l.type.toLowerCase() === type.toLowerCase();
      })
      .filter((l) => l.price >= priceRange[0] && l.price <= priceRange[1])
      .filter((l) => l.guests >= minGuests)
      .sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price;
        if (sortBy === 'Price: High to Low') return b.price - a.price;
        if (sortBy === 'Top Rated') return b.rating - a.rating;
        return 0;
      });
  }, [liveListings, region, destQuery, type, experienceMode, priceRange, sortBy, minGuests]);

  const mapLocations = useMemo(
    () =>
      filtered.filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng)),
    [filtered]
  );

  const mapCenter =
    mapLocations.length > 0 ? { lat: mapLocations[0].lat, lng: mapLocations[0].lng } : DEFAULT_CENTER;

  const focus = searchParams.get('focus');

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.filtersBar}>
          <div className={styles.filtersRow}>
            <input
              ref={destRef}
              type="search"
              placeholder="Search city or area"
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              className={`${styles.destInput} ${focus === 'region' ? styles.focusRing : ''}`}
              aria-label="Search destination"
            />
            <select
              ref={regionRef}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={styles.select}
            >
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className={styles.select}
              disabled={experienceMode}
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className={styles.priceFilter}>
              <span className={styles.priceLabel}>Up to ₾{priceRange[1]}</span>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className={styles.slider}
              />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.select}>
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div ref={datesRef} className={`${styles.extraFilters} ${focus === 'dates' ? styles.focusRing : ''}`}>
            <label className={styles.dateField}>
              <span className={styles.fieldLabel}>Check-in</span>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={styles.dateInput} />
            </label>
            <label className={styles.dateField}>
              <span className={styles.fieldLabel}>Check-out</span>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={styles.dateInput} />
            </label>
          </div>
          <div ref={guestsRef} className={`${styles.guestsRow} ${focus === 'guests' ? styles.focusRing : ''}`}>
            <label className={styles.guestsLabel}>
              Min. guests
              <input
                type="number"
                min={1}
                max={20}
                value={minGuests}
                onChange={(e) => setMinGuests(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                className={styles.guestsInput}
              />
            </label>
          </div>
        </div>

        <div className={styles.splitView}>
          <div className={styles.viewToggle}>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={`${styles.toggleBtn} ${showMap ? styles.active : ''}`}
            >
              {showMap ? '📋 List View' : '🗺️ Map View'}
            </button>
          </div>
          {showMap ? (
            <div className={styles.mapPane}>
              <div className={styles.mapContainer}>
                <p>Interactive Map View</p>
                <p>Click on any property to see details</p>
              </div>
            </div>
          ) : (
            <div className={styles.listPane}>
              <p className={styles.resultCount}>{filtered.length} stays found</p>
              <div className={styles.grid}>
              {filtered.map((listing) => (
                <Link key={String(listing.id)} href={`/listing/${listing.id}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    <Image
                      src={listing.images?.[0] || listing.img || FALLBACK_IMG}
                      alt={listing.title}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <button type="button" className={styles.cardFav} onClick={(e) => e.preventDefault()} aria-label="Save">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.5)" stroke="white" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
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
                    <p className={styles.cardMeta}>
                      {listing.beds} bed{listing.beds > 1 ? 's' : ''} · {listing.guests} guests
                    </p>
                    <p className={styles.cardPrice}>
                      <strong>₾{listing.price}</strong> / night
                    </p>
                  </div>
                </Link>
              ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.suspenseFallback}>Loading search…</div>}>
      <SearchContent />
    </Suspense>
  );
}
