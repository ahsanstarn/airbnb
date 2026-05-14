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
      .update({ status: 'COMPLETED', payment_status: 'COMPLETED', updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, status: 'COMPLETED' });
  } catch {
    return NextResponse.json({ error: 'Completion failed' }, { status: 500 });
  }
}
