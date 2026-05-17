import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();

    const { data: sent } = await supabase
      .from('messages')
      .select('*, receiver_id, bookings!inner(id, listings!inner(title, images))')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    const { data: received } = await supabase
      .from('messages')
      .select('*, sender_id, bookings!inner(id, listings!inner(title, images))')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });

    const conversationMap = new Map();

    const addToMap = (msg: any, otherUserId: string) => {
      const key = [msg.booking_id, otherUserId].sort().join('-');
      if (!conversationMap.has(key) || new Date(msg.created_at) > new Date(conversationMap.get(key).created_at)) {
        conversationMap.set(key, { ...msg, other_user_id: otherUserId });
      }
    };

    (sent || []).forEach((msg: any) => addToMap(msg, msg.receiver_id));
    (received || []).forEach((msg: any) => addToMap(msg, msg.sender_id));

    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json(conversations);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
