'use client';

import { useState } from 'react';
import { useSubscription } from '@/lib/context/subscription-context';
import { useAuth } from '@/context/auth-context';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
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
          throw new Error('Not authenticated');
        }
        console.log('Session refreshed successfully');
      }

      // Get a fresh auth token
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Log request attempt
      console.log('Starting subscription request:', {
        userId: user?.id,
        email: user?.email,
        hasSession: !!user,
        hasToken: !!token
      });

      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/settings?tab=billing&status=success`,
          cancelUrl: `${window.location.origin}/settings?tab=billing&status=cancelled`,
          planType: 'monthly'
        }),
        credentials: 'include' // Important: include cookies in the request
      });

      // Log response status
      console.log('Subscription API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        userId: user?.id
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('Subscription creation failed:', {
          status: response.status,
          statusText: response.statusText,
          data,
          userId: user?.id
        });

        // Handle specific error cases
        if (response.status === 401) {
          console.log('Authentication failed, attempting session refresh');
          const refreshed = await refreshSession();
          if (!refreshed) {
            throw new Error('Your session has expired. Please log in again.');
          }
          // Try the request again with the refreshed session
          const token = await getAuthToken();
          if (!token) {
            throw new Error('Failed to get authentication token');
          }
          
          const retryResponse = await fetch('/api/subscriptions/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              successUrl: `${window.location.origin}/settings?tab=billing&status=success`,
              cancelUrl: `${window.location.origin}/settings?tab=billing&status=cancelled`,
              planType: 'monthly'
            }),
            credentials: 'include'
          });

          if (!retryResponse.ok) {
            const retryData = await retryResponse.json().catch(() => ({}));
            throw new Error(retryData.error || retryData.details || 'Failed to create checkout session after refresh');
          }

          const retryResult = await retryResponse.json();
          window.location.href = retryResult.url;
          return;
        }

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

  // Helper function to get auth token
  const getAuthToken = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        console.error('Failed to initialize Supabase client');
        return null;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting auth token:', error);
        return null;
      }
      
      if (!session?.access_token) {
        console.log('No access token in session, attempting refresh');
        const refreshResult = await refreshSession();
        if (!refreshResult?.access_token) {
          console.error('Failed to get access token after refresh');
          return null;
        }
        return refreshResult.access_token;
      }
      
      // Verify the token is still valid
      const { data: { user }, error: verifyError } = await supabase.auth.getUser(session.access_token);
      if (verifyError || !user) {
        console.log('Token verification failed, attempting refresh');
        const refreshResult = await refreshSession();
        return refreshResult?.access_token || null;
      }
      
      return session.access_token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
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