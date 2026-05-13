import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const [
      { count: listingCount },
      { count: bookingCount },
      { count: userCount },
      { count: liveViewerCount },
    ] = await Promise.all([
      supabase.from('listings').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('businesses').select('user_id', { count: 'exact', head: true }),
      supabase.from('page_views').select('visitor_id', { count: 'exact', head: true }).gte('visited_at', fiveMinAgo),
    ]);

    return NextResponse.json({
      listings: listingCount || 0,
      bookings: bookingCount || 0,
      users: userCount || 0,
      liveViewers: liveViewerCount || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { listings: 0, bookings: 0, users: 0, liveViewers: 0, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
