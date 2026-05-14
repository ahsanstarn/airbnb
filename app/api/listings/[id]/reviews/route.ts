import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('listing_id', params.id)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
