import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabase();

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from('page_views')
      .select('visitor_id', { count: 'exact', head: true })
      .gte('visited_at', fiveMinAgo);

    if (error) {
      return NextResponse.json({ count: 0, error: error.message });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    return NextResponse.json({ count: 0, error: 'Failed to fetch live viewers' });
  }
}
