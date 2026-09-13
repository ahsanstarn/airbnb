import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { toPublicUser } from '@/lib/models/user';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const isSuper = user.email?.toLowerCase() === 'ahsanstarn@gmail.com';
    const publicUser = {
      ...toPublicUser(user),
      isSuperAdmin: isSuper,
      canSwitchRoles: isSuper,
      availableRoles: isSuper ? ['admin', 'business', 'tourist'] : [user.role || 'tourist'],
    };
    return NextResponse.json({ user: publicUser });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
