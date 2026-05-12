import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    // Create user in Supabase Auth
    const supabase = getSupabase();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Return success
    return NextResponse.json({
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        role: role || 'tourist',
        name,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
