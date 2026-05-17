import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

// POST /api/bookings - Create booking
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listing_id, check_in, check_out, guest_count, payment_method } = body;

    // Check for availability
    const { data: conflicts } = await supabase
      .from('availability_blocks')
      .select('*')
      .eq('listing_id', listing_id)
      .eq('reason', 'BOOKED')
      .gte('date_to', check_in)
      .lte('date_from', check_out);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Dates not available' }, { status: 409 });
    }

    // Get listing price
    const { data: listing } = await supabase
      .from('listings')
      .select('price_per_night')
      .eq('id', listing_id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Calculate total price
    const start = new Date(check_in);
    const end = new Date(check_out);
    const nights = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const total_price = nights * listing.price_per_night;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        listing_id,
        tourist_id: user.id,
        check_in,
        check_out,
        guest_count,
        total_price,
        payment_method,
        status: 'PENDING',
        payment_status: payment_method === 'cash' ? 'PENDING' : 'PENDING',
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
  }
}

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        listings (id, title, images, location)
      `
      )
      .eq('tourist_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
