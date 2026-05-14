import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function PUT(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(_request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: booking } = await supabase.from('bookings').select('*, listings!inner(business_id)').eq('id', params.id).single();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
    if (!business || business.id !== booking.listings.business_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CONFIRMED', updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase.from('availability_blocks').insert({
      listing_id: booking.listing_id,
      date_from: booking.check_in,
      date_to: booking.check_out,
      reason: 'BOOKED',
    });

    return NextResponse.json({ ok: true, status: 'CONFIRMED' });
  } catch {
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 });
  }
}
