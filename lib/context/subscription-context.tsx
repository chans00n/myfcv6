'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useUser } from '@/lib/hooks/use-user';

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  plan: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  isActive?: boolean;
  isTrialing?: boolean;
  isPastDue?: boolean;
  isCanceled?: boolean;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

export function useSubscription() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  return context;
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/status');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      const data = await response.json();
      setSubscription({
        ...data.subscription,
        isActive: ['active', 'trialing'].includes(data.subscription?.status),
        isTrialing: data.subscription?.status === 'trialing',
        isPastDue: data.subscription?.status === 'past_due',
        isCanceled: data.subscription?.status === 'canceled',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refetch: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
} 