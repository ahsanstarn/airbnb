import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { SEED_LISTINGS } from '@/lib/seed-data';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET /api/listings - Search & filter listings from MongoDB
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const listingsCollection = db.collection('listings');

    // Auto-seed if empty
    const countTotal = await listingsCollection.countDocuments();
    if (countTotal === 0) {
      const now = new Date();
      const seedData = SEED_LISTINGS.map(l => ({
        ...l,
        createdAt: now,
        updatedAt: now,
      }));
      await listingsCollection.insertMany(seedData);
    }

    const searchParams = request.nextUrl.searchParams;
    const mine = searchParams.get('mine');
    const category = searchParams.get('category') || searchParams.get('type');
    const city = searchParams.get('city') || searchParams.get('location');
    const q = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'recommended';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 12;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (mine === 'true') {
      const user = await getCurrentUser(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      filter.$or = [
        { businessId: user._id },
        { businessId: user._id.toString() },
      ];
    } else {
      filter.is_published = true;
    }

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter.$or = [
        { city: { $regex: city, $options: 'i' } },
        { location: { $regex: city, $options: 'i' } }
      ];
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price_per_night = {};
      if (minPrice) filter.price_per_night.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price_per_night.$lte = parseFloat(maxPrice);
    }

    // Sort definition
    let sortQuery: any = { is_featured: -1, createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price_per_night: 1 };
    if (sort === 'price_desc') sortQuery = { price_per_night: -1 };
    if (sort === 'rating') sortQuery = { overall_rating: -1 };
    if (sort === 'newest') sortQuery = { createdAt: -1 };

    const total = await listingsCollection.countDocuments(filter);
    const docs = await listingsCollection
      .find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();

    const listings = docs.map(doc => ({
      ...doc,
      id: doc._id.toString(),
      _id: doc._id.toString(),
    }));

    return NextResponse.json({
      listings,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('Listings search error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

// POST /api/listings - Create listing (Business only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      price_per_night,
      location,
      city,
      images,
      amenities,
      type,
      beds,
      baths,
      guests,
    } = body;

    if (!title || !price_per_night || !location) {
      return NextResponse.json({ error: 'Missing required listing fields' }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();

    const newListing = {
      businessId: user._id,
      businessName: user.name,
      businessEmail: user.email,
      title,
      description: description || '',
      category: category || 'apartments',
      type: type || 'Entire place',
      price_per_night: parseFloat(price_per_night),
      currency: 'GEL',
      location,
      city: city || location.split(',')[0].trim(),
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map((s: string) => s.trim()) : ['WiFi', 'Kitchen']),
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop'
      ],
      host: user.name,
      beds: beds ? parseInt(beds, 10) : 1,
      baths: baths ? parseInt(baths, 10) : 1,
      guests: guests ? parseInt(guests, 10) : 2,
      overall_rating: 5.0,
      review_count: 0,
      views_count: 1,
      is_published: true,
      is_featured: false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('listings').insertOne(newListing);

    return NextResponse.json({
      success: true,
      listing: {
        ...newListing,
        id: result.insertedId.toString(),
        _id: result.insertedId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
