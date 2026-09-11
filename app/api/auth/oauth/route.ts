import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get('provider') as 'google' | 'facebook';
  if (!provider || !['google', 'facebook'].includes(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }

  const supabase = getSupabase();
  const origin = request.nextUrl.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ url: data.url });
}
