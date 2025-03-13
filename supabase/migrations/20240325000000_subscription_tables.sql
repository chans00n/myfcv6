-- Create subscription status type
DO $$ BEGIN
    CREATE TYPE subscription_status_type AS ENUM (
        'trialing',
        'active',
        'past_due',
        'canceled',
        'incomplete'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add subscription fields to existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status text,
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz,
ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Add constraint to subscription_status
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_subscription_status;

ALTER TABLE profiles
ADD CONSTRAINT valid_subscription_status 
CHECK (subscription_status::subscription_status_type IS NOT NULL OR subscription_status IS NULL);

-- Create subscription_events table for audit trail
CREATE TABLE IF NOT EXISTS subscription_events (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    stripe_event_id text NOT NULL,
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    
    -- Add indexes for common queries
    CONSTRAINT valid_event_type CHECK (
        event_type IN (
            'subscription.created',
            'subscription.updated',
            'subscription.deleted',
            'subscription.trial_ending',
            'subscription.active',
            'subscription.trialing',
            'subscription.past_due',
            'subscription.canceled',
            'subscription.incomplete'
        )
    )
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created_at ON subscription_events(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Enable RLS for subscription_events
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription events
CREATE POLICY "Users can view own subscription events"
ON subscription_events FOR SELECT
USING (auth.uid() = user_id);

-- Only service role can insert/update subscription events
CREATE POLICY "Service role can manage subscription events"
ON subscription_events FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 