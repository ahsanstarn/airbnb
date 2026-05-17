import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getAuthenticatedUser, requireAuth } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { service_type, details } = body;

    if (!service_type) {
      return NextResponse.json({ error: 'Service type is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Find the user's business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user!.id)
      .single();

    const payload: any = { service_type, details, status: 'PENDING' };
    if (business) {
      payload.business_id = business.id;
    }

    const { data, error } = await supabase
      .from('agency_requests')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ request: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
