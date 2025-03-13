import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createServerClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { env } from '@/env.mjs';

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

async function updateSubscriptionStatus(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServerClient>
) {
  const { customer, status, current_period_end, cancel_at_period_end } = subscription;
  
  // Get user_id from stripe customer metadata
  const customerData = await stripe.customers.retrieve(customer as string) as Stripe.Customer;
  const userId = customerData.metadata?.user_id;

  if (!userId) {
    console.error('No user_id found in customer metadata');
    return;
  }

  // Update user_profiles table
  const { error } = await supabase
    .from('user_profiles')
    .update({
      subscription_status: status,
      subscription_id: subscription.id,
      subscription_ends_at: new Date(current_period_end * 1000).toISOString(),
      cancel_at_period_end
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }

  // Log subscription event
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: `subscription.${status}`,
    stripe_event_id: subscription.id,
    metadata: {
      customer_id: customer,
      period_end: current_period_end,
      cancel_at_period_end
    }
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.Event;

    const supabase = createServerClient();

    // Handle specific event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await updateSubscriptionStatus(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.trial_will_end':
        // Handle trial ending soon (3 days before)
        const subscription = event.data.object as Stripe.Subscription;
        const customerData = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        const userId = customerData.metadata?.user_id;

        if (userId) {
          await supabase.from('subscription_events').insert({
            user_id: userId,
            event_type: 'subscription.trial_ending',
            stripe_event_id: event.id,
            metadata: {
              trial_end: subscription.trial_end,
              customer_id: subscription.customer
            }
          });
        }
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        // Handle failed payment
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await updateSubscriptionStatus(subscription, supabase);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 