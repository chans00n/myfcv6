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
            try {
              const cookies = document.cookie.split(';')
              const cookie = cookies.find(c => c.trim().startsWith(name + '='))
              if (!cookie) return null
              
              const value = decodeURIComponent(cookie.split('=')[1].trim())
              
              // Return base64 cookies as-is without parsing
              if (value.startsWith('base64-')) {
                return value
              }
              
              // Try to parse as JSON if not base64
              try {
                return JSON.parse(value)
              } catch {
                return value
              }
            } catch (error) {
              console.error('Error reading cookie:', error)
              return null
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              let cookieValue = value
              if (typeof value === 'object') {
                cookieValue = JSON.stringify(value)
              }
              
              document.cookie = `${name}=${encodeURIComponent(cookieValue)}; path=${options.path ?? '/'}; domain=.myfc.app; secure; samesite=lax`
            } catch (error) {
              console.error('Error setting cookie:', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              document.cookie = `${name}=; path=${options.path ?? '/'}; domain=.myfc.app; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`
            } catch (error) {
              console.error('Error removing cookie:', error)
            }
          }
        }
      }
    )
  }
  return supabaseClient
} 