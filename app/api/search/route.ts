import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { SEED_LISTINGS } from '@/lib/seed-data';
import { parseJsonBody } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

interface SearchParams {
  q?: string;
  location?: string;
  city?: string;
  region?: string;
  category?: string;
  type?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

function filterListingsInMemory(listings: any[], params: SearchParams) {
  let result = [...listings];

  const q = (params.q || '').trim().toLowerCase();
  if (q) {
    result = result.filter(item => {
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchCity = item.city?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      const matchHost = item.host?.toLowerCase().includes(q);
      const matchAmenities = Array.isArray(item.amenities) && item.amenities.some((a: string) => a.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchLoc || matchCity || matchCat || matchHost || matchAmenities;
    });
  }

  const loc = (params.location || params.city || params.region || '').trim().toLowerCase();
  if (loc) {
    result = result.filter(item => {
      const c = (item.city || '').toLowerCase();
      const l = (item.location || '').toLowerCase();
      return c.includes(loc) || l.includes(loc) || loc.includes(c);
    });
  }

  const cat = (params.category || params.type || '').trim().toLowerCase();
  if (cat && cat !== 'all') {
    const singular = cat.replace(/s$/, '');
    result = result.filter(item => {
      const c = (item.category || '').toLowerCase();
      const t = (item.type || '').toLowerCase();
      return c.includes(singular) || t.includes(singular);
    });
  }

  if (params.guests && params.guests > 0) {
    result = result.filter(item => (Number(item.guests) || 1) >= params.guests!);
  }

  if (params.minPrice !== undefined) {
    result = result.filter(item => (Number(item.price_per_night || item.price) || 0) >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    result = result.filter(item => (Number(item.price_per_night || item.price) || 0) <= params.maxPrice!);
  }

  // Sorting
  const sort = params.sort || 'recommended';
  if (sort === 'price_asc') {
    result.sort((a, b) => (Number(a.price_per_night || a.price) || 0) - (Number(b.price_per_night || b.price) || 0));
  } else if (sort === 'price_desc') {
    result.sort((a, b) => (Number(b.price_per_night || b.price) || 0) - (Number(a.price_per_night || a.price) || 0));
  } else if (sort === 'rating') {
    result.sort((a, b) => (Number(b.overall_rating) || 0) - (Number(a.overall_rating) || 0));
  } else if (sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } else {
    // recommended: featured first, then rating
    result.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (Number(b.overall_rating) || 0) - (Number(a.overall_rating) || 0);
    });
  }

  return result;
}

async function executeSearch(params: SearchParams) {
  const db = await getDb();
  const listingsCol = db.collection('listings');
  const bookingsCol = db.collection('bookings');

  // Auto-seed if empty
  const countTotal = await listingsCol.countDocuments().catch(() => 0);
  if (countTotal === 0) {
    const now = new Date();
    const seedDocs = SEED_LISTINGS.map(l => ({
      ...l,
      createdAt: now,
      updatedAt: now,
    }));
    await listingsCol.insertMany(seedDocs as any).catch(() => null);
  }

  const conditions: any[] = [{ is_published: true }];

  // 1. Text Query
  if (params.q) {
    const q = params.q.trim();
    conditions.push({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { host: { $regex: q, $options: 'i' } },
      ],
    });
  }

  // 2. Location / City / Region
  const loc = (params.location || params.city || params.region || '').trim();
  if (loc) {
    conditions.push({
      $or: [
        { city: { $regex: loc, $options: 'i' } },
        { location: { $regex: loc, $options: 'i' } },
      ],
    });
  }

  // 3. Category / Type
  const cat = (params.category || params.type || '').trim();
  if (cat && cat !== 'all') {
    const singular = cat.replace(/s$/, '');
    conditions.push({
      $or: [
        { category: { $regex: `^${singular}`, $options: 'i' } },
        { type: { $regex: `^${singular}`, $options: 'i' } },
      ],
    });
  }

  // 4. Guests
  if (params.guests && params.guests > 0) {
    conditions.push({ guests: { $gte: params.guests } });
  }

