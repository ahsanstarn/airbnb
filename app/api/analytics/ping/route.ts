import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, parseJsonBody } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }
    const { visitor_id, page_path, referrer } = body;

    try {
      const supabase = getSupabase();
      await supabase.from('page_views').insert({
        visitor_id: visitor_id || 'anonymous',
        page_path: page_path || '/',
        referrer: referrer || null,
        user_agent: request.headers.get('user-agent') || null,
      });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
