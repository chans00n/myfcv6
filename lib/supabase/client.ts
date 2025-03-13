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
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
          storage: {
            getItem: (key) => {
              try {
                const value = localStorage.getItem(key)
                return value ? JSON.parse(value) : null
              } catch (error) {
                console.error('Error reading from localStorage:', error)
                return null
              }
            },
            setItem: (key, value) => {
              try {
                localStorage.setItem(key, JSON.stringify(value))
              } catch (error) {
                console.error('Error writing to localStorage:', error)
              }
            },
            removeItem: (key) => {
              try {
                localStorage.removeItem(key)
              } catch (error) {
                console.error('Error removing from localStorage:', error)
              }
            }
          }
        },
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