  // 5. Price Range
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    const priceFilter: any = {};
    if (params.minPrice !== undefined) priceFilter.$gte = params.minPrice;
    if (params.maxPrice !== undefined) priceFilter.$lte = params.maxPrice;
    conditions.push({ price_per_night: priceFilter });
  }

  // 6. Dates availability filter
  if (params.checkIn && params.checkOut) {
    try {
      const conflictingBookings = await bookingsCol.find({
        status: { $nin: ['CANCELLED', 'DECLINED', 'cancelled', 'declined'] },
        $and: [
          { check_in: { $lt: params.checkOut } },
          { check_out: { $gt: params.checkIn } },
        ],
      }).toArray();

      const bookedListingIds = conflictingBookings
        .map((b: any) => b.listing_id)
        .filter(Boolean);

      if (bookedListingIds.length > 0) {
        conditions.push({
          _id: { $nin: bookedListingIds },
          id: { $nin: bookedListingIds },
        });
      }
    } catch (err) {
      console.warn('[Search] Date overlap query warning:', err);
    }
  }

  const filter = conditions.length === 1 ? conditions[0] : { $and: conditions };

  // Sorting
  const sort = params.sort || 'recommended';
  let sortQuery: any = { is_featured: -1, createdAt: -1 };
  if (sort === 'price_asc') sortQuery = { price_per_night: 1 };
  if (sort === 'price_desc') sortQuery = { price_per_night: -1 };
  if (sort === 'rating') sortQuery = { overall_rating: -1 };
  if (sort === 'newest') sortQuery = { createdAt: -1 };

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(Math.max(params.limit || 12, 1), 100);
  const skip = (page - 1) * limit;

  let total = 0;
  let docs: any[] = [];

  try {
    total = await listingsCol.countDocuments(filter);
    docs = await listingsCol
      .find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();
  } catch (err) {
    console.warn('[Search] MongoDB search query failed, using static fallback:', err);
  }

  // If MongoDB returned no results or failed, apply in-memory filter to SEED_LISTINGS
  if (docs.length === 0) {
    const memoryResults = filterListingsInMemory(SEED_LISTINGS, params);
    total = memoryResults.length;
    docs = memoryResults.slice(skip, skip + limit);
  }

  const listings = docs.map((doc: any) => ({
    ...doc,
    id: doc._id?.toString() || doc.id,
    _id: doc._id?.toString() || doc.id,
  }));

  return {
    listings,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    filters: {
      q: params.q || null,
      location: loc || null,
      category: cat || null,
      checkIn: params.checkIn || null,
      checkOut: params.checkOut || null,
      guests: params.guests || null,
      minPrice: params.minPrice || null,
      maxPrice: params.maxPrice || null,
      sort,
    },
  };
}

// GET /api/search - Query handling, location search, dates, guests
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const q = searchParams.get('q') || undefined;
    const location = searchParams.get('location') || undefined;
    const city = searchParams.get('city') || undefined;
    const region = searchParams.get('region') || undefined;
    const category = searchParams.get('category') || searchParams.get('type') || undefined;
    const type = searchParams.get('type') || undefined;
    const checkIn = searchParams.get('checkIn') || searchParams.get('check_in') || undefined;
    const checkOut = searchParams.get('checkOut') || searchParams.get('check_out') || undefined;
    const guestsStr = searchParams.get('guests') || searchParams.get('guest_count');
    const guests = guestsStr ? parseInt(guestsStr, 10) : undefined;
    const minPriceStr = searchParams.get('minPrice') || searchParams.get('min_price');
    const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined;
    const maxPriceStr = searchParams.get('maxPrice') || searchParams.get('max_price');
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
    const sort = searchParams.get('sort') || 'recommended';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const result = await executeSearch({
      q,
      location,
      city,
      region,
      category,
      type,
      checkIn,
      checkOut,
      guests: isNaN(guests as number) ? undefined : guests,
      minPrice: isNaN(minPrice as number) ? undefined : minPrice,
      maxPrice: isNaN(maxPrice as number) ? undefined : maxPrice,
      sort,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 12 : limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search', details: error?.message },
      { status: 500 }
    );
  }
}

// POST /api/search - Query handling via JSON body with graceful error handling
export async function POST(request: NextRequest) {
  try {
    const { data: body, error: jsonError } = await parseJsonBody<SearchParams>(request);
    if (jsonError) {
      return jsonError;
    }

    const result = await executeSearch({
      q: body.q,
      location: body.location,
      city: body.city,
      region: body.region,
      category: body.category,
      type: body.type,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests ? Number(body.guests) : undefined,
      minPrice: body.minPrice !== undefined ? Number(body.minPrice) : undefined,
      maxPrice: body.maxPrice !== undefined ? Number(body.maxPrice) : undefined,
      sort: body.sort || 'recommended',
      page: body.page ? Number(body.page) : 1,
      limit: body.limit ? Number(body.limit) : 12,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search', details: error?.message },
      { status: 500 }
    );
  }
}
