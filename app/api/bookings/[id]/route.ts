import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(_request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('bookings')
      .select('*, listings(id, title, images, location, price_per_night)')
      .eq('id', params.id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    if (data.tourist_id !== user.id) {
      const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
      const { data: listing } = await supabase.from('listings').select('business_id').eq('id', data.listing_id).single();
      if (!biz || !listing || biz.id !== listing.business_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}
