'use client';

import { useState } from 'react';
import { useSubscription } from '@/lib/context/subscription-context';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { ManageSubscriptionData } from '@/lib/types/subscription';

export function useManageSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetch } = useSubscription();
  const supabase = getSupabaseBrowserClient();

  const startSubscription = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Subscription attempt:', {
        hasSession: !!session,
        sessionError,
        userId: session?.user?.id
      });

      if (sessionError || !session) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/settings?tab=billing&status=success`,
          cancelUrl: `${window.location.origin}/settings?tab=billing&status=cancelled`
        }),
        credentials: 'include' // Important: include cookies in the request
      });

      const data = await response.json();
      
      console.log('Subscription response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create checkout session');
      }

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error starting subscription:', {
        error,
        message: error.message,
        stack: error.stack
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
        result
      });

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to manage subscription');
      }

      window.location.href = result.url;
    } catch (error: any) {
      console.error('Error managing subscription:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'Failed to manage subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      await refetch();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resumeSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/resume', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to resume subscription');
      }

      await refetch();
    } catch (error) {
      console.error('Error resuming subscription:', error);
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