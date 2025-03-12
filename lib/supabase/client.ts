import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import type { CookieOptions } from '@supabase/ssr'

function isBase64(str: string) {
  try {
    return btoa(atob(str)) === str
  } catch (err) {
    return false
  }
}

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookies = document.cookie.split(';')
            const cookie = cookies.find(c => c.trim().startsWith(name + '='))
            if (!cookie) return null
            
            const value = decodeURIComponent(cookie.split('=')[1])
            // If the cookie is base64 encoded, return it as is
            if (value.startsWith('base64-') || isBase64(value)) {
              return value
            }
            return value
          },
          set(name: string, value: string, options: CookieOptions) {
            document.cookie = `${name}=${encodeURIComponent(value)}; path=${options.path ?? '/'}; max-age=${options.maxAge ?? 315360000}`
          },
          remove(name: string, options: CookieOptions) {
            document.cookie = `${name}=; path=${options.path ?? '/'}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          }
        }
      }
    )
  }
  return supabaseClient
} 