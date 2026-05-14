import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const body = await request.json();
    const { booking_id, text, receiver_id } = body;

    if (!booking_id || !text || !receiver_id) {
      return NextResponse.json({ error: 'booking_id, text, and receiver_id required' }, { status: 400 });
    }

    const { data: booking } = await supabase.from('bookings').select('id').eq('id', booking_id).single();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const { data, error } = await supabase.from('messages').insert({
      booking_id,
      sender_id: user.id,
      receiver_id,
      text,
    }).select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
