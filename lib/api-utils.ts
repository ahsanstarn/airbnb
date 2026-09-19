import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';

export function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
  return createClient(url, key);
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
  return createClient(url, key);
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

/**
 * Safely parse JSON from a NextRequest without throwing uncaught 500 exceptions.
 * Returns either { data, error: null } on valid JSON or { data: null, error: NextResponse } with 400 status.
 */
export async function parseJsonBody<T = any>(
  request: NextRequest
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const text = await request.text();
    if (!text || !text.trim()) {
      return {
        data: null,
        error: NextResponse.json(
          { error: 'Missing or empty request body' },
          { status: 400 }
        ),
      };
    }
    const data = JSON.parse(text);
    if (data === null || typeof data !== 'object') {
      return {
        data: null,
        error: NextResponse.json(
          { error: 'Invalid JSON payload. Expected a JSON object' },
          { status: 400 }
        ),
      };
    }
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Malformed JSON payload', details: err?.message },
        { status: 400 }
      ),
    };
  }
}

