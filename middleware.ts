import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a response early to handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Get the domain from the request
  const requestUrl = new URL(request.url)
  const domain = requestUrl.hostname
  const isLocalhost = domain === 'localhost' || domain === '127.0.0.1'

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie with proper domain handling
          response.cookies.set({
            name,
            value,
            ...options,
            domain: isLocalhost ? undefined : `.${domain}`,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
          })
        },
        remove(name: string, options: CookieOptions) {
          // Remove cookie with proper domain handling
          response.cookies.set({
            name,
            value: '',
            ...options,
            domain: isLocalhost ? undefined : `.${domain}`,
            path: '/',
            expires: new Date(0),
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
          })
        },
      },
    }
  )

  // Debug cookie information
  console.log('Request details:', {
    url: request.url,
    method: request.method,
    domain,
    isLocalhost,
    cookies: {
      all: request.cookies.getAll(),
      auth: request.cookies.get('sb-access-token')?.value,
      refresh: request.cookies.get('sb-refresh-token')?.value
    },
    headers: Object.fromEntries(request.headers.entries())
  })

  // Check auth status
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  // Debug session information
  console.log('Session check:', {
    hasSession: !!session,
    error: sessionError,
    userId: session?.user?.id,
    path: request.url,
    cookies: request.headers.get('cookie')
  })

  // Get the pathname
  const path = requestUrl.pathname

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
  if (isAuthenticatedApiRoute) {
    if (!session) {
      console.log('API auth failed:', { 
        path, 
        hasSession: !!session,
        cookies: request.headers.get('cookie'),
        headers: Object.fromEntries(request.headers.entries())
      })

      // Set CORS headers for API responses
      const headers = {
        'WWW-Authenticate': 'Bearer error="invalid_token"',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
      }

      return NextResponse.json(
        { error: 'Not authenticated', details: 'Session not found or invalid' },
        { status: 401, headers }
      )
    }
    
    // Add session user to response headers for debugging
    response.headers.set('x-user-id', session.user.id)
    response.headers.set('x-session-status', 'valid')
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

  // Set CORS headers for all responses
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')

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