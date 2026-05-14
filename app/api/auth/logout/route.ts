import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export async function POST() {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
