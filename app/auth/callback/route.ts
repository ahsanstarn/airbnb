import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin';

  if (code) {
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session?.access_token) {
      return NextResponse.redirect(`${origin}${next}?kaya_token=${encodeURIComponent(data.session.access_token)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
