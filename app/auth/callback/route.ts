import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Get the user to check their role for admin access
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check if user is trying to access admin routes
    if (redirectTo?.startsWith('/admin')) {
      const userRole = user?.user_metadata?.role
      
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', requestUrl.origin))
      }
    }
    
    // Redirect to the requested page or dashboard
    return NextResponse.redirect(new URL(redirectTo || '/dashboard', requestUrl.origin))
  }

  // If no code, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
} 