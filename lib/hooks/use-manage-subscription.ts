import { useState } from 'react';
import { useSubscription } from '@/lib/context/subscription-context';
import type { CreateCheckoutSessionData, ManageSubscriptionData } from '@/lib/types/subscription';

export function useManageSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { createCheckoutSession, createCustomerPortalSession, cancelSubscription, resumeSubscription } = useSubscription();

  const startSubscription = async (priceId: string) => {
    setIsLoading(true);
    try {
      const data: CreateCheckoutSessionData = {
        priceId,
        successUrl: `${window.location.origin}/account`,
        cancelUrl: `${window.location.origin}/pricing`
      };

      const result = await createCheckoutSession(data);
      if (result?.url) {
        window.location.href = result.url;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const manageSubscription = async () => {
    setIsLoading(true);
    try {
      const data: ManageSubscriptionData = {
        returnUrl: `${window.location.origin}/account`
      };

      const result = await createCustomerPortalSession(data);
      if (result?.url) {
        window.location.href = result.url;
      }
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