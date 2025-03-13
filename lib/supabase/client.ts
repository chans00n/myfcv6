import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import type { CookieOptions } from '@supabase/ssr'

function isBase64(str: string) {
  if (str.startsWith('base64-')) return true
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
            
            const value = decodeURIComponent(cookie.split('=')[1].trim())
            // Return base64 cookies as-is without trying to parse
            if (isBase64(value)) {
              return value
            }
            return value
          },
          set(name: string, value: string, options: CookieOptions) {
            document.cookie = `${name}=${encodeURIComponent(value)}; path=${options.path ?? '/'}; domain=.myfc.app; secure; samesite=lax`
          },
          remove(name: string, options: CookieOptions) {
            document.cookie = `${name}=; path=${options.path ?? '/'}; domain=.myfc.app; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`
          }
        }
      }
    )
  }
  return supabaseClient
} 