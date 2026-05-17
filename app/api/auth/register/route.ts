import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/api-utils';

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    const supabase = getSupabaseAdmin();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

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
