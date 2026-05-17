import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from('businesses')
      .update(body)
      .eq('user_id', user.id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data || data.length === 0) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    return NextResponse.json(data[0]);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
