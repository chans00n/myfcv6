import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a response object to modify
  let response = NextResponse.next()

  // Get the hostname from the request
  const hostname = request.headers.get('host') || ''
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  // Debug cookie information
  console.log('Cookies:', {
    all: request.cookies.getAll(),
    auth: request.cookies.get('sb-auth-token'),
    refresh: request.cookies.get('sb-refresh-token')
  })

  // Create a Supabase client using server runtime
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          console.log('Getting cookie:', name, cookie?.value)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieOptions = {
            name,
            value,
            ...options,
            secure: true,
            sameSite: 'lax' as const,
            path: '/',
            domain: isLocalhost ? undefined : hostname
          }
          
          console.log('Setting cookie:', name, cookieOptions)
          response.cookies.set(cookieOptions)
        },
        remove(name: string, options: CookieOptions) {
          const cookieOptions = {
            name,
            value: '',
            ...options,
            expires: new Date(0),
            secure: true,
            sameSite: 'lax' as const,
            path: '/',
            domain: isLocalhost ? undefined : hostname
          }
          
          console.log('Removing cookie:', name, cookieOptions)
          response.cookies.set(cookieOptions)
        },
      },
    }
  )

  // Check auth status
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  // Debug session information
  console.log('Session check:', {
    hasSession: !!session,
    error: sessionError,
    userId: session?.user?.id,
    path: request.url
  })

  // Get the pathname
  const path = new URL(request.url).pathname

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/verify',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
    '/terms',
    '/privacy',
  ]

  // Check if the current path is a public route or an auth-related API route
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith('/api/auth/'))
  const isAuthenticatedApiRoute = path.startsWith('/api/subscriptions/')

  // If the route is not public and there's no session, redirect to login
  if (!isPublicRoute && !isAuthenticatedApiRoute && !session) {
    console.log('Redirecting to login:', { path, isPublicRoute, isAuthenticatedApiRoute })
    const redirectUrl = new URL('/auth/login', request.url)
    // Add the current path as a redirect parameter
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // For authenticated API routes, check session
  if (isAuthenticatedApiRoute && !session) {
    console.log('API auth failed:', { path, hasSession: !!session })
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  // Special handling for admin routes
  if (path.startsWith('/admin')) {
    const user = session?.user
    const isAdmin = user?.user_metadata?.role === 'admin'

    if (!isAdmin) {
      // If not an admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Add session user to response headers for debugging
  if (session?.user) {
    response.headers.set('x-user-id', session.user.id)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except /api/auth/* and /api/subscriptions/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|public).*)',
    '/api/subscriptions/:path*',
    '/api/auth/:path*'
  ],
} 