import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET /api/listings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const listings = db.collection('listings');

    let query: any = {};
    if (ObjectId.isValid(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { $or: [{ _id: params.id }, { id: params.id }, { id: parseInt(params.id, 10) || 0 }] };
    }

    const doc = await listings.findOne(query);

    if (!doc) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Increment views counter
    await listings.updateOne(
      { _id: doc._id },
      { $inc: { views_count: 1 } }
    );

    return NextResponse.json({
      ...doc,
      id: doc._id.toString(),
      _id: doc._id.toString(),
      price: doc.price_per_night || doc.price,
    });
  } catch (error) {
    console.error('Fetch single listing error:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

// PUT /api/listings/[id] - Update listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const listings = db.collection('listings');

    let query: any = {};
    if (ObjectId.isValid(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { _id: params.id };
    }

    const listing = await listings.findOne(query);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Verify ownership or admin
    if (listing.businessId?.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    delete body._id;
    delete body.id;
    body.updatedAt = new Date();

    await listings.updateOne(query, { $set: body });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update listing error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE /api/listings/[id] - Deactivate
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const listings = db.collection('listings');

    let query: any = {};
    if (ObjectId.isValid(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { _id: params.id };
    }

    const listing = await listings.findOne(query);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.businessId?.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await listings.updateOne(query, { $set: { is_published: false, updatedAt: new Date() } });

    return NextResponse.json({ ok: true, message: 'Listing deactivated' });
  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
