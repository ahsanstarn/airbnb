import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { parseJsonBody } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const userId = user._id.toString();

    const business = await db.collection('businesses').findOne({ user_id: userId });
    if (!business) {
      // Return user as business profile if no separate business record
      return NextResponse.json({
        _id: userId,
        user_id: userId,
        name: user.name || 'My Business',
        email: user.email,
        role: user.role,
        status: 'active',
      });
    }

    return NextResponse.json(business);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }
    const db = await getDb();
    const userId = user._id.toString();

    await db.collection('businesses').updateOne(
      { user_id: userId },
      { $set: { ...body, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
