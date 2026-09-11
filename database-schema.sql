-- ============================================
-- KAYA.GE COMPLETE DATABASE SCHEMA
-- PostgreSQL with Supabase
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'tourist', -- tourist, business, admin
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  language VARCHAR(10) DEFAULT 'en', -- en, ka, ru
  nationality VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active', -- active, banned, suspended
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- hotels, restaurants, cars, tours, services, salons
  description TEXT,
  logo_url TEXT,
  address VARCHAR(255),
  city VARCHAR(100),
  region VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  subscription_status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  subscription_plan VARCHAR(20) DEFAULT 'basic', -- basic, pro
  next_billing_date DATE,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_city (city),
  INDEX idx_verified (verified),
  INDEX idx_rating (rating)
);

-- ============================================
-- LISTINGS TABLE
-- ============================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  image_urls TEXT[], -- Array of image URLs
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GEL',
  amenities TEXT[], -- Array of amenities
  location VARCHAR(255),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(20) DEFAULT 'active', -- active, paused, archived
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  featured_until DATE,
  cancellation_policy VARCHAR(20) DEFAULT 'flexible', -- flexible, moderate, strict
  min_stay INT DEFAULT 1,
  max_guests INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_business_id (business_id),
  INDEX idx_category (category),
  INDEX idx_city (city),
  INDEX idx_status (status),
  INDEX idx_featured (featured),
  INDEX idx_rating (rating),
  FULLTEXT INDEX ft_search (title, description)
);

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
CREATE TABLE availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  reason VARCHAR(20) DEFAULT 'blocked', -- blocked, booked
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_listing_id (listing_id),
  INDEX idx_dates (date_from, date_to)
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  tourist_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GEL',
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method VARCHAR(50) DEFAULT 'card', -- card, cash
  stripe_payment_id VARCHAR(255),
  message TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX idx_listing_id (listing_id),
  INDEX idx_tourist_id (tourist_id),
  INDEX idx_business_id (business_id),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_dates (check_in_date, check_out_date)
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tourist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  overall_rating INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating INT CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  location_rating INT CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),
  text TEXT,
  photo_urls TEXT[],
  reply_text TEXT,
  reply_by_business_id UUID REFERENCES businesses(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_listing_id (listing_id),
  INDEX idx_tourist_id (tourist_id),
  INDEX idx_published (published)
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_booking_id (booking_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL DEFAULT 'basic', -- basic, pro
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GEL',
  status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  current_period_start DATE,
  current_period_end DATE,
  next_billing_date DATE,
  stripe_subscription_id VARCHAR(255),
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_business_id (business_id),
  INDEX idx_status (status),
  INDEX idx_next_billing_date (next_billing_date)
);

-- ============================================
-- FEATURED BOOSTS TABLE
-- ============================================
CREATE TABLE featured_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  stripe_charge_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_listing_id (listing_id),
  INDEX idx_dates (start_date, end_date)
);

-- ============================================
-- MUSE ARTICLES TABLE
-- ============================================
CREATE TABLE muse_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  body TEXT NOT NULL,
  region VARCHAR(100),
  category VARCHAR(50), -- guide, event, recipe, phrase, culture
  cover_image_url TEXT,
  excerpt TEXT,
  language VARCHAR(10) DEFAULT 'en',
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES users(id),
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_region (region),
  INDEX idx_category (category),
  INDEX idx_published (published),
  INDEX idx_language (language)
);

-- ============================================
-- AI CHAT SESSIONS TABLE
-- ============================================
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_key VARCHAR(255) UNIQUE NOT NULL,
  messages JSONB,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '7 days',
  INDEX idx_session_key (session_key),
  INDEX idx_user_id (user_id)
);

-- ============================================
-- GEORGIAN MOMENT TABLE (Phase 2)
-- ============================================
CREATE TABLE georgian_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- cooking, wine, music, farm, etc.
  image_urls TEXT[],
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GEL',
  duration_minutes INT,
  max_participants INT,
  available_date DATE,
  available_time_from TIME,
  available_time_to TIME,
  location VARCHAR(255),
  city VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  rating DECIMAL(3, 2) DEFAULT 0,
  total_bookings INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_host_id (host_id),
  INDEX idx_available_date (available_date),
  INDEX idx_city (city)
);

-- ============================================
-- E-COMMERCE PRODUCTS TABLE (Phase 2)
-- ============================================
CREATE TABLE ecommerce_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GEL',
  category VARCHAR(50),
  stock INT DEFAULT 0,
  image_urls TEXT[],
  supplier_id UUID REFERENCES businesses(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_supplier_id (supplier_id)
);

-- ============================================
-- E-COMMERCE ORDERS TABLE (Phase 2)
-- ============================================
CREATE TABLE ecommerce_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
  total_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GEL',
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  items JSONB NOT NULL, -- Array of {product_id, quantity, price}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_business_id (business_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- AGENCY REQUESTS TABLE (Phase 2)
-- ============================================
CREATE TABLE agency_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_type VARCHAR(50), -- website, social_media, branding, photography
  details TEXT,
  budget DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  assigned_to UUID REFERENCES users(id),
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX idx_business_id (business_id),
  INDEX idx_status (status)
);

-- ============================================
-- PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50), -- subscription, booking, boost, ecommerce, agency
  related_id UUID, -- ID of booking, subscription, etc.
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GEL',
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method VARCHAR(50),
  stripe_transaction_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_business_id (business_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Create composite indexes for common queries
CREATE INDEX idx_listings_city_status ON listings(city, status);
CREATE INDEX idx_listings_category_status ON listings(category, status);
CREATE INDEX idx_bookings_tourist_status ON bookings(tourist_id, status);
CREATE INDEX idx_bookings_business_status ON bookings(business_id, status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating DESC);
CREATE INDEX idx_users_email_role ON users(email, role);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for active listings with ratings
CREATE VIEW active_listings_with_stats AS
SELECT 
  l.id,
  l.title,
  l.price,
  l.rating,
  l.total_reviews,
  l.city,
  l.category,
  b.name as business_name,
  b.rating as business_rating,
  COUNT(DISTINCT bk.id) as total_bookings
FROM listings l
LEFT JOIN businesses b ON l.business_id = b.id
LEFT JOIN bookings bk ON l.id = bk.listing_id AND bk.status = 'completed'
WHERE l.status = 'active'
GROUP BY l.id, b.id;

-- View for upcoming bookings
CREATE VIEW upcoming_bookings AS
SELECT 
  b.id,
  b.listing_id,
  b.business_id,
  b.tourist_id,
  b.check_in_date,
  b.check_out_date,
  l.title as listing_title,
  u.first_name as tourist_name,
  u.email as tourist_email,
  b.number_of_guests,
  b.total_price
FROM bookings b
JOIN listings l ON b.listing_id = l.id
JOIN users u ON b.tourist_id = u.id
WHERE b.check_in_date >= CURRENT_DATE 
  AND b.status IN ('pending', 'confirmed');
