import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';

export function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export async function getAuthenticatedUser(request: NextRequest) {
  // 1. Check MongoDB session first
  try {
    const mongoUser = await getCurrentUser(request);
    if (mongoUser) {
      return {
        id: mongoUser._id.toString(),
        email: mongoUser.email,
        role: mongoUser.role,
        user_metadata: {
          role: mongoUser.role,
          name: mongoUser.name,
          affiliateCode: mongoUser.affiliateCode,
        },
      };
    }
  } catch {
    // Continue to Supabase fallback
  }

  // 2. Fallback to Supabase
  try {
    const supabase = getSupabase();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    return user;
  } catch {
    return null;
  }
}

export function requireAuth(user: any) {
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function errorResponse(error: unknown, message: string) {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
}
