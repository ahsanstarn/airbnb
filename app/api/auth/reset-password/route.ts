import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { parseJsonBody } from '@/lib/api-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'kaya-ge-secret-change-me-in-production';

async function findUserById(db: any, userId: string) {
  if (ObjectId.isValid(userId)) {
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (user) return user;
    } catch {}
  }
  return db.collection('users').findOne({ _id: userId });
}

export async function POST(request: NextRequest) {
  try {
    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (payload.purpose !== 'password-reset') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const db = await getDb();
    const user = await findUserById(db, payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    if (user.passwordResetToken !== token) {
      return NextResponse.json({ error: 'Invalid or already used reset token' }, { status: 400 });
    }

    if (user.passwordResetExpiry && new Date(user.passwordResetExpiry) < new Date()) {
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword, passwordResetToken: null, passwordResetExpiry: null, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({ ok: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Reset password error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
