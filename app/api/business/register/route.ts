import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { businessName, category, description, address, city, phone, website, contactName, contactEmail } = body;

    if (!businessName || !category) {
      return NextResponse.json({ error: 'Business name and category are required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'You already have a registered business' }, { status: 409 });
    }

    const { data, error } = await supabase.from('businesses').insert({
      user_id: user.id,
      name: businessName,
      category,
      description: description || '',
      address: address || '',
      city: city || '',
      phone: phone || '',
      website: website || '',
      contact_name: contactName,
      contact_email: contactEmail,
      is_verified: false,
      subscription_plan: 'BASIC',
      subscription_status: 'PENDING',
    }).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
