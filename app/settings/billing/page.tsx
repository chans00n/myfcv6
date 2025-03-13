'use client';

import { useEffect, useState } from 'react';
import { useSubscription } from '@/lib/hooks/use-subscription-status';
import { useManageSubscription } from '@/lib/hooks/use-manage-subscription';
import { useUser } from '@/lib/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { RetryButton } from '@/components/ui/retry-button';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  hostedInvoiceUrl: string | null;
  pdfUrl: string | null;
  periodStart: number;
  periodEnd: number;
}

interface FetchError {
  message: string;
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentMethodSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

function InvoiceSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export default function BillingSettingsPage() {
  const { user } = useUser();
  const { subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useSubscription();
  const { startSubscription, manageSubscription, isLoading: isLoadingAction } = useManageSubscription();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState<FetchError | null>(null);
  const [invoicesError, setInvoicesError] = useState<FetchError | null>(null);
  const [isRetryingPaymentMethods, setIsRetryingPaymentMethods] = useState(false);
  const [isRetryingInvoices, setIsRetryingInvoices] = useState(false);

  const fetchPaymentMethods = async () => {
    try {
      setPaymentMethodsError(null);
      setIsRetryingPaymentMethods(true);
      const response = await fetch('/api/subscriptions/payment-methods');
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      const data = await response.json();
      setPaymentMethods(data.paymentMethods);
      toast.success('Payment methods loaded successfully', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        description: `Found ${data.paymentMethods.length} payment method(s)`,
        className: "bg-background border-border",
      });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethodsError({ message: 'Failed to load payment methods' });
      toast.error('Failed to load payment methods', {
        icon: <XCircle className="h-4 w-4 text-destructive" />,
        description: 'Please try again or contact support if the issue persists',
        className: "bg-background border-border",
      });
    } finally {
      setIsLoadingPaymentMethods(false);
      setIsRetryingPaymentMethods(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setInvoicesError(null);
      setIsRetryingInvoices(true);
      const response = await fetch('/api/subscriptions/invoices');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoices(data.invoices);
      toast.success('Billing history loaded successfully', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        description: `Found ${data.invoices.length} invoice(s)`,
        className: "bg-background border-border",
      });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoicesError({ message: 'Failed to load billing history' });
      toast.error('Failed to load billing history', {
        icon: <XCircle className="h-4 w-4 text-destructive" />,
        description: 'Please try again or contact support if the issue persists',
        className: "bg-background border-border",
      });
    } finally {
      setIsLoadingInvoices(false);
      setIsRetryingInvoices(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchPaymentMethods();
    fetchInvoices();
  }, [user]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getCardIcon = (brand: string) => {
    return <CreditCard className="h-4 w-4" />;
  };

  const handleStartSubscription = async () => {
    try {
      await startSubscription();
      toast.success('Starting checkout process', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        description: 'You will be redirected to the secure checkout page',
        className: "bg-background border-border",
      });
    } catch (error) {
      toast.error('Failed to start subscription', {
        icon: <XCircle className="h-4 w-4 text-destructive" />,
        description: 'Please try again or contact support if the issue persists',
        className: "bg-background border-border",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      await manageSubscription();
      toast.success('Opening billing portal', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        description: 'You will be redirected to manage your subscription',
        className: "bg-background border-border",
      });
    } catch (error) {
      toast.error('Failed to open billing portal', {
        icon: <XCircle className="h-4 w-4 text-destructive" />,
        description: 'Please try again or contact support if the issue persists',
        className: "bg-background border-border",
      });
    }
  };

  if (isLoadingSubscription || isLoadingPaymentMethods || isLoadingInvoices) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-[250px]" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-[200px]" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[150px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {subscriptionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{subscriptionError.message}</span>
            <RetryButton
              onClick={() => window.location.reload()}
              isLoading={false}
              className="ml-4"
            />
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Current Plan</h4>
                <p className="text-sm text-muted-foreground">
                  {subscription.status === 'active' ? 'Active' : 'Inactive'} - {subscription.plan}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2" />
                    Loading...
                  </>
                ) : (
                  'Manage Subscription'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You are currently on the free plan
              </p>
              <Button
                onClick={handleStartSubscription}
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2" />
                    Loading...
                  </>
                ) : (
                  'Upgrade to Pro'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Your saved payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethodsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{paymentMethodsError.message}</span>
                <RetryButton
                  onClick={fetchPaymentMethods}
                  isLoading={isRetryingPaymentMethods}
                  className="ml-4"
                />
              </AlertDescription>
            </Alert>
          ) : isLoadingPaymentMethods ? (
            <div className="space-y-4">
              <PaymentMethodSkeleton />
              <PaymentMethodSkeleton />
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {getCardIcon(method.brand)}
                    <div>
                      <p className="text-sm font-medium">
                        {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} ending in {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="text-sm text-muted-foreground">Default</span>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2" />
                    Loading...
                  </>
                ) : (
                  'Update Payment Method'
                )}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment methods found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoicesError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{invoicesError.message}</span>
                <RetryButton
                  onClick={fetchInvoices}
                  isLoading={isRetryingInvoices}
                  className="ml-4"
                />
              </AlertDescription>
            </Alert>
          ) : isLoadingInvoices ? (
            <div className="space-y-4">
              <InvoiceSkeleton />
              <InvoiceSkeleton />
              <InvoiceSkeleton />
            </div>
          ) : invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(invoice.created * 1000)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {invoice.hostedInvoiceUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={invoice.hostedInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </Button>
                    )}
                    {invoice.pdfUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No billing history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 