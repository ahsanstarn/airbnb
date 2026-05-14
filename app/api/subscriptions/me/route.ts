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
      .from('subscriptions')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || { status: 'NONE', plan: null });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
