import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { parseJsonBody } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const touristId = searchParams.get('tourist_id');
    const listingId = searchParams.get('listing_id');

    const filter: any = {};
    if (touristId) filter.tourist_id = touristId;
    if (listingId) filter.listing_id = listingId;

    const reviews = await db.collection('reviews')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }

    const { booking_id, listing_id, overall_rating, text, photos, cleanliness_rating, location_rating, value_rating } = body;

    if (!booking_id || !listing_id || !overall_rating) {
      return NextResponse.json({ error: 'booking_id, listing_id, and overall_rating required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const bookingQuery: any = ObjectId.isValid(booking_id)
      ? { $or: [{ _id: new ObjectId(booking_id) }, { _id: booking_id }, { id: booking_id }] }
      : { $or: [{ _id: booking_id }, { id: booking_id }] };

    const booking = await db.collection('bookings').findOne(bookingQuery);

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    const isOwner = booking.tourist_id === user._id.toString() || booking.user_id === user._id.toString() || booking.tourist_email === user.email;
    if (!isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (booking.status?.toUpperCase() !== 'COMPLETED') {
      return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 });
    }

    const existing = await db.collection('reviews').findOne({ booking_id: booking_id.toString() });
    if (existing) return NextResponse.json({ error: 'Already reviewed this booking' }, { status: 409 });

    const review = {
      booking_id: booking_id.toString(),
      tourist_id: user._id.toString(),
      listing_id: listing_id.toString(),
      overall_rating: Number(overall_rating),
      cleanliness_rating: Number(cleanliness_rating || overall_rating),
      location_rating: Number(location_rating || overall_rating),
      value_rating: Number(value_rating || overall_rating),
      text: text || '',
      photos: photos || [],
      is_published: true,
      created_at: new Date().toISOString(),
    };

    const result = await db.collection('reviews').insertOne(review);

    // Update listing average rating
    const allReviews = await db.collection('reviews')
      .find({ listing_id: listing_id.toString(), is_published: true })
      .toArray();

    if (allReviews.length > 0) {
      const avg = allReviews.reduce((s: number, r: any) => s + (Number(r.overall_rating) || 5), 0) / allReviews.length;
      const listingQuery: any = ObjectId.isValid(listing_id)
        ? { $or: [{ _id: new ObjectId(listing_id) }, { _id: listing_id }, { id: listing_id }] }
        : { $or: [{ _id: listing_id }, { id: listing_id }] };
      await db.collection('listings').updateOne(
        listingQuery,
        { $set: { overall_rating: Math.round(avg * 100) / 100, review_count: allReviews.length } }
      );
    }

    return NextResponse.json({ ...review, _id: result.insertedId });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Review submission failed' }, { status: 500 });
  }
}
