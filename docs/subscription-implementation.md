# Subscription System Implementation Plan

## Overview
Implementation plan for MyFC's subscription system with a single-tier membership model offering monthly ($19.99) and annual ($179.99) billing options, including a 7-day free trial.

## System Architecture

### Subscription Model
```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  pricing: {
    monthly: {
      amount: 1999,    // $19.99 in cents
      interval: 'month'
    },
    annual: {
      amount: 17999,   // $179.99 in cents
      interval: 'year',
      savings: '25%'
    }
  },
  trialPeriod: 7,      // days
  features: string[]
}
```

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

#### 1.1 Stripe Integration
- [ ] Set up Stripe account and test environment
- [ ] Install and configure Stripe SDK
- [ ] Create Stripe Products and Price objects
- [ ] Set up webhook endpoints
- [ ] Implement webhook signature verification
- [ ] Configure Stripe test mode for development

#### 1.2 Database Schema Updates
- [ ] Add subscription-related columns to user_profiles
- [ ] Create subscription_events table
- [ ] Create payment_methods table
- [ ] Set up database triggers for subscription events
- [ ] Add indexes for performance optimization

#### 1.3 Access Control System
- [ ] Define access levels (public, authenticated, trial, member)
- [ ] Implement middleware for route protection
- [ ] Create subscription status checks
- [ ] Set up trial period validation
- [ ] Implement role-based access control

#### 1.4 Basic Components
- [ ] Create subscription context provider
- [ ] Build subscription status hooks
- [ ] Implement basic payment form components
- [ ] Create loading and error states
- [ ] Set up subscription utilities

### Phase 2: Core Functionality (Weeks 3-4)

#### 2.1 Payment Flow
- [ ] Build checkout page component
- [ ] Implement Stripe Elements integration
- [ ] Create payment processing service
- [ ] Handle payment failures gracefully
- [ ] Implement retry logic
- [ ] Add payment confirmation handling

#### 2.2 Trial System
- [ ] Implement trial initialization
- [ ] Create trial period tracking
- [ ] Build trial expiration handling
- [ ] Set up trial-to-paid conversion
- [ ] Add trial status notifications

#### 2.3 Billing Management
- [ ] Create billing dashboard
- [ ] Implement payment method management
- [ ] Build invoice history display
- [ ] Add subscription update capabilities
- [ ] Create cancellation flow

#### 2.4 Webhook System
- [ ] Set up webhook router
- [ ] Implement event handlers for:
  - [ ] subscription.created
  - [ ] subscription.updated
  - [ ] subscription.deleted
  - [ ] payment_intent.succeeded
  - [ ] payment_intent.failed
- [ ] Add webhook error handling
- [ ] Create webhook logs
- [ ] Implement retry mechanism

### Phase 3: Enhancement (Weeks 5-6)

#### 3.1 Email Notification System
- [ ] Set up email service integration
- [ ] Create email templates for:
  - [ ] Trial welcome
  - [ ] Trial expiration warning
  - [ ] Payment confirmation
  - [ ] Subscription renewal
  - [ ] Payment failure
- [ ] Implement email scheduling
- [ ] Add email tracking

#### 3.2 Analytics Integration
- [ ] Set up analytics tracking
- [ ] Implement conversion tracking
- [ ] Create subscription metrics dashboard
- [ ] Add user behavior tracking
- [ ] Set up reporting system

#### 3.3 Welcome Series
- [ ] Design onboarding flow
- [ ] Create welcome dashboard
- [ ] Build feature tour
- [ ] Implement progress tracking
- [ ] Add personalization options

#### 3.4 Member Dashboard
- [ ] Create member-specific features
- [ ] Build subscription status display
- [ ] Implement usage statistics
- [ ] Add member benefits section
- [ ] Create premium content access

### Phase 4: Polish & Launch (Weeks 7-8)

#### 4.1 UI/UX Refinement
- [ ] Conduct usability testing
- [ ] Optimize mobile experience
- [ ] Improve loading states
- [ ] Add micro-interactions
- [ ] Enhance error messages

#### 4.2 Performance Optimization
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Add load testing
- [ ] Improve API response times
- [ ] Optimize client-side performance

