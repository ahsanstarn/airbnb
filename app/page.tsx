'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  const [searchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
  });

  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await fetch('/api/listings?sort=recommended&limit=6');
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('city', searchParams.location);
    if (searchParams.checkIn) params.append('date_from', searchParams.checkIn);
    if (searchParams.checkOut) params.append('date_to', searchParams.checkOut);
    window.location.href = `/search?${params.toString()}`;
  };

  const placeholderListings = [
    { id: 1, title: 'Old Town Courtyard', location: 'Tbilisi, Old Town', price: 300, rating: 4.8, category: 'Hotel', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=400&fit=crop' },
    { id: 2, title: 'Kakheti Vineyard House', location: 'Signagi, Kakheti', price: 240, rating: 4.9, category: 'Guesthouse', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=400&fit=crop' },
    { id: 3, title: 'Batumi Sea View Loft', location: 'Batumi, Coastline', price: 210, rating: 4.7, category: 'Apartment', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop' },
    { id: 4, title: 'Kazbegi Ridge Cabin', location: 'Stepantsminda', price: 420, rating: 4.9, category: 'Cabin', image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop' },
  ];

  const displayListings = listings.length > 0 ? listings : placeholderListings;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1920&h=1080&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 tracking-tight"
          >
            FIND PLACE
            <br />
            TO STAY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 font-serif italic mb-10"
          >
            Discover Kakheti
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base text-white/70 mb-10 max-w-lg mx-auto leading-relaxed"
          >
            Amber wine, vineyard roads, family tables and slow countryside afternoons.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-full shadow-xl p-2 max-w-2xl mx-auto"
          >
            <div className="flex items-center divide-x divide-gray-200">
              <div className="flex-1 px-5 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tbilisi</p>
                <p className="text-sm text-gray-400">Choose the destination</p>
              </div>
              <div className="px-5 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check in</p>
                <p className="text-sm text-gray-400">Add date</p>
              </div>
              <div className="px-5 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check out</p>
                <p className="text-sm text-gray-400">Add date</p>
              </div>
              <div className="px-5 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Visitors</p>
                <p className="text-sm text-gray-400">2 guests</p>
              </div>
              <button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors ml-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommended Places */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Recommended Places to Stay</h2>
            </div>
            <Link href="/search" className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayListings.slice(0, 4).map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={`/listing/${listing.id}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={listing.images?.[0] || listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-gray-900">
                        {listing.overall_rating?.toFixed(1) || listing.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{listing.title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">{listing.location}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-900">
                    <span className="font-bold text-base">{listing.price_per_night || listing.price} GEL</span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Muse Section */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Kaya Muse</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              Open the guide before you book the trip. Region guides, cultural context, weather, phrasebook, emergency contacts and practical travel notes are all part of the basic Muse experience described for Phase 1.
            </p>
            <Link
              href="/muse"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Explore Muse
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
