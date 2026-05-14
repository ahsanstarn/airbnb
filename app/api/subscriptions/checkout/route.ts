import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    if (!STRIPE_SECRET_KEY) {
      const { data: sub } = await supabase.from('subscriptions').insert({
        business_id: business.id,
        plan: 'BASIC',
        amount: 20,
        currency: 'GEL',
        status: 'ACTIVE',
        billing_cycle_start: new Date().toISOString(),
        next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      }).select();
      return NextResponse.json({ subscription: sub?.[0], message: 'Demo mode — subscription activated without payment' });
    }

    const stripe = require('stripe')(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'gel', product_data: { name: 'Kaya.ge Basic Plan' }, unit_amount: 2000 }, quantity: 1 }],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/dashboard?subscription=success`,
      cancel_url: `${request.headers.get('origin')}/dashboard?subscription=cancelled`,
      client_reference_id: business.id,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
