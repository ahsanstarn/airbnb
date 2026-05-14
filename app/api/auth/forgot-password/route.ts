import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const supabase = getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get('origin') || 'http://localhost:3000'}/api/auth/reset-password`,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, message: 'Password reset email sent' });
  } catch {
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
  }
}
