'use client';

import { useState } from 'react';
import { useSubscription } from '@/lib/context/subscription-context';
import { useAuth } from '@/context/auth-context';
import type { ManageSubscriptionData } from '@/lib/types/subscription';

export function useManageSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetch } = useSubscription();
  const { user, refreshSession } = useAuth();

  const startSubscription = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we have a valid session
      if (!user) {
        console.log('No user found, attempting to refresh session');
        const session = await refreshSession();
        if (!session) {
          console.error('Session refresh failed');
          throw new Error('Please log in to continue');
        }
        console.log('Session refreshed successfully');
      }

      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/settings?tab=billing&status=success`,
          cancelUrl: `${window.location.origin}/settings?tab=billing&status=cancelled`,
          planType: 'monthly'
        }),
        credentials: 'include' // Important: include cookies in the request
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('Subscription creation failed:', {
          status: response.status,
          statusText: response.statusText,
          data,
          userId: user?.id
        });
        throw new Error(data.error || data.details || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      console.log('Subscription response:', {
        status: response.status,
        ok: response.ok,
        data,
        userId: user?.id
      });

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error starting subscription:', {
        error,
        message: error.message,
        stack: error.stack,
        userId: user?.id
      });
      setError(error.message || 'Failed to start subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const manageSubscription = async (data: ManageSubscriptionData = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure we have a valid session
      if (!user) {
        const session = await refreshSession();
        if (!session) {
          throw new Error('Please log in to continue');
        }
      }

      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          returnUrl: data.returnUrl || window.location.href,
        }),
        credentials: 'include'
      });

      const result = await response.json();
      
      console.log('Manage subscription response:', {
        status: response.status,
        ok: response.ok,
        result,
        userId: user?.id
      });

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to manage subscription');
      }

      window.location.href = result.url;
    } catch (error: any) {
      console.error('Error managing subscription:', {
        error,
        message: error.message,
        stack: error.stack,
        userId: user?.id
      });
      setError(error.message || 'Failed to manage subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure we have a valid session
      if (!user) {
        const session = await refreshSession();
        if (!session) {
          throw new Error('Please log in to continue');
        }
      }

      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || 'Failed to cancel subscription');
      }

      await refetch();
    } catch (error: any) {
      console.error('Error canceling subscription:', {
        error,
        message: error.message,
        stack: error.stack,
        userId: user?.id
      });
      setError(error.message || 'Failed to cancel subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resumeSubscription = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure we have a valid session
      if (!user) {
        const session = await refreshSession();
        if (!session) {
          throw new Error('Please log in to continue');
        }
      }

      const response = await fetch('/api/subscriptions/resume', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || 'Failed to resume subscription');
      }

      await refetch();
    } catch (error: any) {
      console.error('Error resuming subscription:', {
        error,
        message: error.message,
        stack: error.stack,
        userId: user?.id
      });
      setError(error.message || 'Failed to resume subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    startSubscription,
    manageSubscription,
    cancelSubscription,
    resumeSubscription
  };
} 