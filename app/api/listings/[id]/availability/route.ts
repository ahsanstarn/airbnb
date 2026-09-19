import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser, parseJsonBody } from '@/lib/api-utils';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const blocks = await db.collection('availability_blocks')
      .find({ listing_id: params.id })
      .sort({ date_from: 1 })
      .toArray();

    if (blocks && blocks.length > 0) {
      return NextResponse.json(blocks);
    }

    // Fallback to Supabase
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('availability_blocks')
        .select('*')
        .eq('listing_id', params.id)
        .order('date_from', { ascending: true });
      if (!error && data) return NextResponse.json(data);
    } catch {}

    return NextResponse.json(blocks || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: body, error: jsonError } = await parseJsonBody(request);
    if (jsonError) {
      return jsonError;
    }

    if (body.action !== 'block' && body.action !== 'unblock') {
      return NextResponse.json({ error: 'Invalid action. Use "block" or "unblock".' }, { status: 400 });
    }

    const db = await getDb();
    if (body.action === 'block') {
      const blockDoc = {
        listing_id: params.id,
        date_from: body.date_from,
        date_to: body.date_to,
        reason: body.reason || 'BLOCKED',
        seasonal_price: body.seasonal_price || null,
        createdAt: new Date(),
      };
      const result = await db.collection('availability_blocks').insertOne(blockDoc);

      // Also try Supabase
      try {
        const supabase = getSupabase();
        await supabase.from('availability_blocks').insert({
          ...blockDoc,
          id: result.insertedId.toString(),
        });
      } catch {}

      return NextResponse.json({ ...blockDoc, _id: result.insertedId });
    } else {
      await db.collection('availability_blocks').deleteMany({
        listing_id: params.id,
        date_from: body.date_from,
        date_to: body.date_to,
      });

      // Also try Supabase
      try {
        const supabase = getSupabase();
        await supabase
          .from('availability_blocks')
          .delete()
          .eq('listing_id', params.id)
          .eq('date_from', body.date_from)
          .eq('date_to', body.date_to);
      } catch {}

      return NextResponse.json({ ok: true });
    }
  } catch {
    return NextResponse.json({ error: 'Availability update failed' }, { status: 500 });
  }
}
