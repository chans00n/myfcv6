'use client';

import { useSubscription } from '@/lib/context/subscription-context';
import { useManageSubscription } from '@/lib/hooks/use-manage-subscription';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

export default function BillingSettingsPage() {
  const { subscription, isLoading } = useSubscription();
  const { manageSubscription, isLoading: isManaging } = useManageSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Subscription Plan Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Subscription Plan</h2>
          <button
            onClick={() => manageSubscription()}
            disabled={isManaging}
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
                ${subscription?.plan === 'monthly' ? 
                  `${STRIPE_CONFIG.prices.monthly.amount/100}/month` : 
                  `${STRIPE_CONFIG.prices.annual.amount/100}/year`}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Plan includes:</h4>
            <ul className="space-y-2">
              {STRIPE_CONFIG.features.map((feature, index) => (
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

          {subscription?.isTrialing && (
            <div className="mt-4 p-4 bg-primary/10 rounded-md">
              <p className="text-sm">
                Trial ends on {subscription.currentPeriodEnd.toLocaleDateString()}
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
            onClick={() => manageSubscription()}
            disabled={isManaging}
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
            onClick={() => manageSubscription()}
            disabled={isManaging}
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
      {subscription?.isActive && !subscription.isCanceled && (
        <section className="pt-4">
          <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
            <h3 className="text-lg font-medium text-destructive mb-2">Cancel Subscription</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.
            </p>
            <button
              onClick={() => manageSubscription()}
              disabled={isManaging}
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