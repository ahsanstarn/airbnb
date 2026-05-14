import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const { data, error } = await supabase
      .from('bookings')
      .select('*, listings!inner(id, title, images, location, business_id)')
      .eq('listings.business_id', business.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch business bookings' }, { status: 500 });
  }
}
