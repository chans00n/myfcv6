import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PaywallModal from '../components/subscription/PaywallModal'

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
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Error fetching session:', sessionError)
    redirect('/auth/login')
  }

  if (!session) {
    const redirectUrl = new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.set('redirectTo', '/subscribe')
    if (searchParams.redirectTo) {
      redirectUrl.searchParams.set('finalRedirect', searchParams.redirectTo)
    }
    redirect(redirectUrl.toString())
  }

  try {
    // Check if user already has an active subscription
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw profileError
    }

    if (profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing') {
      redirect(searchParams.redirectTo || '/dashboard')
    }

    return (
      <div className="min-h-screen bg-background">
        <PaywallModal isOpen={true} onClose={() => {}} />
      </div>
    )
  } catch (error) {
    console.error('Error in subscribe page:', error)
    // If there's an error, we'll show the PaywallModal anyway
    // This prevents blocking users from subscribing due to temporary DB issues
    return (
      <div className="min-h-screen bg-background">
        <PaywallModal isOpen={true} onClose={() => {}} />
      </div>
    )
  }
} 