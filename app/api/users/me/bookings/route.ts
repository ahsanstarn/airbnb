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

    const bookings = await db.collection('bookings')
      .find({
        $or: [
          { tourist_id: userId },
          { user_id: userId },
          { user_email: user.email },
        ],
      })
      .sort({ createdAt: -1, created_at: -1 })
      .toArray();

    const formatted = bookings.map(b => ({
      ...b,
      id: b._id.toString(),
      _id: b._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
