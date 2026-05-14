import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(_request: NextRequest, { params }: { params: { booking_id: string } }) {
  try {
    const user = await getAuthenticatedUser(_request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, tourist_id, listing_id')
      .eq('id', params.booking_id)
      .single();

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).maybeSingle();
    const { data: listing } = await supabase.from('listings').select('business_id').eq('id', booking.listing_id).single();

    const isTourist = booking.tourist_id === user.id;
    const isBusiness = business && listing && business.id === listing.business_id;

    if (!isTourist && !isBusiness) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('booking_id', params.booking_id)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('booking_id', params.booking_id)
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
