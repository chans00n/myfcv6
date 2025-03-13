import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SubscriptionDetails, CreateCheckoutSessionData, ManageSubscriptionData, SubscriptionError } from '@/lib/types/subscription';

interface SubscriptionContextType {
  subscription: SubscriptionDetails | null;
  isLoading: boolean;
  error: SubscriptionError | null;
  createCheckoutSession: (data: CreateCheckoutSessionData) => Promise<{ url: string } | null>;
  createCustomerPortalSession: (data: ManageSubscriptionData) => Promise<{ url: string } | null>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<SubscriptionError | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    async function loadSubscription() {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_id, subscription_ends_at, cancel_at_period_end, stripe_customer_id')
          .eq('id', user.id)
          .single();

        if (profile) {
          const subscriptionDetails: SubscriptionDetails = {
            id: profile.subscription_id || '',
            status: profile.subscription_status as any || 'incomplete',
            plan: 'monthly', // This should be determined from the Stripe subscription
            currentPeriodEnd: profile.subscription_ends_at ? new Date(profile.subscription_ends_at) : new Date(),
            cancelAtPeriodEnd: profile.cancel_at_period_end || false,
            stripeCustomerId: profile.stripe_customer_id,
            isCanceled: profile.subscription_status === 'canceled',
            isActive: ['active', 'trialing'].includes(profile.subscription_status || ''),
            isTrialing: profile.subscription_status === 'trialing',
            isPastDue: profile.subscription_status === 'past_due'
          };
          setSubscription(subscriptionDetails);
        }
      } catch (err) {
        console.error('Error loading subscription:', err);
        setError({ message: 'Failed to load subscription details' });
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscription();
  }, [user, supabase]);

  const createCheckoutSession = async (data: CreateCheckoutSessionData) => {
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create checkout session');
      }

      return result;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError({ message: 'Failed to create checkout session' });
      return null;
    }
  };

  const createCustomerPortalSession = async (data: ManageSubscriptionData) => {
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create portal session');
      }

      return result;
    } catch (err) {
      console.error('Error creating portal session:', err);
      setError({ message: 'Failed to access subscription management' });
      return null;
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      // Refresh subscription data
      router.refresh();
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError({ message: 'Failed to cancel subscription' });
    }
  };

  const resumeSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions/resume', {
        method: 'POST'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resume subscription');
      }

      // Refresh subscription data
      router.refresh();
    } catch (err) {
      console.error('Error resuming subscription:', err);
      setError({ message: 'Failed to resume subscription' });
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        createCheckoutSession,
        createCustomerPortalSession,
        cancelSubscription,
        resumeSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 