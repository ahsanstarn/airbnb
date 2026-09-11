import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    
    // Find all referrals where referrerUserId is this user's _id
    const referrals = await db.collection('affiliates').find({ 
      referrerUserId: new ObjectId(user._id) 
    }).toArray();
    
    // Calculate stats
    const totalClicks = referrals.filter(r => r.status === 'clicked').length;
    const totalRegistered = referrals.filter(r => r.status === 'registered').length;
    const totalActive = referrals.filter(r => r.status === 'active').length;

    return NextResponse.json({
      affiliateCode: user.affiliateCode || '', 
      totalClicks,
      totalRegistered,
      totalActive,
      referrals
    });
  } catch (error) {
    console.error('Error fetching affiliate stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
