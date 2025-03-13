'use client';

import { useState } from 'react';
import { useSubscription } from '@/lib/context/subscription-context';
import type { CreateCheckoutSessionData, ManageSubscriptionData } from '@/lib/types/subscription';

export function useManageSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { createCheckoutSession, createCustomerPortalSession, cancelSubscription, resumeSubscription } = useSubscription();

  const startSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error starting subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const manageSubscription = async (data: ManageSubscriptionData = {}) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          returnUrl: data.returnUrl || window.location.href,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to manage subscription');
      }

      window.location.href = result.url;
    } catch (error) {
      console.error('Error managing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelCurrentSubscription = async () => {
    setIsLoading(true);
    try {
      await cancelSubscription();
    } finally {
      setIsLoading(false);
    }
  };

  const resumeCurrentSubscription = async () => {
    setIsLoading(true);
    try {
      await resumeSubscription();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    startSubscription,
    manageSubscription,
    cancelCurrentSubscription,
    resumeCurrentSubscription
  };
} 