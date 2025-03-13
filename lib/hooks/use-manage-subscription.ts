"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useManageSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const startSubscription = async (planType: "monthly" | "annual") => {
    if (!user) {
      throw new Error("You must be logged in to start a subscription");
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/settings?tab=billing&status=success`,
          cancelUrl: `${window.location.origin}/settings?tab=billing&status=cancelled`,
          planType
        }),
        credentials: "include"
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.details || "Failed to create checkout session");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error starting subscription:", error);
      setError(error.message || "Failed to start subscription");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const manageSubscription = async () => {
    if (!user) {
      throw new Error("You must be logged in to manage your subscription");
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/settings?tab=billing`
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to access billing portal");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error accessing billing portal:", error);
      setError(error.message || "Failed to access billing portal");
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
        console.error("Failed to initialize Supabase client");
        return null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  return {
    startSubscription,
    manageSubscription,
    isLoading,
    error
  };
} 