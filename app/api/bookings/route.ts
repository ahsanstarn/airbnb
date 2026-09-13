import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET /api/bookings - Get user's bookings (or business's incoming bookings)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const bookingsCollection = db.collection('bookings');

    let query: any = {};
    if (user.role === 'admin') {
      // Admins view all bookings platform-wide
      query = {};
    } else if (user.role === 'business') {
      query.$or = [
        { business_id: user._id.toString() },
        { business_id: user._id },
        { host_id: user._id.toString() },
        { host_id: user._id },
      ];
    } else {
      query.$or = [
        { tourist_id: user._id.toString() },
        { tourist_id: user._id },
        { tourist_email: user.email },
        { user_id: user._id.toString() },
        { user_id: user._id },
        { user_email: user.email },
      ];
    }

    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = bookings.map(b => ({
      ...b,
      id: b._id.toString(),
      _id: b._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings - Create booking with MongoDB double-booking prevention
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login to book.' }, { status: 401 });
    }

    const body = await request.json();
    const { listing_id, check_in, check_out, guest_count, guests, payment_method, notes } = body;

    if (!listing_id || !check_in || !check_out) {
      return NextResponse.json({ error: 'Missing required dates or listing details' }, { status: 400 });
    }

    const startDate = new Date(check_in);
    const endDate = new Date(check_out);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const db = await getDb();
    const bookingsCollection = db.collection('bookings');
    const listingsCollection = db.collection('listings');

    // 1. Double-booking check: verify no overlapping active bookings
    // Proper date overlap logic: start < existing_end AND end > existing_start
    const overlappingBooking = await bookingsCollection.findOne({
      listing_id: listing_id.toString(),
      status: { $nin: ['CANCELLED', 'DECLINED', 'cancelled', 'declined'] },
      $and: [
        { check_in: { $lt: check_out } },
        { check_out: { $gt: check_in } },
      ],
    });

    if (overlappingBooking) {
      return NextResponse.json({
        error: 'These dates are already booked. Please choose different dates.',
      }, { status: 409 });
    }

    // 2. Fetch listing details
    let listingQuery: any = {};
    if (ObjectId.isValid(listing_id)) {
      listingQuery = { _id: new ObjectId(listing_id) };
    } else {
      listingQuery = { $or: [{ _id: listing_id }, { id: listing_id }] };
    }

    const listing = await listingsCollection.findOne(listingQuery);
    const pricePerNight = listing?.price_per_night || listing?.price || 150;
    const title = listing?.title || 'Georgian Stay';
    const image = (listing?.images && listing.images[0]) || 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop';
    const location = listing?.location || 'Georgia';
    const category = listing?.category || 'hotels';
    const businessId = listing?.businessId?.toString() || listing?.hostId?.toString() || '';
    const hostName = listing?.host || listing?.businessName || 'Host';

    // Calculate duration & total
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const nights = Math.max(1, daysDiff);
    const totalPrice = nights * pricePerNight;

    const finalGuestCount = parseInt(guest_count || guests || '1', 10);

    const now = new Date();
    const newBooking = {
      listing_id: listing_id.toString(),
      listing_title: title,
      listing_category: category,
      listing_image: image,
      listing_location: location,
      tourist_id: user._id.toString(),
      tourist_name: user.name,
      tourist_email: user.email,
      user_id: user._id.toString(),
      user_name: user.name,
      user_email: user.email,
      business_id: businessId,
      host_id: businessId,
      host_name: hostName,
      check_in,
      check_out,
      nights,
      guest_count: finalGuestCount,
      guests: finalGuestCount,
      price_per_night: pricePerNight,
      total_price: totalPrice,
      currency: 'GEL',
      status: 'confirmed',
      payment_method: payment_method || 'cash',
      payment_status: payment_method === 'card' ? 'paid' : 'pending',
      notes: notes || '',
      createdAt: now,
      updatedAt: now,
    };

    const result = await bookingsCollection.insertOne(newBooking);

    return NextResponse.json({
      success: true,
      booking: {
        ...newBooking,
        id: result.insertedId.toString(),
        _id: result.insertedId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
