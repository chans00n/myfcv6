import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerComponentClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              domain: '.myfc.app',
              secure: true,
              sameSite: 'lax'
            })
          } catch (error) {
            // This can happen if the cookie is set in a Server Component.
            // We can safely ignore this error.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({
              name,
              ...options,
              domain: '.myfc.app',
              secure: true,
              sameSite: 'lax'
            })
          } catch (error) {
            // This can happen if the cookie is removed in a Server Component.
            // We can safely ignore this error.
          }
        },
      },
    }
  )
} 