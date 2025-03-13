import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe/client';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get subscription ID from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.subscription_id) {
      return NextResponse.json({ subscription: null });
    }

    // Get subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(profile.subscription_id);

    // Format subscription
    const formattedSubscription = {
      id: subscription.id,
      status: subscription.status,
      plan: subscription.items.data[0]?.price?.nickname || 'Unknown Plan',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };

    return NextResponse.json({ subscription: formattedSubscription });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
} 