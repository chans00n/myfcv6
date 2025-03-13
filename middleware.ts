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
          const cookie = request.cookies.get(name);
          console.log('Getting cookie:', { name, value: cookie?.value });
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie with proper domain handling
          const cookieOptions = {
            name,
            value,
            ...options,
            path: '/',
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
          };

          // Only set domain for non-localhost
          if (!isLocalhost) {
            cookieOptions.domain = `.${domain}`;
          }

          console.log('Setting cookie:', { name, value, domain: cookieOptions.domain });
          response.cookies.set(cookieOptions);
        },
        remove(name: string, options: CookieOptions) {
          // Remove cookie with proper domain handling
          const cookieOptions = {
            name,
            value: '',
            ...options,
            path: '/',
            expires: new Date(0),
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
          };

          // Only set domain for non-localhost
          if (!isLocalhost) {
            cookieOptions.domain = `.${domain}`;
          }

          console.log('Removing cookie:', { name, domain: cookieOptions.domain });
          response.cookies.set(cookieOptions);
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
      all: request.cookies.getAll().map(c => ({ name: c.name, value: c.value })),
      auth: request.cookies.get('sb-access-token')?.value,
      refresh: request.cookies.get('sb-refresh-token')?.value,
      session: request.cookies.get('supabase-auth-token')?.value
    },
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      authorization: request.headers.get('authorization') ? 'Bearer [redacted]' : 'none',
      cookie: request.headers.get('cookie')
    }
  })

  // Check auth status
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  let authenticatedUser = session?.user;
  
  // If no session from cookies, try Authorization header
  if (!authenticatedUser) {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: tokenError } = await supabase.auth.getUser(token);
      
      if (!tokenError && user) {
        console.log('User authenticated via token:', {
          userId: user.id,
          email: user.email
        });
        authenticatedUser = user;
      } else {
        console.error('Token validation failed:', tokenError);
      }
    }
  }
  
  // Debug session information
  console.log('Session check:', {
    hasSession: !!session,
    hasAuthenticatedUser: !!authenticatedUser,
    error: sessionError,
    userId: authenticatedUser?.id,
    path: request.url,
    cookies: request.headers.get('cookie'),
    authorization: request.headers.get('authorization') ? 'Bearer [redacted]' : 'none'
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

  // If the route is not public and there's no authenticated user, redirect to login
  if (!isPublicRoute && !isAuthenticatedApiRoute && !authenticatedUser) {
    console.log('Redirecting to login:', { path, isPublicRoute, isAuthenticatedApiRoute })
    const redirectUrl = new URL('/auth/login', request.url)
    // Add the current path as a redirect parameter
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // For authenticated API routes, check for authenticated user
  if (isAuthenticatedApiRoute) {
    if (!authenticatedUser) {
      console.log('API auth failed:', { 
        path, 
        hasAuthenticatedUser: !!authenticatedUser,
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
        { error: 'Not authenticated', details: 'No valid session or token found' },
        { status: 401, headers }
      )
    }
    
    // Add authenticated user to response headers for debugging
    response.headers.set('x-user-id', authenticatedUser.id)
    response.headers.set('x-session-status', 'valid')
  }

  // Special handling for admin routes
  if (path.startsWith('/admin')) {
    const isAdmin = authenticatedUser?.user_metadata?.role === 'admin'

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