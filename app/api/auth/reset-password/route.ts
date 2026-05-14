import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { access_token, new_password } = await request.json();
    if (!access_token || !new_password) {
      return NextResponse.json({ error: 'Access token and new password required' }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.exchangeCodeForSession(access_token);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { error: updateError } = await supabase.auth.updateUser({ password: new_password });
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

    return NextResponse.json({ ok: true, message: 'Password updated successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
