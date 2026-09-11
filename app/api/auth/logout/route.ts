import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: 'kaya-token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0, 
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
