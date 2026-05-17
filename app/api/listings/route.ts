import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

// GET /api/listings - Search with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sort = searchParams.get('sort') || 'recommended';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('is_published', true);

    if (category) query = query.eq('category', category);
    if (city) query = query.ilike('location', `%${city}%`);
    if (minPrice) query = query.gte('price_per_night', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price_per_night', parseFloat(maxPrice));
    if (minRating) query = query.gte('overall_rating', parseFloat(minRating));

    // Sorting
    if (sort === 'price_asc') query = query.order('price_per_night', { ascending: true });
    if (sort === 'price_desc') query = query.order('price_per_night', { ascending: false });
    if (sort === 'rating') query = query.order('overall_rating', { ascending: false });
    if (sort === 'newest') query = query.order('created_at', { ascending: false });

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      listings: data,
      total: count,
      page,
      pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

// POST /api/listings - Create listing (Business only)
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Get business ID for this user
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { data, error } = await supabase.from('listings').insert({
      business_id: business.id,
      title: body.title,
      description: body.description,
      category: body.category,
      price_per_night: body.price_per_night,
      location: body.location,
      latitude: body.latitude,
      longitude: body.longitude,
      amenities: body.amenities || [],
      images: body.images || [],
      is_published: false,
    }).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Create listing failed' }, { status: 500 });
  }
}
