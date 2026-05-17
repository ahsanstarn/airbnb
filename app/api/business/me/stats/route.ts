import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const { data: listings } = await supabase
      .from('listings')
      .select('id, views_count')
      .eq('business_id', business.id);

    const listingIds = listings?.map(l => l.id) || [];
    const totalViews = listings?.reduce((s, l) => s + (l.views_count || 0), 0) || 0;

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, total_price, status, created_at')
      .in('listing_id', listingIds.length > 0 ? listingIds : ['none']);

    const totalBookings = bookings?.length || 0;
    const totalRevenue = bookings?.filter(b => b.status !== 'CANCELLED').reduce((s, b) => s + (b.total_price || 0), 0) || 0;
    const bookingsToday = bookings?.filter(b => {
      if (!b.created_at) return false;
      const d = new Date(b.created_at);
      const today = new Date();
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }).length || 0;

    const { data: reviews } = await supabase
      .from('reviews')
      .select('overall_rating')
      .in('listing_id', listingIds.length > 0 ? listingIds : ['none'])
      .eq('is_published', true);

    const avgRating = reviews && reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.overall_rating, 0) / reviews.length) * 10) / 10
      : 0;

    if (bookingsError) return NextResponse.json({ error: bookingsError.message }, { status: 400 });

    return NextResponse.json({
      total_revenue: totalRevenue,
      total_views: totalViews,
      total_bookings: totalBookings,
      bookings_today: bookingsToday,
      avg_rating: avgRating,
      listing_count: listingIds.length,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
