import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe/client';
import { env } from '@/env.mjs';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { successUrl, cancelUrl, planType = 'monthly' } = await request.json();

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get or create customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      try {
        // Create a new customer
        const customer = await stripe.customers.create({
          email: session.user.email,
          metadata: {
            user_id: session.user.id
          }
        });
        customerId = customer.id;

        // Save customer ID to profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', session.user.id);

        if (updateError) {
          throw new Error('Failed to update profile with customer ID');
        }
      } catch (error) {
        console.error('Error creating/updating customer:', error);
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 }
        );
      }
    }

    // Get the appropriate price ID based on the plan type
    const priceId = planType === 'annual' 
      ? env.STRIPE_PRICE_ID_ANNUAL 
      : env.STRIPE_PRICE_ID_MONTHLY;

    // Create checkout session
    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          trial_period_days: STRIPE_CONFIG.prices[planType === 'annual' ? 'annual' : 'monthly'].trialDays || 7,
          metadata: {
            user_id: session.user.id,
            plan_type: planType
          }
        },
        allow_promotion_codes: true,
        client_reference_id: session.user.id
      });

      return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 