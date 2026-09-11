import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function PUT(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(_request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const bookings = db.collection('bookings');

    let query: any = {};
    if (ObjectId.isValid(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { $or: [{ _id: params.id }, { id: params.id }] };
    }

    const booking = await bookings.findOne(query);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify host ownership or admin
    const isBusiness = booking.business_id === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isBusiness && !isAdmin && user.role !== 'business') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await bookings.updateOne(query, {
      $set: {
        status: 'CONFIRMED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, status: 'CONFIRMED' });
  } catch (err) {
    console.error('Confirmation error:', err);
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 });
  }
}
