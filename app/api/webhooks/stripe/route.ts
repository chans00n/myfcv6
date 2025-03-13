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
  
  try {
    // Get user_id from stripe customer metadata
    const customerData = await stripe.customers.retrieve(customer as string) as Stripe.Customer;
    const userId = customerData.metadata?.user_id;

    if (!userId) {
      console.error('No user_id found in customer metadata', { customer });
      return;
    }

    // Update user_profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: status,
        subscription_id: subscription.id,
        subscription_ends_at: new Date(current_period_end * 1000).toISOString(),
        cancel_at_period_end,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating subscription status:', updateError);
      throw updateError;
    }

    // Log subscription event
    const { error: eventError } = await supabase.from('subscription_events').insert({
      user_id: userId,
      event_type: `subscription.${status}`,
      stripe_event_id: subscription.id,
      metadata: {
        customer_id: customer,
        period_end: current_period_end,
        cancel_at_period_end,
        price_id: subscription.items.data[0]?.price.id,
        plan_type: subscription.items.data[0]?.price.nickname
      }
    });

    if (eventError) {
      console.error('Error logging subscription event:', eventError);
      throw eventError;
    }
  } catch (error) {
    console.error('Error in updateSubscriptionStatus:', error);
    throw error;
  }
}

async function handlePaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createServerClient>
) {
  const { customer, metadata } = paymentIntent;
  
  if (!customer) return;

  try {
    const customerData = await stripe.customers.retrieve(customer as string) as Stripe.Customer;
    const userId = customerData.metadata?.user_id;

    if (!userId) {
      console.error('No user_id found in customer metadata', { customer });
      return;
    }

    await supabase.from('subscription_events').insert({
      user_id: userId,
      event_type: `payment_intent.${paymentIntent.status}`,
      stripe_event_id: paymentIntent.id,
      metadata: {
        customer_id: customer,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        payment_method: paymentIntent.payment_method,
        ...metadata
      }
    });
  } catch (error) {
    console.error('Error handling payment intent:', error);
    throw error;
  }
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
              customer_id: subscription.customer,
              price_id: subscription.items.data[0]?.price.id
            }
          });
        }
        break;

      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
        await handlePaymentIntent(event.data.object as Stripe.PaymentIntent, supabase);
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await updateSubscriptionStatus(subscription, supabase);
          
          // Also handle the failed payment intent if it exists
          if (invoice.payment_intent && typeof invoice.payment_intent !== 'string') {
            await handlePaymentIntent(invoice.payment_intent, supabase);
          }
        }
        break;

      case 'customer.updated':
        // Handle customer updates if needed
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 