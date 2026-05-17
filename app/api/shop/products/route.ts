import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('q');

  const supabase = getSupabaseAdmin();
  let query = supabase.from('ecommerce_products').select('*').order('name');

  if (category) {
    query = query.eq('category', category);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const categories = Array.from(new Set((data || []).map(p => p.category)));
  return NextResponse.json({ products: data || [], categories });
}
