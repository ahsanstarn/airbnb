import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;
    
    if (!code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    const db = await getDb();
    
    // Look up user by affiliateCode
    const referrer = await db.collection('users').findOne({ affiliateCode: code });
    
    if (!referrer) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }
    
    // Create an affiliate record
    await db.collection('affiliates').insertOne({
      referrerUserId: referrer._id,
      code,
      status: 'clicked',
      createdAt: new Date(),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking affiliate link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
