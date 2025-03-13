'use client';

import { useSubscription } from '@/lib/context/subscription-context';

export function useSubscriptionStatus() {
  const { subscription, isLoading } = useSubscription();

  return {
    isLoading,
    isSubscribed: subscription?.isActive ?? false,
    isTrialing: subscription?.isTrialing ?? false,
    isPastDue: subscription?.isPastDue ?? false,
    isCanceled: subscription?.isCanceled ?? false,
    willCancel: subscription?.cancelAtPeriodEnd ?? false,
    currentPlan: subscription?.plan ?? null,
    expiresAt: subscription?.currentPeriodEnd ?? null
  };
} 