import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

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
