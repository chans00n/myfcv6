import { Stripe } from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import { env } from '@/env.mjs';

// Server-side Stripe instance
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Client-side Stripe promise
export const getStripe = () => {
  const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return stripePromise;
};

// Utility functions for Stripe operations
export const createCustomer = async (email: string, metadata: Record<string, string> = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata,
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

export const createSubscription = async ({
  customerId,
  priceId,
  paymentMethodId,
  trialDays = 7,
}: {
  customerId: string;
  priceId: string;
  paymentMethodId: string;
  trialDays?: number;
}) => {
  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays,
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    return await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (
  subscriptionId: string,
  newPriceId: string
) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}; 