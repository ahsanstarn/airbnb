'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Filter, MapPin, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function SearchContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'recommended',
    page: 1,
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.rating) params.append('minRating', filters.rating);
      params.append('sort', filters.sort);
      params.append('page', filters.page.toString());

      const response = await fetch(`/api/listings?${params.toString()}`);
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value, page: 1 });
  };

  const categories = [
    'hotels',
    'restaurants',
    'cars',
    'tours',
    'services',
    'salons',
  ];

  const cities = [
    'Tbilisi',
    'Batumi',
    'Kazbegi',
    'Kakheti',
    'Kutaisi',
    'Gori',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-20 px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Experience</h1>
            <p className="text-gray-600">
              {listings.length} results found
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Price Range (₾)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Listings Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {listings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                    >
                      <div className="relative h-48 bg-gray-200 overflow-hidden group">
                        <img
                          src={
                            listing.images?.[0] ||
                            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'
                          }
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold text-sm text-gray-900">
                            {listing.overall_rating?.toFixed(1) || 'New'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-sm text-orange-600 mb-2 uppercase tracking-wide">
                          {listing.category}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {listing.title}
                        </h3>

                        <div className="flex items-center gap-1 text-gray-600 text-sm mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.location}</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {listing.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              ₾{listing.price_per_night}
                            </p>
                            <p className="text-sm text-gray-500">per night</p>
                          </div>
                          <Link
                            href={`/listing/${listing.id}`}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-4">No listings found matching your filters</p>
                  <Link
                    href="/"
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Browse all categories
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

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

  const handleTypeChange = (v: string) => {
    setType(v);
    setExperienceMode(false);
  };

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
