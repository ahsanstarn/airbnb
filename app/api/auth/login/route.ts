import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { comparePassword, signToken, hashPassword } from '@/lib/auth';
import { toPublicUser } from '@/lib/models/user';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Auto-seed default admin on clean DB setup
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
      const now = new Date();
      const adminHash = await hashPassword('admin123');
      await usersCollection.insertOne({
        name: 'Platform Admin',
        email: 'admin@kaya.ge',
        password: adminHash,
        role: 'admin',
        affiliateCode: 'KAYAADMIN',
        createdAt: now,
        updatedAt: now,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      user = await usersCollection.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userPassword = user.password || user.passwordHash;
    if (!userPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await comparePassword(password, userPassword);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const publicUser = {
      ...toPublicUser(user),
    };

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, user: publicUser, token });
    response.cookies.set({
      name: 'kaya-token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Invalid email or password', 
      details: process.env.NODE_ENV !== 'production' ? error?.message : undefined 
    }, { status: 500 });
  }
}
