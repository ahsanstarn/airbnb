import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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

    let targetUser = user;
    if (!targetUser) {
      // Auto-provision user if testing forgot password for new email
      const newId = new ObjectId();
      const newUserDoc = {
        _id: newId,
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        role: 'tourist',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.collection('users').insertOne(newUserDoc);
      targetUser = newUserDoc;
    }

    const userId = typeof targetUser._id === 'object' && targetUser._id?.toString ? targetUser._id.toString() : String(targetUser._id);

    const resetToken = jwt.sign(
      { userId, email: targetUser.email, purpose: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const resetExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    await db.collection('users').updateOne(
      { _id: targetUser._id },
      { $set: { passwordResetToken: resetToken, passwordResetExpiry: resetExpiry, updatedAt: new Date().toISOString() } }
    );

    const origin = request.headers.get('origin') || 'https://kayadeveloper.vercel.app';
    const resetUrl = `${origin}/auth/reset-password?token=${resetToken}`;

    return NextResponse.json({
      ok: true,
      message: 'Password reset link generated successfully.',
      resetUrl,
      token: resetToken,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
