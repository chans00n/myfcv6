import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PaywallModal from '@/components/subscription/PaywallModal'

export const metadata: Metadata = {
  title: "Choose Your Plan - MYFC",
  description: "Select the perfect plan for your facial fitness journey with MYFC."
}

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Check if user already has an active subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', session.user.id)
    .single()

  if (profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing') {
    redirect(searchParams.redirectTo || '/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <PaywallModal isOpen={true} onClose={() => {}} />
    </div>
  )
} 