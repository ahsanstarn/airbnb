-- KAYA.GE Database Schema - Complete Phase 1
-- PostgreSQL with Supabase Auth Integration

-- ============================================
-- 1. BUSINESSES TABLE (with Supabase Auth integration)
-- ============================================
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- hotels, restaurants, cars, tours, services, salons
    description TEXT,
    address TEXT,
    city TEXT,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    phone TEXT,
    website TEXT,
    is_verified BOOLEAN DEFAULT false,
    subscription_plan TEXT DEFAULT 'BASIC', -- BASIC (20 GEL), PRO
    subscription_status TEXT DEFAULT 'PENDING', -- PENDING, ACTIVE, SUSPENDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 2. LISTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- hotels, restaurants, cars, tours, services, salons
    price_per_night NUMERIC(10, 2),
    currency TEXT DEFAULT 'GEL',
    location TEXT,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    payment_methods TEXT[] DEFAULT '{"card", "cash"}',
    overall_rating NUMERIC(3, 2),
    review_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    featured_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 3. AVAILABILITY BLOCKS (Double-booking prevention)
-- ============================================
CREATE TABLE IF NOT EXISTS public.availability_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    reason TEXT, -- BOOKED, BLOCKED, SEASONAL_PRICING
    seasonal_price NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 4. BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id),
    tourist_id UUID REFERENCES auth.users(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guest_count INTEGER NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'GEL',
    status TEXT DEFAULT 'PENDING', -- PENDING, CONFIRMED, COMPLETED, CANCELLED
    payment_status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, REFUNDED
    payment_method TEXT, -- card, cash
    cancellation_policy TEXT DEFAULT 'flexible', -- flexible, moderate, strict
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 5. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id),
    tourist_id UUID REFERENCES auth.users(id),
    listing_id UUID REFERENCES public.listings(id),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    text TEXT,
    photos TEXT[],
    business_reply TEXT,
    business_reply_date TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 6. MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id),
    sender_id UUID REFERENCES auth.users(id),
    receiver_id UUID REFERENCES auth.users(id),
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 7. SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID UNIQUE REFERENCES public.businesses(id) ON DELETE CASCADE,
    plan TEXT DEFAULT 'BASIC', -- BASIC, PRO
    amount NUMERIC(10, 2) DEFAULT 20,
    currency TEXT DEFAULT 'GEL',
    status TEXT DEFAULT 'PENDING', -- PENDING, ACTIVE, EXPIRED, CANCELLED
    billing_cycle_start DATE,
    next_billing_date DATE,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 8. FEATURED BOOSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.featured_boosts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount_paid NUMERIC(10, 2),
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, PAUSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 9. MUSE ARTICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.muse_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    body TEXT,
    region TEXT,
    category TEXT, -- guide, event, food, culture, transportation
    cover_image TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 10. AI CHAT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    message_text TEXT,
    response_text TEXT,
    model TEXT DEFAULT 'claude-sonnet-4-20250514',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 11. E-COMMERCE PRODUCTS (Phase 2)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ecommerce_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 12. AGENCY REQUESTS (Phase 2)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agency_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL, -- WEBSITE, SOCIAL_MEDIA
    details TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_listings_business_id ON public.listings(business_id);
CREATE INDEX idx_listings_category ON public.listings(category);
CREATE INDEX idx_listings_city ON public.listings(location);
CREATE INDEX idx_listings_is_published ON public.listings(is_published);
CREATE INDEX idx_bookings_tourist_id ON public.bookings(tourist_id);
CREATE INDEX idx_bookings_listing_id ON public.bookings(listing_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_availability_listing_id ON public.availability_blocks(listing_id);
CREATE INDEX idx_availability_dates ON public.availability_blocks(date_from, date_to);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Public can view listings" ON public.listings FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view muse" ON public.muse_articles FOR SELECT USING (is_published = true);

-- User-specific policies
CREATE POLICY "Users can view own chats" ON public.ai_chat_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

