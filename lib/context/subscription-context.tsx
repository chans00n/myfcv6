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

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchSubscription = useCallback(async (retry = false) => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/status');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch subscription status');
      }

      const data = await response.json();
      
      if (!data.subscription && retryCount < MAX_RETRIES && retry) {
        // If no subscription data and we haven't exceeded retries, try again
        setRetryCount((count) => count + 1);
        setTimeout(() => fetchSubscription(true), RETRY_DELAY * Math.pow(2, retryCount));
        return;
      }

      setSubscription(data.subscription ? {
        ...data.subscription,
        isActive: ['active', 'trialing'].includes(data.subscription?.status),
        isTrialing: data.subscription?.status === 'trialing',
        isPastDue: data.subscription?.status === 'past_due',
        isCanceled: data.subscription?.status === 'canceled',
      } : null);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      if (retryCount < MAX_RETRIES && retry) {
        // If error and we haven't exceeded retries, try again
        setRetryCount((count) => count + 1);
        setTimeout(() => fetchSubscription(true), RETRY_DELAY * Math.pow(2, retryCount));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, retryCount]);

  // Reset retry count when user changes
  useEffect(() => {
    setRetryCount(0);
  }, [user]);

  // Initial fetch with retry enabled
  useEffect(() => {
    fetchSubscription(true);
  }, [fetchSubscription]);

  // Manual refetch without retry
  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchSubscription(false);
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refetch,
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