import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, signToken } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { toPublicUser } from '@/lib/models/user';

export const dynamic = 'force-dynamic';

const ALLOWED_ROLES = ['admin', 'business', 'tourist'] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

// POST /api/auth/role-switch - Switch active role (Only ahsanstarn@gmail.com)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const email = user.email?.toLowerCase().trim();
    if (email !== 'ahsanstarn@gmail.com') {
      return NextResponse.json(
        { error: 'Forbidden. Only ahsanstarn@gmail.com has multi-role authorization.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const targetRole = (body?.role || '').toLowerCase().trim() as AllowedRole;

    if (!ALLOWED_ROLES.includes(targetRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Update in MongoDB
    const db = await getDb();
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { role: targetRole, updatedAt: new Date() } }
    );

    // Sign fresh token with the newly selected role
    const newToken = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: targetRole,
    });

    const updatedUser = {
      ...toPublicUser({ ...user, role: targetRole }),
      isSuperAdmin: true,
      canSwitchRoles: true,
      availableRoles: ALLOWED_ROLES,
    };

    const response = NextResponse.json({
      success: true,
      message: `Successfully switched role to ${targetRole}`,
      activeRole: targetRole,
      user: updatedUser,
      token: newToken,
    });

    // Update HTTP-only cookie
    response.cookies.set({
      name: 'kaya-token',
      value: newToken,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Role switch error:', error);
    return NextResponse.json(
      { error: 'Failed to switch role', details: error?.message },
      { status: 500 }
    );
  }
}

// GET /api/auth/role-switch - Check permission & current role
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ canSwitchRoles: false }, { status: 401 });
    }

    const isSuper = user.email?.toLowerCase().trim() === 'ahsanstarn@gmail.com';

    return NextResponse.json({
      canSwitchRoles: isSuper,
      currentRole: user.role,
      availableRoles: isSuper ? ALLOWED_ROLES : [user.role || 'tourist'],
    });
  } catch {
    return NextResponse.json({ canSwitchRoles: false }, { status: 500 });
  }
}
