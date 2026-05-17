import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    const body = await request.json();
    const { visitor_id, page_path, referrer } = body;

    const { error } = await supabase.from('page_views').insert({
      visitor_id: visitor_id || 'anonymous',
      page_path: page_path || '/',
      referrer: referrer || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ping failed' }, { status: 500 });
  }
}
