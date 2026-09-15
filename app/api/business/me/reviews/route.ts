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

    // Get listings owned by this user
    const listings = await db.collection('listings')
      .find({ $or: [{ businessId: userId }, { hostId: userId }, { owner_id: userId }] })
      .toArray();

    const listingIds = listings.map(l => l._id.toString());

    const reviews = await db.collection('reviews')
      .find({ listing_id: { $in: listingIds.length > 0 ? listingIds : ['none'] } })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
