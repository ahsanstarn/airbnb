import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const body = await request.json();
    const { booking_id, listing_id, overall_rating, text, photos, cleanliness_rating, location_rating, value_rating } = body;

    if (!booking_id || !listing_id || !overall_rating) {
      return NextResponse.json({ error: 'booking_id, listing_id, and overall_rating required' }, { status: 400 });
    }

    const { data: booking } = await supabase
      .from('bookings')
      .select('id, status, tourist_id')
      .eq('id', booking_id)
      .eq('listing_id', listing_id)
      .single();

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (booking.tourist_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 });
    }

    const { data: existing } = await supabase.from('reviews').select('id').eq('booking_id', booking_id).maybeSingle();
    if (existing) return NextResponse.json({ error: 'Already reviewed this booking' }, { status: 409 });

    const { data, error } = await supabase.from('reviews').insert({
      booking_id,
      tourist_id: user.id,
      listing_id,
      overall_rating,
      cleanliness_rating: cleanliness_rating || overall_rating,
      location_rating: location_rating || overall_rating,
      value_rating: value_rating || overall_rating,
      text: text || '',
      photos: photos || [],
      is_published: false,
    }).select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: allReviews } = await supabase
      .from('reviews')
      .select('overall_rating')
      .eq('listing_id', listing_id)
      .eq('is_published', true);

    if (allReviews && allReviews.length > 0) {
      const avg = allReviews.reduce((s, r) => s + r.overall_rating, 0) / allReviews.length;
      await supabase.from('listings').update({
        overall_rating: Math.round(avg * 100) / 100,
        review_count: allReviews.length,
      }).eq('id', listing_id);
    }

    return NextResponse.json(data[0]);
  } catch {
    return NextResponse.json({ error: 'Review submission failed' }, { status: 500 });
  }
}
