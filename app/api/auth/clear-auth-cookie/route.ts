import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  const response = new NextResponse(JSON.stringify({ message: 'Cookies cleared' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

  // Get all cookies to find auth-related ones
  const allCookies = cookieStore.getAll()
  const authCookies = allCookies.filter(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('auth') ||
    cookie.name.includes('sb-')
  )

  // Clear each auth cookie
  authCookies.forEach(cookie => {
    response.cookies.set({
      name: cookie.name,
      value: '',
      path: '/',
      domain: '.myfc.app',
      expires: new Date(0),
      secure: true,
      sameSite: 'lax'
    })
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            domain: '.myfc.app',
            secure: true,
            sameSite: 'lax'
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            domain: '.myfc.app',
            expires: new Date(0),
            secure: true,
            sameSite: 'lax'
          })
        },
      },
    }
  )

  // Clear the session
  await supabase.auth.signOut()
  
  return response
} 