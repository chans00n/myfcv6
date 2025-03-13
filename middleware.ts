import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/terms',
  '/privacy',
  '/subscribe',
]

const SUBSCRIPTION_REQUIRED_ROUTES = [
  '/dashboard',
  '/settings',
  '/profile',
  '/workouts',
  '/movements',
  '/favorites',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession()

  // Handle auth routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))
  const requiresSubscription = SUBSCRIPTION_REQUIRED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))
  const isSubscribePage = req.nextUrl.pathname === '/subscribe'

  if (!session) {
    // If not logged in and trying to access protected route, redirect to login
    if (!isPublicRoute) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  // If logged in but trying to access auth routes, redirect to dashboard
  if (req.nextUrl.pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Special handling for subscribe page when logged in
  if (isSubscribePage && session) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single()

      if (profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
    }
  }

  // Check subscription status for protected routes
  if (requiresSubscription) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single()

      const hasActiveSubscription = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

      if (!hasActiveSubscription) {
        // Store the intended destination
        const redirectUrl = new URL('/subscribe', req.url)
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
      // On error, allow access to avoid false negatives
      return res
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
} 