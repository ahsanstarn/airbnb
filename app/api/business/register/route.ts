import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser, parseJsonBody } from '@/lib/api-utils';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }
    const { businessName, category, description, address, city, phone, website, contactName, contactEmail } = body;

    if (!businessName || !category) {
      return NextResponse.json({ error: 'Business name and category are required' }, { status: 400 });
    }

    const db = await getDb();
    const userId = user.id;

    // Check existing business in MongoDB
    const existingBusiness = await db.collection('businesses').findOne({ user_id: userId });
    if (existingBusiness) {
      return NextResponse.json({ error: 'You already have a registered business' }, { status: 409 });
    }

    const newBusiness = {
      user_id: userId,
      name: businessName,
      category,
      description: description || '',
      address: address || '',
      city: city || '',
      phone: phone || '',
      website: website || '',
      contact_name: contactName || user.user_metadata?.name || '',
      contact_email: contactEmail || user.email,
      is_verified: true,
      subscription_plan: 'BASIC',
      subscription_status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('businesses').insertOne(newBusiness);

    // Update user's role to 'business' in MongoDB
    const userFilter: any = ObjectId.isValid(userId)
      ? { $or: [{ _id: new ObjectId(userId) }, { _id: userId }] }
      : { _id: userId };
    await db.collection('users').updateOne(userFilter, {
      $set: { role: 'business', updatedAt: new Date() },
    });

    // Optional sync to Supabase
    try {
      const supabase = getSupabase();
      await supabase.from('businesses').insert({
        ...newBusiness,
        id: result.insertedId.toString(),
      });
    } catch {}

    return NextResponse.json({
      success: true,
      business: {
        ...newBusiness,
        id: result.insertedId.toString(),
        _id: result.insertedId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Business registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
