'use client';

import { useContext } from 'react';
import { SubscriptionContext } from '@/lib/context/subscription-context';

export function useSubscription() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  return context;
}

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