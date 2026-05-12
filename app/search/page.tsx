'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';
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
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.append('q', searchInput);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    window.location.href = `/search?${params.toString()}`;
  };

  const categories = ['hotels', 'restaurants', 'cars', 'tours', 'services', 'salons'];
  const cities = ['Tbilisi', 'Batumi', 'Kazbegi', 'Kakheti', 'Kutaisi', 'Gori'];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Search Header */}
      <div className="pt-24 pb-8 px-6 md:px-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-full bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-full bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-full bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} in Georgia` : 'Browse All Places'}
            </h1>
            <p className="text-gray-500">
              {loading ? 'Searching...' : `${listings.length} results found`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Listings */}
      <div className="py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link href={`/listing/${listing.id}`}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                      <img
                        src={listing.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop'}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-gray-900">
                          {listing.overall_rating?.toFixed(1) || 'New'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-semibold text-gray-700">
                        {listing.category}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{listing.title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {listing.location || listing.city}
                      </p>
                      <p className="mt-2 text-gray-900">
                        <span className="font-bold text-base">{listing.price_per_night} GEL</span>
                        <span className="text-gray-500 text-sm"> / night</span>
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No listings found matching your filters</p>
              <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
                Browse all categories
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
