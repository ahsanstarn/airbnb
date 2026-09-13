import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Auth check: tourist themselves, or host, or admin
    const isOwner = booking.tourist_id === user._id.toString() || booking.user_id === user._id.toString() || booking.tourist_email === user.email;
    const isHost = booking.business_id === user._id.toString() || booking.host_id === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isHost && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      ...booking,
      id: booking._id.toString(),
      _id: booking._id.toString(),
    });
  } catch (error) {
    console.error('Fetch booking by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

