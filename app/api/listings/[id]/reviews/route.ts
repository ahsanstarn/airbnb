import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSupabase } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Try MongoDB reviews first
    const db = await getDb();
    const reviews = await db.collection('reviews')
      .find({
        $or: [{ listing_id: params.id }, { listingId: params.id }],
      })
      .sort({ created_at: -1 })
      .toArray();

    if (reviews && reviews.length > 0) {
      return NextResponse.json(reviews);
    }

    // 2. Fallback to Supabase if MongoDB has none
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', params.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    } catch {}

    return NextResponse.json(reviews || []);
  } catch {
    return NextResponse.json([]);
  }
}
