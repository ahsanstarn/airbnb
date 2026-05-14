import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('availability_blocks')
      .select('*')
      .eq('listing_id', params.id)
      .order('date_from', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: listing } = await supabase.from('listings').select('business_id').eq('id', params.id).single();
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
    if (!business || business.id !== listing.business_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (body.action === 'block' || body.action === 'unblock') {
      if (body.action === 'block') {
        const { data, error } = await supabase.from('availability_blocks').insert({
          listing_id: params.id,
          date_from: body.date_from,
          date_to: body.date_to,
          reason: body.reason || 'BLOCKED',
          seasonal_price: body.seasonal_price || null,
        }).select();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data[0]);
      } else {
        const { error } = await supabase
          .from('availability_blocks')
          .delete()
          .eq('listing_id', params.id)
          .eq('date_from', body.date_from)
          .eq('date_to', body.date_to);
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: 'Invalid action. Use "block" or "unblock".' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Availability update failed' }, { status: 500 });
  }
}
