import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import type { CookieOptions } from '@supabase/ssr'

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
                const item = localStorage.getItem(key)
                if (!item) return null
                
                // If it's a base64 string, return it as is
                if (item.startsWith('base64-')) {
                  return item
                }
                
                // Try to parse as JSON
                try {
                  return JSON.parse(item)
                } catch {
                  return item
                }
              } catch (error) {
                console.error('Error reading from localStorage:', error)
                return null
              }
            },
            setItem: (key, value) => {
              try {
                if (typeof value === 'string' && value.startsWith('base64-')) {
                  localStorage.setItem(key, value)
                } else {
                  localStorage.setItem(key, JSON.stringify(value))
                }
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
              return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
            } catch (error) {
              console.error('Error reading cookie:', error)
              return null
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              const domain = window.location.hostname
              const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1')
              document.cookie = `${name}=${encodeURIComponent(value)}; path=${options.path ?? '/'}; domain=${isLocalhost ? undefined : `.${domain}`}; secure=${process.env.NODE_ENV === 'production'}; samesite=lax; max-age=${60 * 60 * 24 * 7}`
            } catch (error) {
              console.error('Error setting cookie:', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              const domain = window.location.hostname
              const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1')
              document.cookie = `${name}=; path=${options.path ?? '/'}; domain=${isLocalhost ? undefined : `.${domain}`}; secure=${process.env.NODE_ENV === 'production'}; samesite=lax; expires=Thu, 01 Jan 1970 00:00:00 GMT`
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