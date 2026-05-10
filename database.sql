-- Create Business Category Enum
CREATE TYPE business_category AS ENUM ('HOTEL', 'RESTAURANT', 'CAR_RENTAL', 'TOUR_OPERATOR', 'BEAUTY_SPA', 'SERVICE');

-- Create Booking Status Enum
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- Create Businesses Table
CREATE TABLE public.businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category business_category NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    website TEXT,
    is_verified BOOLEAN DEFAULT false,
    subscription_plan TEXT DEFAULT 'FREE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Listings Table
CREATE TABLE public.listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GEL',
    location TEXT NOT NULL,
    lat NUMERIC,
    lng NUMERIC,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    type TEXT NOT NULL,
    guests INTEGER DEFAULT 1,
    beds INTEGER DEFAULT 1,
    baths INTEGER DEFAULT 1,
    host_name TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Bookings Table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER DEFAULT 1,
    total_amount NUMERIC NOT NULL,
    status booking_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reviews Table
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verified businesses and published listings
CREATE POLICY "Public profiles are viewable by everyone." ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Public listings are viewable by everyone." ON public.listings FOR SELECT USING (is_published = true);
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);

-- Allow authenticated users to create bookings
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);

-- Availability blocks (Double-booking prevention)
CREATE TABLE public.availability_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    reason TEXT, -- 'BOOKED' or 'BLOCKED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Stream 1: Subscriptions
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    plan TEXT DEFAULT 'BASIC', -- 'BASIC' (20 GEL) or 'PRO'
    status TEXT DEFAULT 'ACTIVE',
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GEL',
    next_billing_date TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Stream 2: E-commerce (Phase 2)
CREATE TABLE public.ecommerce_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Stream 3: Digital Agency (Phase 2)
CREATE TABLE public.agency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL, -- 'WEBSITE' or 'SOCIAL_MEDIA'
    details TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_requests ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Everyone can view availability" ON public.availability_blocks FOR SELECT USING (true);
CREATE POLICY "Businesses can view own subscriptions" ON public.subscriptions FOR SELECT USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid()));
CREATE POLICY "Everyone can view products" ON public.ecommerce_products FOR SELECT USING (true);

