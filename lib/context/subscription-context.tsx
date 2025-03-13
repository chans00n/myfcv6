'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SubscriptionDetails, CreateCheckoutSessionData, ManageSubscriptionData, SubscriptionError } from '@/lib/types/subscription';

interface SubscriptionContextType {
  subscription: SubscriptionDetails | null;
  isLoading: boolean;
  error: SubscriptionError | null;
  createCheckoutSession: (data: CreateCheckoutSessionData) => Promise<{ url: string } | { error: string }>;
  manageSubscription: (data?: ManageSubscriptionData) => Promise<{ url: string } | { error: string }>;
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
    async function loadSubscription() {
      if (!user?.id) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_id, stripe_customer_id')
          .eq('id', user.id)
          .single();

        if (!profile?.subscription_id) {
          setSubscription(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/subscriptions/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId: profile.subscription_id }),
        });

        if (!response.ok) {
          throw new Error('Failed to load subscription status');
        }

        const data = await response.json();
        setSubscription(data.subscription);
      } catch (error) {
        console.error('Error loading subscription:', error);
        setError({ message: 'Failed to load subscription status' });
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
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      return { url: result.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { error: 'Failed to create checkout session' };
    }
  };

  const manageSubscription = async (data: ManageSubscriptionData = {}) => {
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, returnUrl: window.location.href }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to manage subscription');
      }

      return { url: result.url };
    } catch (error) {
      console.error('Error managing subscription:', error);
      return { error: 'Failed to manage subscription' };
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        createCheckoutSession,
        manageSubscription,
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