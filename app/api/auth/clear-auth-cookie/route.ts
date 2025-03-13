import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  const response = new NextResponse(JSON.stringify({ message: 'Cookie cleared' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
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