#### 4.3 Testing
- [ ] Write unit tests for:
  - [ ] Payment processing
  - [ ] Subscription management
  - [ ] Access control
  - [ ] Email notifications
- [ ] Perform integration testing
- [ ] Conduct security testing
- [ ] Test error scenarios
- [ ] Validate webhook handling

#### 4.4 Documentation
- [ ] Create user documentation
- [ ] Write API documentation
- [ ] Update legal documents:
  - [ ] Terms of Service
  - [ ] Privacy Policy
  - [ ] Refund Policy
- [ ] Create internal documentation
- [ ] Write deployment guides

## API Endpoints

### Subscription Management
```typescript
interface SubscriptionAPI {
  '/api/subscription/create': POST;
  '/api/subscription/trial': POST;
  '/api/subscription/cancel': POST;
  '/api/subscription/update': PUT;
  '/api/webhook/stripe': POST;
}
```

## Security Considerations

### Payment Security
- PCI compliance requirements
- Secure data transmission
- Token-based authentication
- Rate limiting
- Input validation

### Data Protection
- Encryption at rest
- Secure API endpoints
- Access control
- Audit logging
- Error handling

## Monitoring & Maintenance

### Metrics to Track
- Subscription conversion rate
- Trial conversion rate
- Churn rate
- MRR (Monthly Recurring Revenue)
- Payment failure rate

### Alerts
- Failed payments
- High churn rate
- System errors
- Webhook failures
- Security incidents

## Launch Checklist

### Pre-launch
- [ ] Complete all testing
- [ ] Verify Stripe integration
- [ ] Test email systems
- [ ] Validate security measures
- [ ] Review documentation

### Launch
- [ ] Deploy to production
- [ ] Monitor system health
- [ ] Track initial subscriptions
- [ ] Monitor error rates
- [ ] Track user feedback

### Post-launch
- [ ] Analyze metrics
- [ ] Gather user feedback
- [ ] Address issues
- [ ] Optimize performance
- [ ] Plan improvements

*Last updated: March 13, 2024* 

## Phase 1 Detailed Implementation (Weeks 1-2)

### 1.1 Stripe Integration Setup

#### Stripe Account Configuration
```typescript
interface StripeConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  productId: string;
  prices: {
    monthly: string;
    annual: string;
  }
}
```

#### Implementation Steps
1. **Initial Setup**
   - [ ] Create Stripe account
   - [ ] Set up test and live environments
   - [ ] Configure webhook endpoints
   - [ ] Generate API keys
   - [ ] Store keys in environment variables

2. **Product Configuration**
   ```typescript
   const productConfig = {
     name: 'MyFC Premium Membership',
     description: 'Full access to MyFC premium features',
     metadata: {
       features: [
         'Unlimited workout access',
         'Custom program builder',
         'Progress tracking',
         'HD video content'
       ]
     }
   };
   ```
   - [ ] Create product in Stripe
   - [ ] Set up monthly price point ($19.99)
   - [ ] Set up annual price point ($179.99)
   - [ ] Configure trial period settings

3. **SDK Integration**
   ```typescript
   // lib/stripe.ts
   import Stripe from 'stripe';
   import { loadStripe } from '@stripe/stripe-js';

   export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2023-10-16',
     typescript: true,
   });

   export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
   ```

### 1.2 Database Schema Implementation

#### User Profile Extension
```sql
-- Add to user_profiles table
ALTER TABLE user_profiles ADD COLUMN
  subscription_status subscription_status_enum DEFAULT 'none',
  subscription_id text,
  trial_ends_at timestamp with time zone,
  subscription_ends_at timestamp with time zone,
  stripe_customer_id text,
  subscription_interval interval_type DEFAULT 'month',
  cancel_at_period_end boolean DEFAULT false;

-- Create enum types
CREATE TYPE subscription_status_enum AS ENUM (
  'none',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'expired'
);

CREATE TYPE interval_type AS ENUM (
  'month',
  'year'
);
```

