import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const userId = user._id.toString();

    const saved = await db.collection('saved_listings')
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch saved listings' }, { status: 500 });
  }
}
