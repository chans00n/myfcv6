import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/env.mjs';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Get session and log debug info
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Log auth details
    const authHeader = request.headers.get('authorization');
    console.log('Create subscription attempt:', {
      hasSession: !!session,
      sessionError,
      userId: session?.user?.id,
      headers: {
        cookie: request.headers.get('cookie'),
        authorization: authHeader ? 'Bearer [redacted]' : 'none'
      }
    });

    let authenticatedUser = session?.user;

    // Check Authorization header if no session
    if (!authenticatedUser && authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: tokenError } = await supabase.auth.getUser(token);
      
      if (!tokenError && user) {
        console.log('User authenticated via token:', {
          userId: user.id,
          email: user.email
        });
        authenticatedUser = user;
      } else {
        console.error('Token validation failed:', tokenError);
      }
    }

    if (!authenticatedUser) {
      console.error('No authenticated user found');
      return NextResponse.json(
        { error: 'Authentication required', details: 'No valid session or token found' },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="invalid_token"',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error', details: sessionError.message },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="invalid_token"',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    if (!session) {
      console.error('No session found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="invalid_token"',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Log successful authentication
    console.log('User authenticated:', {
      userId: authenticatedUser.id,
      email: authenticatedUser.email
    });

    const { successUrl, cancelUrl, planType = 'monthly' } = await request.json();

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters', details: 'Success and cancel URLs are required' },
        { status: 400 }
      );
    }

    // Get or create customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', authenticatedUser.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile', details: profileError.message },
        { status: 500 }
      );
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      try {
        // Create a new customer
        const customer = await stripe.customers.create({
          email: authenticatedUser.email,
          metadata: {
            user_id: authenticatedUser.id
          }
        });
        customerId = customer.id;

        // Save customer ID to profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString()
          })
          .eq('id', authenticatedUser.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw new Error('Failed to update profile with customer ID');
        }
      } catch (error: any) {
        console.error('Error creating/updating customer:', error);
        return NextResponse.json(
          { error: 'Failed to create customer', details: error.message },
          { status: 500 }
        );
      }
    }

    // Get the appropriate price ID based on the plan type
    const priceId = planType === 'annual' 
      ? env.STRIPE_PRICE_ID_ANNUAL 
      : env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan type or missing price configuration' },
        { status: 500 }
      );
    }

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
            user_id: authenticatedUser.id,
            plan_type: planType
          }
        },
        allow_promotion_codes: true,
        client_reference_id: authenticatedUser.id,
        metadata: {
          user_id: authenticatedUser.id,
          plan_type: planType
        }
      });

      // Log the checkout session creation
      console.log('Checkout session created:', {
        sessionId: checkoutSession.id,
        userId: authenticatedUser.id,
        customerId,
        planType
      });

      return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      return NextResponse.json(
        { error: 'Failed to create checkout session', details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in create subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription request', details: error.message },
      { status: 500 }
    );
  }
} 