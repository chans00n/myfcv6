import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/clear']
const adminRoutes = ['/admin', '/admin/workouts', '/admin/videos', '/admin/users', '/admin/settings', '/admin/setup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  console.log('Middleware - Starting middleware execution')
  console.log('Middleware - Request path:', request.nextUrl.pathname)
  console.log('Middleware - Request cookies:', request.cookies.getAll())

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          console.log('Middleware - Getting cookie:', name, cookie?.value ? 'exists' : 'null')
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log('Middleware - Setting cookie:', name)
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
          console.log('Middleware - Removing cookie:', name)
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
    console.log('Middleware - Getting session')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Middleware - Session error:', sessionError)
    }
    
    console.log('Middleware - Session details:', {
      exists: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        raw_user_meta_data: session.user.user_metadata,
        role: session.user.user_metadata?.role
      } : null
    })
    
    const pathname = request.nextUrl.pathname

    // Check for admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      console.log('Middleware - Accessing admin route:', pathname)
      
      if (!session) {
        console.log('Middleware - No session, redirecting to login')
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user has admin role
      const userRole = session.user.user_metadata?.role
      console.log('Middleware - User role check:', {
        role: userRole,
        isAdmin: userRole === 'admin',
        fullMetadata: session.user.user_metadata
      })

      if (userRole !== 'admin') {
        console.log('Middleware - Access denied: not admin')
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
      if (pathname.startsWith('/auth/') && !pathname.startsWith('/auth/clear')) {
        console.log('Middleware - Authenticated user accessing auth page, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    console.log('Middleware - Completing successfully')
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login unless already on an auth page
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