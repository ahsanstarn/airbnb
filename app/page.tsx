'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch featured listings
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/listings?sort=recommended&limit=6');
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('city', searchParams.location);
    if (searchParams.checkIn) params.append('date_from', searchParams.checkIn);
    if (searchParams.checkOut) params.append('date_to', searchParams.checkOut);
    window.location.href = `/search?${params.toString()}`;
  };

  const categories = [
    { name: 'Hotels', icon: '🏨', href: '/search?category=hotels' },
    { name: 'Restaurants', icon: '🍽️', href: '/search?category=restaurants' },
    { name: 'Tours', icon: '🧭', href: '/search?category=tours' },
    { name: 'Cars', icon: '🚗', href: '/search?category=cars' },
    { name: 'Experiences', icon: '✨', href: '/search?category=experiences' },
    { name: 'Salons & Spas', icon: '💆', href: '/search?category=salons' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden"
      >
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&h=600&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-12 py-20">
          {/* Left side - Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 max-w-2xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Georgia
              <br />
              <span className="text-amber-200">Like Never Before</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-lg">
              From mountain peaks to wine valleys, experience authentic Georgian hospitality. Book your perfect stay, meal, or adventure.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-full shadow-2xl p-4 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={searchParams.location}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, location: e.target.value })
                    }
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Divider */}
                <div className="hidden md:block h-6 bg-gray-200" />

                {/* Check In */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <input
                    type="date"
                    value={searchParams.checkIn}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, checkIn: e.target.value })
                    }
                    className="flex-1 outline-none text-gray-700"
                  />
                </div>

                {/* Divider */}
                <div className="hidden md:block h-6 bg-gray-200" />

                {/* Check Out & Guests */}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <input
                    type="number"
                    min="1"
                    placeholder="Guests"
                    value={searchParams.guests}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        guests: parseInt(e.target.value),
                      })
                    }
                    className="w-12 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Quick Links */}
            <div className="flex gap-4 text-white/80 text-sm">
              <button className="hover:text-white transition">Popular destinations</button>
              <button className="hover:text-white transition">What's trending</button>
            </div>
          </motion.div>

          {/* Right side - Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block flex-1 relative h-full"
          >
            {/* Decorative border circle with accent */}
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
              {/* Red decorative curve */}
              <svg
                className="absolute right-0 top-0 w-96 h-96"
                viewBox="0 0 200 200"
                fill="none"
                stroke="rgba(239, 68, 68, 0.8)"
                strokeWidth="8"
                strokeLinecap="round"
              >
                <path d="M 40 80 Q 100 40, 160 120" />
                <path d="M 30 180 Q 80 140, 180 60" />
              </svg>

              {/* Image showcase circles */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute right-40 top-20 w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white/20"
              >
                <img
                  src="https://images.unsplash.com/photo-1584730116562-40fc08d94a36?w=200&h=200&fit=crop"
                  alt="Georgian Wine"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute right-10 top-48 w-28 h-28 rounded-full overflow-hidden shadow-xl border-4 border-white/20"
              >
                <img
                  src="https://images.unsplash.com/photo-1522932424441-280d2d542904?w=200&h=200&fit=crop"
                  alt="Georgian Food"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4.5, repeat: Infinity }}
                className="absolute right-32 bottom-20 w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white/20"
              >
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop"
                  alt="Georgian Mountains"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <section className="py-20 px-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">What are you looking for?</h2>
          <p className="text-gray-600 mb-12 text-lg">Browse by category</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.a
                key={category.name}
                href={category.href}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <p className="font-semibold text-gray-900">{category.name}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 px-12 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-gray-900">Featured Stays</h2>
              <p className="text-gray-600">Handpicked accommodations across Georgia</p>
            </div>
            <Link
              href="/search"
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
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
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-12 bg-gradient-to-r from-orange-500 to-red-500 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
          </motion.div>

          <h2 className="text-4xl font-bold mb-4">Ready to explore Georgia?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of travelers discovering authentic Georgian experiences
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/search"
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Start Exploring
            </Link>
            <Link
              href="/chat"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold hover:bg-white/30 transition-colors"
            >
              Chat with NINO AI
            </Link>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
                  src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop"
                  alt="Kakheti Vineyard House"
                  fill
                  className={styles.image}
                />
              </div>
              <h3 className={styles.propertyTitle}>Kakheti Vineyard House</h3>
            </Link>

            <Link href="/listing/3" className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                <Image
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
                  alt="Batumi Sea View Loft"
                  fill
                  className={styles.image}
                />
              </div>
              <h3 className={styles.propertyTitle}>Batumi Sea View Loft</h3>
            </Link>

            <Link href="/listing/4" className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                <Image
                  src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop"
                  alt="Kazbegi Ridge Cabin"
                  fill
                  className={styles.image}
                />
              </div>
              <h3 className={styles.propertyTitle}>Kazbegi Ridge Cabin</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.muse}>
        <div className={styles.container}>
          <h2 className={styles.museTitle}>Kaya Muse</h2>
          <p className={styles.museDescription}>
            Open the guide before you book the trip.
            Region guides, cultural context, weather, phrasebook, emergency contacts and practical travel notes are all part of the basic Muse experience described for Phase 1.
          </p>
          <Link href="/muse" className={styles.exploreBtn}>Explore Muse</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Product</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/hotels">Hotels</Link></li>
              <li><Link href="/restaurants">Restaurants</Link></li>
              <li><Link href="/tours">Tours</Link></li>
              <li><Link href="/muse">Muse</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Company</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Platform</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/dashboard">Tourist dashboard</Link></li>
              <li><Link href="/business/dashboard">Business dashboard</Link></li>
              <li><Link href="/admin">Admin panel</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>kaya.ge</h3>
            <p className={styles.footerDescription}>
              Discover Georgia through curated stays, services, structured platform flows and thoughtful local context.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
