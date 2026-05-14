import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(_request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: review } = await supabase
      .from('reviews')
      .select('id, listing_id, business_reply')
      .eq('id', params.id)
      .single();

    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    if (review.business_reply) return NextResponse.json({ error: 'Already replied' }, { status: 409 });

    const { data: listing } = await supabase.from('listings').select('business_id').eq('id', review.listing_id).single();
    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
    if (!business || !listing || business.id !== listing.business_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reply } = await _request.json();
    if (!reply) return NextResponse.json({ error: 'Reply text required' }, { status: 400 });

    const { error } = await supabase
      .from('reviews')
      .update({ business_reply: reply, business_reply_date: new Date().toISOString() })
      .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, reply });
  } catch {
    return NextResponse.json({ error: 'Reply failed' }, { status: 500 });
  }
}
