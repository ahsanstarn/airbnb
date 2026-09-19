import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword, signToken, generateAffiliateCode } from '@/lib/auth';
import { toPublicUser } from '@/lib/models/user';
import { parseJsonBody } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const { data: body, error: jsonError } = await parseJsonBody(req);
    if (jsonError) {
      return jsonError;
    }
    const { email, password, name, role, referralCode } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (role !== 'tourist' && role !== 'business' && role !== 'affiliate') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = await getDb();
    const existingUser = await db.collection('users').findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const affiliateCode = generateAffiliateCode();

    const newUser: any = {
      email: normalizedEmail,
      password: hashedPassword,
      name: name.trim(),
      role,
      affiliateCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);
    newUser._id = result.insertedId;

    if (referralCode) {
      const referrer = await db.collection('users').findOne({ affiliateCode: referralCode.trim() });
      if (referrer) {
        await db.collection('affiliates').insertOne({
          referrerUserId: referrer._id,
          referrerId: referrer._id,
          referredUserId: newUser._id,
          code: referralCode.trim(),
          status: 'registered',
          createdAt: new Date(),
        });
      }
    }

    const publicUser = toPublicUser(newUser);
    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({ success: true, user: publicUser, token }, { status: 201 });
    response.cookies.set({
      name: 'kaya-token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
