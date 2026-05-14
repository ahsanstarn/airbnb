import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();
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
