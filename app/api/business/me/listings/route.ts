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

    const listings = await db.collection('listings')
      .find({ $or: [{ businessId: userId }, { hostId: userId }, { owner_id: userId }] })
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();

    const formatted = listings.map(l => ({
      ...l,
      id: l._id.toString(),
      _id: l._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
