import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, parseJsonBody } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }
    const { refresh_token } = body;
    if (!refresh_token) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ session: data.session, user: data.user });
  } catch {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