#### Subscription Events Table
```sql
CREATE TABLE subscription_events (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  event_type text NOT NULL,
  stripe_event_id text,
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb,
  
  -- Indexes
  CREATE INDEX idx_subscription_events_user_id ON subscription_events(user_id);
  CREATE INDEX idx_subscription_events_created_at ON subscription_events(created_at);
);
```

#### Payment Methods Table
```sql
CREATE TABLE payment_methods (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  stripe_payment_method_id text NOT NULL,
  card_brand text,
  last_four text,
  expiry_month integer,
  expiry_year integer,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  
  -- Constraints
  UNIQUE(user_id, stripe_payment_method_id)
);
```

### 1.3 Access Control Implementation

#### Middleware Configuration
```typescript
// middleware/subscription.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes configuration
  const protectedRoutes = {
    memberOnly: ['/workouts', '/programs', '/progress'],
    trialAllowed: ['/workouts', '/programs'],
    public: ['/', '/login', '/signup', '/pricing']
  };

  // Subscription status check
  if (session) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_status, trial_ends_at')
      .eq('id', session.user.id)
      .single();

    // Access control logic
    const path = req.nextUrl.pathname;
    if (protectedRoutes.memberOnly.includes(path)) {
      if (!profile || profile.subscription_status === 'none') {
        return NextResponse.redirect(new URL('/pricing', req.url));
      }
      if (profile.subscription_status === 'trialing' && 
          !protectedRoutes.trialAllowed.includes(path)) {
        return NextResponse.redirect(new URL('/pricing', req.url));
      }
    }
  }

  return res;
}
```

#### Subscription Status Hook
```typescript
// hooks/useSubscription.ts
import { create } from 'zustand';

interface SubscriptionStore {
  status: 'none' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';
  trialEndsAt: Date | null;
  subscriptionEndsAt: Date | null;
  isActive: () => boolean;
  isTrialing: () => boolean;
  hasAccess: () => boolean;
}

export const useSubscription = create<SubscriptionStore>((set, get) => ({
  status: 'none',
  trialEndsAt: null,
  subscriptionEndsAt: null,
  
  isActive: () => get().status === 'active',
  isTrialing: () => get().status === 'trialing',
  hasAccess: () => ['active', 'trialing'].includes(get().status),
}));
```

### 1.4 Basic Component Implementation

#### Subscription Context
```typescript
// context/SubscriptionContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase';

interface SubscriptionContextType {
  status: string;
  isLoading: boolean;
  hasAccess: boolean;
  refresh: () => Promise<void>;
}

export const SubscriptionContext = createContext<SubscriptionContextType>({
  status: 'none',
  isLoading: true,
  hasAccess: false,
  refresh: async () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState('none');
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();

  const refresh = async () => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .single();

      setStatus(profile?.subscription_status || 'none');
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        status,
        isLoading,
        hasAccess: ['active', 'trialing'].includes(status),
        refresh,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
```

#### Payment Form Component
```typescript
// components/subscription/PaymentForm.tsx
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/stripe-react-components';

interface PaymentFormProps {
  priceId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ priceId, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error: paymentMethodError, paymentMethod } = 
        await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement)!,
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      onSuccess();
    } catch (error) {
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn btn-primary mt-4"
      >
        {isProcessing ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
}
```

### Phase 1 Testing Checklist

#### Stripe Integration Tests
- [ ] Verify API key configuration
- [ ] Test webhook endpoint connectivity
- [ ] Validate product and price creation
- [ ] Confirm test mode functionality

#### Database Schema Tests
- [ ] Verify table creation and constraints
- [ ] Test enum type restrictions
- [ ] Validate foreign key relationships
- [ ] Check index performance

#### Access Control Tests
- [ ] Test route protection
- [ ] Verify trial access rules
- [ ] Validate subscription status checks
- [ ] Test redirect behavior

#### Component Tests
- [ ] Test subscription context updates
- [ ] Verify payment form submission
- [ ] Validate error handling
- [ ] Test loading states

### Phase 1 Deliverables
1. Fully configured Stripe integration
2. Complete database schema implementation
3. Working access control system
4. Basic payment form component
5. Subscription context provider
6. Test coverage for core functionality 