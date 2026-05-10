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
