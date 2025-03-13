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

                // Handle base64 encoded session data
                if (item.startsWith('base64-')) {
                  return item.replace('base64-', '')
                }

                // For other items, try parsing as JSON
                try {
                  return JSON.parse(item)
                } catch {
                  return item
                }
              } catch (error) {
                console.error('Storage getItem error:', { key, error })
                return null
              }
            },
            setItem: (key, value) => {
              try {
                // If it's already a string and looks like base64, store it directly
                if (typeof value === 'string' && /^[A-Za-z0-9+/=]+$/.test(value)) {
                  localStorage.setItem(key, `base64-${value}`)
                } else {
                  localStorage.setItem(key, JSON.stringify(value))
                }
              } catch (error) {
                console.error('Storage setItem error:', { key, error })
              }
            },
            removeItem: (key) => {
              try {
                localStorage.removeItem(key)
              } catch (error) {
                console.error('Storage removeItem error:', { key, error })
              }
            }
          }
        },
        cookies: {
          get(name: string) {
            try {
              const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith(`${name}=`))
              
              if (!cookie) return null
              
              const value = cookie.split('=')[1]
              return decodeURIComponent(value)
            } catch (error) {
              console.error('Cookie get error:', { name, error })
              return null
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              const domain = window.location.hostname
              const isLocalhost = domain === 'localhost' || domain === '127.0.0.1'
              const cookieStr = [
                `${name}=${encodeURIComponent(value)}`,
                `path=${options.path ?? '/'}`,
                !isLocalhost && `domain=.${domain}`,
                process.env.NODE_ENV === 'production' && 'secure',
                'samesite=lax',
                options.maxAge && `max-age=${options.maxAge}`
              ]
                .filter(Boolean)
                .join('; ')

              document.cookie = cookieStr
              console.log('Cookie set:', { name, domain, isLocalhost })
            } catch (error) {
              console.error('Cookie set error:', { name, error })
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              const domain = window.location.hostname
              const isLocalhost = domain === 'localhost' || domain === '127.0.0.1'
              const cookieStr = [
                `${name}=`,
                `path=${options.path ?? '/'}`,
                !isLocalhost && `domain=.${domain}`,
                process.env.NODE_ENV === 'production' && 'secure',
                'samesite=lax',
                'expires=Thu, 01 Jan 1970 00:00:00 GMT'
              ]
                .filter(Boolean)
                .join('; ')

              document.cookie = cookieStr
              console.log('Cookie removed:', { name, domain, isLocalhost })
            } catch (error) {
              console.error('Cookie remove error:', { name, error })
            }
          }
        }
      }
    )
  }
  return supabaseClient
} 