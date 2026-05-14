import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get('stripe-signature');
    if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ received: true });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const body = await request.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const businessId = session.client_reference_id;

      await supabase.from('subscriptions').upsert({
        business_id: businessId,
        plan: 'BASIC',
        amount: 20,
        currency: 'GEL',
        status: 'ACTIVE',
        stripe_subscription_id: session.subscription,
        stripe_customer_id: session.customer,
        billing_cycle_start: new Date().toISOString(),
        next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      });

      await supabase.from('businesses').update({ subscription_status: 'ACTIVE' }).eq('id', businessId);
    }

    if (event.type === 'invoice.payment_failed') {
      const subscriptionId = event.data.object.subscription;
      const { data: sub } = await supabase.from('subscriptions').select('business_id').eq('stripe_subscription_id', subscriptionId).single();
      if (sub) {
        await supabase.from('businesses').update({ subscription_status: 'SUSPENDED' }).eq('id', sub.business_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
