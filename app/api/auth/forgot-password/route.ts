import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kaya-ge-secret-change-me-in-production';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const db = await getDb();
    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.collection('users').findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ ok: true, message: 'If an account exists, a reset link has been sent.' });
    }

    const userId = typeof user._id === 'object' && user._id?.toString ? user._id.toString() : String(user._id);

    const resetToken = jwt.sign(
      { userId, email: user.email, purpose: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { passwordResetToken: resetToken, passwordResetExpiry: resetExpiry, updatedAt: new Date().toISOString() } }
    );

    const origin = request.headers.get('origin') || 'https://kayadeveloper.vercel.app';
    const resetUrl = `${origin}/auth/reset-password?token=${resetToken}`;

    console.log('Password reset URL:', resetUrl);

    return NextResponse.json({
      ok: true,
      message: 'If an account exists, a reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' && { resetUrl }),
    });
  } catch (error: any) {
    console.error('Forgot password error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
