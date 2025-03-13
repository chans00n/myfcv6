import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Get session and log debug info
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Subscription status check:', {
      hasSession: !!session,
      sessionError,
      userId: session?.user?.id
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error', details: sessionError.message },
        { status: 401 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="invalid_token"'
          }
        }
      );
    }

    // Get subscription ID from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_id, stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile', details: profileError.message },
        { status: 500 }
      );
    }

    if (!profile?.subscription_id) {
      return NextResponse.json({ subscription: null });
    }

    try {
      // Get subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(profile.subscription_id);

      // Format subscription
      const formattedSubscription = {
        id: subscription.id,
        status: subscription.status,
        plan: subscription.items.data[0]?.price?.nickname || 'Unknown Plan',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        isActive: ['active', 'trialing'].includes(subscription.status),
        isTrialing: subscription.status === 'trialing',
        isPastDue: subscription.status === 'past_due',
        isCanceled: subscription.status === 'canceled'
      };

      return NextResponse.json({ 
        subscription: formattedSubscription,
        debug: {
          userId: session.user.id,
          hasStripeCustomerId: !!profile.stripe_customer_id
        }
      });
    } catch (stripeError: any) {
      console.error('Stripe fetch error:', stripeError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch subscription from Stripe',
          details: stripeError.message
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status', details: error.message },
      { status: 500 }
    );
  }
} 