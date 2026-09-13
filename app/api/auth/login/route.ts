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

    // Auto-seed default accounts on clean DB setup
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
      const now = new Date();
      const adminHash = await hashPassword('admin123');
      const hostHash = await hashPassword('host123');
      const touristHash = await hashPassword('tourist123');
      await usersCollection.insertMany([
        {
          name: 'Kaya Administrator',
          email: 'admin@kaya.ge',
          password: adminHash,
          role: 'admin',
          affiliateCode: 'KAYAADMIN',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Ahsan Admin',
          email: 'ahsanstarn@gmail.com',
          password: adminHash,
          role: 'admin',
          affiliateCode: 'KAYASTAR',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Dato Host',
          email: 'host@kaya.ge',
          password: hostHash,
          role: 'business',
          affiliateCode: 'HOSTDATO',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Elena Traveler',
          email: 'tourist@kaya.ge',
          password: touristHash,
          role: 'tourist',
          affiliateCode: 'ELENATRAVEL',
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const publicUser = toPublicUser(user);
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

