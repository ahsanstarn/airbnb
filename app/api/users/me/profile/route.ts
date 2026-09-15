import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const fullUser = await db.collection('users').findOne({ _id: user._id });

    return NextResponse.json({
      _id: fullUser?._id,
      name: fullUser?.name,
      email: fullUser?.email,
      phone: fullUser?.phone || '',
      avatar: fullUser?.avatar || '',
      bio: fullUser?.bio || '',
      role: fullUser?.role,
      affiliateCode: fullUser?.affiliateCode,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const body = await request.json();

    const updateFields: any = {};
    if (body.name !== undefined) updateFields.name = body.name;
    if (body.phone !== undefined) updateFields.phone = body.phone;
    if (body.avatar !== undefined) updateFields.avatar = body.avatar;
    if (body.bio !== undefined) updateFields.bio = body.bio;
    updateFields.updatedAt = new Date();

    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, user: { ...user, ...updateFields } });
  } catch {
    return NextResponse.json({ error: 'Profile update failed' }, { status: 500 });
  }
}
