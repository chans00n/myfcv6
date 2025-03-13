import { env } from '@/env.mjs';

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
  amount: number;
};

export type StripeConfig = {
  prices: {
    monthly: SubscriptionPlan;
    annual: SubscriptionPlan;
  };
  features: string[];
};

export const STRIPE_CONFIG: StripeConfig = {
  prices: {
    monthly: {
      name: 'Pro Plan',
      description: 'Monthly subscription to Pro features',
      stripePriceId: env.STRIPE_PRICE_ID_MONTHLY,
      amount: 1999, // $19.99
    },
    annual: {
      name: 'Pro Plan',
      description: 'Annual subscription to Pro features (save 25%)',
      stripePriceId: env.STRIPE_PRICE_ID_ANNUAL,
      amount: 17999, // $179.99
    },
  },
  features: [
    'Unlimited projects',
    'Advanced analytics',
    'Priority support',
    'Custom integrations',
    'Team collaboration',
    'API access',
  ],
} as const;

export const STRIPE_PRODUCTS = {
  pro: {
    name: 'Pro Plan',
    description: 'Access to all Pro features',
    productId: env.STRIPE_PRODUCT_ID,
  },
} as const;

// Helper functions for subscription management
export function getFormattedPrice(amount: number, interval?: 'month' | 'year'): string {
  const price = (amount / 100).toFixed(2);
  if (!interval) return `$${price}`;
  return `$${price}/${interval === 'month' ? 'mo' : 'yr'}`;
}

export function getAnnualSavings(): string {
  const monthlyAnnualCost = STRIPE_CONFIG.prices.monthly.amount * 12;
  const annualCost = STRIPE_CONFIG.prices.annual.amount;
  const savings = monthlyAnnualCost - annualCost;
  return getFormattedPrice(savings);
}

// Types for subscription status
export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export type SubscriptionPlanType = 'monthly' | 'annual';

// Subscription status helpers
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return ['active', 'trialing'].includes(status);
}

export function getSubscriptionStatusMessage(status: SubscriptionStatus): string {
  const messages: Record<SubscriptionStatus, string> = {
    active: 'Your subscription is active',
    canceled: 'Your subscription has been canceled',
    incomplete: 'Your payment is incomplete',
    incomplete_expired: 'Your payment has expired',
    past_due: 'Your payment is past due',
    trialing: 'Your trial is active',
    unpaid: 'Your subscription is unpaid',
  };
  return messages[status];
}

// Portal return URLs
export function getPortalReturnUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/settings/billing`;
}

export interface StripeCustomer {
  id: string;
  email: string;
  metadata: Record<string, string>;
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  priceId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export const PROTECTED_ROUTES = {
  memberOnly: ['/workouts', '/programs', '/progress'],
  trialAllowed: ['/workouts', '/programs'],
  public: ['/', '/login', '/signup', '/pricing']
} as const; 