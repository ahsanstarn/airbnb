import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const bookingsCol = db.collection('bookings');

    let query: any = {};
    if (ObjectId.isValid(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { $or: [{ _id: params.id }, { id: params.id }] };
    }

    const booking = await bookingsCol.findOne(query);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Ensure user is the host/business of this booking or an admin
    const isHost = booking.business_id === user._id.toString() || booking.host_id === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isHost && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await bookingsCol.updateOne(query, {
      $set: {
        status: 'completed',
        payment_status: 'paid',
        completedAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({ ok: true, status: 'completed' });
  } catch (error) {
    console.error('Complete booking error:', error);
    return NextResponse.json({ error: 'Completion failed' }, { status: 500 });
  }
}

