export type SubscriptionStatus = 
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete';

export type SubscriptionPlan = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionDetails {
  id: string;
  status: SubscriptionStatus;
  plan: 'monthly' | 'annual';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string;
  isCanceled: boolean;
  isActive: boolean;
  isTrialing: boolean;
  isPastDue: boolean;
}

export interface CreateCheckoutSessionData {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface ManageSubscriptionData {
  returnUrl?: string;
}

export interface SubscriptionError {
  message: string;
} 