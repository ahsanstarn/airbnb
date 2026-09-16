'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/lang-context';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const staticListings: any[] = [
    { id: 101, title: 'Panoramic Suite Vera', location: 'Tbilisi, Georgia', city: 'Tbilisi', price_per_night: 280, overall_rating: 4.96, category: 'hotels', images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop'] },
    { id: 102, title: 'Boutique Rustaveli', location: 'Tbilisi, Georgia', city: 'Tbilisi', price_per_night: 195, overall_rating: 4.91, category: 'hotels', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=700&fit=crop'] },
    { id: 103, title: 'Modern Seaside Flat', location: 'Batumi, Georgia', city: 'Batumi', price_per_night: 95, overall_rating: 4.72, category: 'apartments', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=700&fit=crop'] },
    { id: 104, title: 'Old Town Guesthouse', location: 'Tbilisi, Georgia', city: 'Tbilisi', price_per_night: 65, overall_rating: 4.85, category: 'guesthouses', images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=700&fit=crop'] },
    { id: 105, title: 'Kazbegi Mountain Lodge', location: 'Kazbegi, Georgia', city: 'Kazbegi', price_per_night: 120, overall_rating: 4.88, category: 'cabins', images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop'] },
    { id: 106, title: 'Kakheti Wine Estate', location: 'Kakheti, Georgia', city: 'Kakheti', price_per_night: 150, overall_rating: 4.93, category: 'resorts', images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&h=700&fit=crop'] },
    { id: 107, title: 'Villa on the Hillside', location: 'Batumi, Georgia', city: 'Batumi', price_per_night: 220, overall_rating: 4.79, category: 'villas', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=700&fit=crop'] },
    { id: 108, title: 'Cozy Tbilisi Apartment', location: 'Tbilisi, Georgia', city: 'Tbilisi', price_per_night: 80, overall_rating: 4.64, category: 'apartments', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=700&fit=crop'] },
    { id: 109, title: 'Rustaveli Boutique Hotel', location: 'Tbilisi, Georgia', city: 'Tbilisi', price_per_night: 160, overall_rating: 4.82, category: 'hotels', images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=900&h=700&fit=crop'] },
    { id: 110, title: 'Cottage in Gudauri', location: 'Gudauri, Georgia', city: 'Kazbegi', price_per_night: 110, overall_rating: 4.71, category: 'cabins', images: ['https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=900&h=700&fit=crop'] },
    { id: 111, title: 'Guesthouse Svaneti', location: 'Mestia, Georgia', city: 'Kutaisi', price_per_night: 55, overall_rating: 4.77, category: 'guesthouses', images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&h=700&fit=crop'] },
    { id: 112, title: 'Black Sea Resort', location: 'Batumi, Georgia', city: 'Batumi', price_per_night: 180, overall_rating: 4.69, category: 'resorts', images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&h=700&fit=crop'] },
  ];

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('type') || searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'recommended',
    page: 1,
  });
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || searchParams.get('city') || '');

  // Synchronize state when URL searchParams change
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const cityParam = searchParams.get('city') || '';
    const catParam = searchParams.get('type') || searchParams.get('category') || '';
    const minParam = searchParams.get('minPrice') || '';
    const maxParam = searchParams.get('maxPrice') || '';
    const sortParam = searchParams.get('sort') || 'recommended';

    setSearchInput(qParam || cityParam);
    setFilters(prev => ({
      ...prev,
      category: catParam,
      city: cityParam,
      minPrice: minParam,
      maxPrice: maxParam,
      sort: sortParam,
      page: 1,
    }));
  }, [searchParams]);

  const fiterListingsStatic = useCallback((all: any[], queryText?: string) => {
    let filtered = [...all];
    const q = (queryText !== undefined ? queryText : searchInput).trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(l =>
        l.title?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q) ||
        l.location?.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q)
      );
    }
    if (filters.category) {
      filtered = filtered.filter(l => l.category === filters.category);
    }
    if (filters.city && !q.includes(filters.city.toLowerCase())) {
      filtered = filtered.filter(l => l.city?.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.minPrice) {
      filtered = filtered.filter(l => l.price_per_night >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(l => l.price_per_night <= parseFloat(filters.maxPrice));
    }
    if (filters.sort === 'price_asc') filtered.sort((a, b) => a.price_per_night - b.price_per_night);
    if (filters.sort === 'price_desc') filtered.sort((a, b) => b.price_per_night - a.price_per_night);
    if (filters.sort === 'rating') filtered.sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0));
    setListings(filtered);
  }, [filters, searchInput]);

  const fetchListings = useCallback(async (customQuery?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const q = customQuery !== undefined ? customQuery : searchInput.trim();
      if (q) params.append('q', q);
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', filters.page.toString());

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.listings && data.listings.length > 0) {
          setListings(data.listings);
          return;
        }
      }
      // Fall back to static data
      fiterListingsStatic(staticListings, q);
    } catch {
      fiterListingsStatic(staticListings, customQuery !== undefined ? customQuery : searchInput);
    } finally {
      setLoading(false);
    }
  }, [filters, searchInput, fiterListingsStatic]);

  useEffect(() => {
    fetchListings();
  }, [filters, fetchListings]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    router.push(`/search?${params.toString()}`);
    fetchListings(query);
  };

  const categoryInfo: Record<string, { description: string; highlights: string[] }> = {
    guesthouses: {
      description: 'Experience authentic Georgian hospitality in family-run guesthouses. Stay with locals, enjoy homemade khachapuri and qvevri wine, and discover the true soul of Sakartvelo through the eyes of those who call it home.',
      highlights: ['Home-cooked meals included', 'Host speaks English & Georgian', 'Cultural experiences offered', 'Avg: 65 GEL/night'],
    },
    hotels: {
      description: 'From boutique design hotels in Tbilisi to luxury resorts in Batumi, Georgia offers world-class accommodation blending modern comfort with centuries-old hospitality traditions.',
      highlights: ['24/7 reception & concierge', 'Breakfast included', 'Central locations', 'Avg: 195 GEL/night'],
    },
    apartments: {
      description: 'Fully equipped private apartments across Georgia\'s cities. Perfect for digital nomads, families, and travelers who want their own space with all the comforts of home.',
      highlights: ['Self-catering kitchens', 'WiFi included', 'Monthly discounts', 'Avg: 95 GEL/night'],
    },
    cabins: {
      description: 'Mountain cabins in Kazbegi, Gudauri, and Svaneti. Wake up to panoramic Caucasus views, step out to hiking trails, and cozy up by the fireplace after a day on the slopes.',
      highlights: ['Mountain views', 'Fireplace or stove', 'Near hiking trails', 'Avg: 120 GEL/night'],
    },
    resorts: {
      description: 'Full-service resorts along the Black Sea coast and Georgia\'s wine regions. Spa facilities, swimming pools, fine dining, and curated excursions all in one destination.',
      highlights: ['Spa & wellness', 'Pool access', 'On-site restaurant', 'Avg: 180 GEL/night'],
    },
    villas: {
      description: 'Private villas with gardens, pools, and stunning views. Ideal for groups, celebrations, and those seeking complete privacy in Georgia\'s most beautiful locations.',
      highlights: ['Private pool', 'Garden/terrace', 'Sleeps 6+ guests', 'Avg: 220 GEL/night'],
    },
  };

  const categories = ['hotels', 'apartments', 'houses', 'villas', 'cabins', 'guesthouses', 'cars', 'tours', 'restaurants', 'salons', 'services'];
  const cities = ['Tbilisi', 'Batumi', 'Kazbegi', 'Kakheti', 'Kutaisi', 'Gori', 'Mestia', 'Borjomi', 'Shatili'];

  return (
    <div className="site-shell">
      <div className="shell">
        {/* Hero Search Banner */}
        <section className="animate-section" style={{ marginTop: '90px' }}>
          <div style={{
            borderRadius: '28px',
            overflow: 'hidden',
            background: '#6e4c3a',
            boxShadow: 'var(--shadow)',
            padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 64px) clamp(32px, 6vw, 48px)',
            position: 'relative',
            isolation: 'isolate',
            minHeight: '380px',
          }}>
            {/* Background image */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1400&q=70)`,
              backgroundSize: 'cover',
              backgroundPosition: '50% 40%',
              transition: 'background-image 0.8s ease',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(40,22,15,.42), rgba(40,22,15,0.15) 30%, hsla(28,77%,83%,.25) 70%, hsla(28,77%,83%,.92))',
            }}></div>
            {/* Mist overlay */}
            <div style={{
              position: 'absolute', left: '-5%', right: '-5%', bottom: '-2%', height: '45%',
              background: 'radial-gradient(60% 70% at 20% 90%, hsla(0,0%,100%,.4), transparent 70%)',
              pointerEvents: 'none', filter: 'blur(2px)',
            }}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'rgba(255,250,243,.92)', margin: '0 0 24px', lineHeight: 1.05 }}>
                {filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} in Georgia` : t('discoverGeorgia', 'Discover Georgia')}
              </h1>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '700px' }}>
                <div style={{ flex: '1 1 180px', minWidth: 0, position: 'relative' }}>
                  <input
                    type="text"
                    placeholder={t('searchDestinations', 'Search destinations...')}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                      width: '100%', padding: '14px 18px', borderRadius: '999px',
                      border: '1px solid hsla(0,0%,100%,.6)',
                      background: 'rgba(255,251,246,.85)',
                      backdropFilter: 'blur(20px)',
                      outline: 'none', fontSize: '14px',
                    }}
                  />
                </div>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  style={{
                    padding: '14px 18px', borderRadius: '999px',
                    border: '1px solid hsla(0,0%,100%,.6)',
                    background: 'rgba(255,251,246,.85)',
                    backdropFilter: 'blur(20px)',
                    outline: 'none', fontSize: '13px',
                  }}
                >
                  <option value="">{t('allCategories', 'All Categories')}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{t(`cat.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))}</option>
                  ))}
                </select>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  style={{
                    padding: '14px 18px', borderRadius: '999px',
                    border: '1px solid hsla(0,0%,100%,.6)',
                    background: 'rgba(255,251,246,.85)',
                    backdropFilter: 'blur(20px)',
                    outline: 'none', fontSize: '13px',
                  }}
                >
                  <option value="">{t('allCities', 'All Cities')}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  style={{
                    padding: '14px 18px', borderRadius: '999px',
                    border: '1px solid hsla(0,0%,100%,.6)',
                    background: 'rgba(255,251,246,.85)',
                    backdropFilter: 'blur(20px)',
                    outline: 'none', fontSize: '13px',
                  }}
                >
                  <option value="recommended">{t('recommended', 'Recommended')}</option>
                  <option value="price_asc">{t('priceLow', 'Price: Low')}</option>
                  <option value="price_desc">{t('priceHigh', 'Price: High')}</option>
                  <option value="rating">{t('topRated', 'Top Rated')}</option>
                </select>
                <button type="submit" style={{
                  padding: '14px 28px', borderRadius: '999px',
                  border: '0', background: 'linear-gradient(135deg, #d9653b 0%, #c45228 100%)',
                  color: '#fff', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px -4px rgba(217, 101, 59, 0.45)',
                  transition: 'all 0.25s ease',
                }}>
                  {t('searchBtn', 'Search')}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Category Info */}
        {filters.category && categoryInfo[filters.category] && (
          <section className="animate-section" style={{ marginTop: '32px' }}>
            <div style={{
              borderRadius: '24px',
              padding: '36px 40px',
              background: 'rgba(255,251,246,.84)',
              border: '1px solid hsla(0,0%,100%,.35)',
              backdropFilter: 'blur(24px) saturate(120%)',
              boxShadow: 'var(--shadow)',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 12px' }}>
                {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} in Georgia
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px', maxWidth: '700px' }}>
                {categoryInfo[filters.category].description}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {categoryInfo[filters.category].highlights.map((h, i) => (
                  <span key={i} style={{
                    padding: '8px 16px', borderRadius: '999px',
                    background: 'rgba(26,18,14,.06)', color: 'var(--ink)',
                    fontSize: '13px', fontWeight: 600,
                  }}>{h}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        <section className="section animate-section">
          <div className="section-head">
            <div>
              <h2 className="section-title">
                {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : 'Places to Stay'}
              </h2>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
                {loading ? 'Searching...' : `${listings.length} result${listings.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="card-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="listing-card" style={{ background: '#d4c5b8', minHeight: '300px' }} />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="card-grid">
              {listings.map((listing: any) => {
                const itemId = listing._id || listing.id;
                const price = listing.price_per_night || listing.price || 150;
                return (
                  <Link key={itemId} href={`/listing/${itemId}`} className="listing-card animate-card card-3d-glow">
                    <div className="listing-card-media" style={{ backgroundImage: `url(${listing.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=70'})` }}>
                      <div className="listing-card-top">
                        <span className="price-tag">{price} GEL / night</span>
                        <span className="icon-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 21s-7-4.5-9.3-9.2C1 8.5 3 5 6.5 5 8.7 5 10.5 6 12 7.7 13.5 6 15.3 5 17.5 5 21 5 23 8.5 21.3 11.8 19 16.5 12 21 12 21Z"></path></svg>
                        </span>
                      </div>
                    </div>
                  <div className="listing-card-body">
                    <h3>{listing.title}</h3>
                    <div className="listing-meta">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11"><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>
                      {listing.location || listing.city}
                    </div>
                    <div className="rating-row">
                      <span className="rating-stars">★★★★★</span>{listing.overall_rating?.toFixed(1) || 'New'}
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '16px' }}>No listings found matching your filters</p>
              <Link className="pill-link" href="/search">Clear filters</Link>
            </div>
          )}
        </section>
      </div>

      {/* Footer matching homepage */}
      <footer className="site-footer">
        <div className="footer-grid shell">
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
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="site-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: 'var(--muted)' }}>Loading search...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
