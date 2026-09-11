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

    // Check if user is the tourist who booked or the business host or admin
    const isTourist = booking.tourist_id === user._id.toString() || booking.tourist_email === user.email;
    const isBusiness = booking.business_id === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isTourist && !isBusiness && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await bookings.updateOne(query, {
      $set: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, status: 'CANCELLED' });
  } catch (err) {
    console.error('Cancellation error:', err);
    return NextResponse.json({ error: 'Cancellation failed' }, { status: 500 });
  }
}
