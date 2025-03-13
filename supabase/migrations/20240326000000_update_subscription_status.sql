-- First, remove the constraint that uses the old enum
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_subscription_status;

-- Drop the old enum type (need to use dynamic SQL because we can't drop type that's in use)
DROP TYPE IF EXISTS subscription_status_type;

-- Create the new enum type with all Stripe statuses
DO $$ BEGIN
    CREATE TYPE subscription_status_type AS ENUM (
        'trialing',
        'active',
        'past_due',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'unpaid'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the constraint back with the updated enum type
ALTER TABLE profiles
ADD CONSTRAINT valid_subscription_status 
CHECK (subscription_status::subscription_status_type IS NOT NULL OR subscription_status IS NULL);

-- Update the valid_event_type constraint in subscription_events table
ALTER TABLE subscription_events 
DROP CONSTRAINT IF EXISTS valid_event_type;

ALTER TABLE subscription_events
ADD CONSTRAINT valid_event_type CHECK (
    event_type IN (
        'subscription.created',
        'subscription.updated',
        'subscription.deleted',
        'subscription.trial_ending',
        'subscription.active',
        'subscription.trialing',
        'subscription.past_due',
        'subscription.canceled',
        'subscription.incomplete',
        'subscription.incomplete_expired',
        'subscription.unpaid'
    )
); 