'use client';

import { useState } from 'react';
import { SubscriptionStatus } from '@/lib/stripe/config';

// Mock subscription data for testing
const mockSubscriptionStates = {
  active: {
    status: 'active',
    plan: 'monthly',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isCanceled: false,
    isActive: true,
    isTrialing: false,
  },
  activeAnnual: {
    status: 'active',
    plan: 'annual',
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isCanceled: false,
    isActive: true,
    isTrialing: false,
  },
  trialing: {
    status: 'trialing',
    plan: 'monthly',
    currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isCanceled: false,
    isActive: true,
    isTrialing: true,
  },
  canceled: {
    status: 'canceled',
    plan: 'monthly',
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isCanceled: true,
    isActive: true,
    isTrialing: false,
  },
  pastDue: {
    status: 'past_due',
    plan: 'monthly',
    currentPeriodEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isCanceled: false,
    isActive: false,
    isTrialing: false,
  },
};

// Create a mock subscription context provider
function MockBillingPage({ subscriptionState, isLoading }: { 
  subscriptionState: typeof mockSubscriptionStates[keyof typeof mockSubscriptionStates];
  isLoading: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Subscription Plan Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Subscription Plan</h2>
          <button
            onClick={() => alert('Manage subscription clicked')}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            Change plan
          </button>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">Pro Plan</h3>
              <p className="text-sm text-muted-foreground">
                {subscriptionState.plan === 'monthly' ? '$19.99/month' : '$179.99/year'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Plan includes:</h4>
            <ul className="space-y-2">
              {[
                'Unlimited projects',
                'Advanced analytics',
                'Priority support',
                'Custom integrations',
                'Team collaboration',
                'API access',
              ].map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <svg
                    className="mr-2 h-4 w-4 text-primary"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {subscriptionState.isTrialing && (
            <div className="mt-4 p-4 bg-primary/10 rounded-md">
              <p className="text-sm">
                Trial ends on {subscriptionState.currentPeriodEnd.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Payment Method Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payment Method</h2>
          <button
            onClick={() => alert('Manage payment methods clicked')}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-primary bg-transparent border border-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
          >
            Manage payment methods
          </button>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Manage your payment methods in Stripe's secure portal
          </p>
        </div>
      </section>

      {/* Billing History Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Billing History</h2>
          <button
            onClick={() => alert('View invoices clicked')}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-primary bg-transparent border border-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
          >
            View all invoices
          </button>
        </div>

        <div className="overflow-hidden bg-card rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="text-sm">
                <td className="px-6 py-4">View in portal</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Cancel Subscription */}
      {subscriptionState.isActive && !subscriptionState.isCanceled && (
        <section className="pt-4">
          <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
            <h3 className="text-lg font-medium text-destructive mb-2">Cancel Subscription</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.
            </p>
            <button
              onClick={() => alert('Cancel subscription clicked')}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:bg-destructive/90 disabled:opacity-50"
            >
              Cancel subscription
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default function BillingTest() {
  const [selectedState, setSelectedState] = useState<keyof typeof mockSubscriptionStates>('active');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-8 space-y-4 p-4 bg-gray-100 rounded-lg">
        <h1 className="text-2xl font-bold">Billing UI Test Page</h1>
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Subscription State</h2>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as keyof typeof mockSubscriptionStates)}
            className="w-full max-w-xs p-2 border rounded"
          >
            {Object.keys(mockSubscriptionStates).map((state) => (
              <option key={state} value={state}>
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Loading State</h2>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isLoading}
              onChange={(e) => setIsLoading(e.target.checked)}
              className="rounded"
            />
            <span>Show loading state</span>
          </label>
        </div>

        <div className="text-sm text-gray-600">
          <p>Current subscription state:</p>
          <pre className="mt-2 p-2 bg-white rounded">
            {JSON.stringify(mockSubscriptionStates[selectedState], null, 2)}
          </pre>
        </div>
      </div>

      <div className="border-t pt-8">
        <MockBillingPage 
          subscriptionState={mockSubscriptionStates[selectedState]}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 