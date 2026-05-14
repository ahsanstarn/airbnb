import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function PUT(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(_request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: booking } = await supabase.from('bookings').select('*, listings!inner(business_id)').eq('id', params.id).single();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).maybeSingle();
    const isOwner = business && business.id === booking.listings.business_id;
    const isTourist = booking.tourist_id === user.id;

    if (!isOwner && !isTourist) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase
      .from('availability_blocks')
      .delete()
      .eq('listing_id', booking.listing_id)
      .eq('date_from', booking.check_in)
      .eq('date_to', booking.check_out)
      .eq('reason', 'BOOKED');

    return NextResponse.json({ ok: true, status: 'CANCELLED' });
  } catch {
    return NextResponse.json({ error: 'Cancellation failed' }, { status: 500 });
  }
}
