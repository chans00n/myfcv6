import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password']
const adminRoutes = ['/admin', '/admin/workouts', '/admin/videos', '/admin/users', '/admin/settings', '/admin/setup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value
          // Don't decode the cookie value - let Supabase handle it
          return cookie
        },
        set(name: string, value: string, options: CookieOptions) {
          // Don't try to parse or modify the cookie value - let Supabase handle it
          response.cookies.set({
            name,
            value,
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          })
        },
      },
    }
  )

  try {
    console.log('Middleware - Processing request for path:', request.nextUrl.pathname)
    
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Middleware - Session:', session ? 'exists' : 'null')
    
    const pathname = request.nextUrl.pathname

    // Check for admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      console.log('Middleware - Accessing admin route')
      
      if (!session) {
        console.log('Middleware - No session, redirecting to login')
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Debug log session details
      console.log('Middleware - Session user details:', {
        id: session.user.id,
        email: session.user.email,
        metadata: session.user.user_metadata,
        appMetadata: session.user.app_metadata,
        role: session.user.user_metadata?.role
      })

      // Check if user has admin role
      const userRole = session.user.user_metadata?.role
      if (userRole !== 'admin') {
        console.log('Middleware - User role not admin:', userRole)
        return NextResponse.redirect(new URL('/', request.url))
      }

      console.log('Middleware - Admin access granted')
      return response
    }

    // If there's no session and trying to access a protected route
    if (!session) {
      if (!publicRoutes.includes(pathname) && !pathname.startsWith('/auth/')) {
        console.log('Middleware - No session for protected route, redirecting to login')
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }
      return response
    }

    // If there's a session and trying to access auth pages
    if (session) {
      if (pathname.startsWith('/auth/')) {
        console.log('Middleware - Authenticated user accessing auth page, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login
    if (!request.nextUrl.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|public|api).*)',
  ],
} 