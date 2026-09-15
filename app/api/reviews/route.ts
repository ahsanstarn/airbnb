import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';

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

    const { db } = await connectToDatabase();
    const body = await request.json();
    const { booking_id, listing_id, overall_rating, text, photos, cleanliness_rating, location_rating, value_rating } = body;

    if (!booking_id || !listing_id || !overall_rating) {
      return NextResponse.json({ error: 'booking_id, listing_id, and overall_rating required' }, { status: 400 });
    }

    const booking = await db.collection('bookings').findOne({
      _id: booking_id,
      listing_id: listing_id,
    });

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (booking.tourist_id !== user._id.toString()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 });
    }

    const existing = await db.collection('reviews').findOne({ booking_id });
    if (existing) return NextResponse.json({ error: 'Already reviewed this booking' }, { status: 409 });

    const review = {
      booking_id,
      tourist_id: user._id.toString(),
      listing_id,
      overall_rating,
      cleanliness_rating: cleanliness_rating || overall_rating,
      location_rating: location_rating || overall_rating,
      value_rating: value_rating || overall_rating,
      text: text || '',
      photos: photos || [],
      is_published: false,
      created_at: new Date().toISOString(),
    };

    const result = await db.collection('reviews').insertOne(review);

    // Update listing average rating
    const allReviews = await db.collection('reviews')
      .find({ listing_id, is_published: true })
      .toArray();

    if (allReviews.length > 0) {
      const avg = allReviews.reduce((s: number, r: any) => s + r.overall_rating, 0) / allReviews.length;
      await db.collection('listings').updateOne(
        { _id: listing_id },
        { $set: { overall_rating: Math.round(avg * 100) / 100, review_count: allReviews.length } }
      );
    }

    return NextResponse.json({ ...review, _id: result.insertedId });
  } catch {
    return NextResponse.json({ error: 'Review submission failed' }, { status: 500 });
  }
}
