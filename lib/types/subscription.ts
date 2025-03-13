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

export interface SubscriptionDetails extends Subscription {
  stripeCustomerId: string | null;
  isCanceled: boolean;
  isActive: boolean;
  isTrialing: boolean;
  isPastDue: boolean;
}

export interface CreateCheckoutSessionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface ManageSubscriptionData {
  returnUrl: string;
}

export interface SubscriptionError {
  message: string;
  code?: string;
} 