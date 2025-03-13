"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/supabase"
import type { User as SupabaseUser, Session } from "@supabase/supabase-js"

type User = SupabaseUser & {
  user_metadata: {
    role?: string
    full_name?: string
  }
  app_metadata: {
    role?: string
    provider?: string
    providers?: string[]
  }
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<Session | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const refreshSession = async (): Promise<Session | null> => {
    try {
      console.log('Starting session refresh');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        throw error;
      }

      if (!session) {
        console.log('No session found');
        setUser(null);
        return null;
      }

      // Try to refresh the session if it exists
      console.log('Attempting to refresh session');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Session refresh error:', refreshError);
        throw refreshError;
      }

      if (!refreshData.session) {
        console.log('No session after refresh');
        setUser(null);
        return null;
      }

      console.log('Session refreshed successfully:', {
        userId: refreshData.user?.id,
        hasSession: !!refreshData.session
      });

      setUser(refreshData.user as User);
      return refreshData.session;
    } catch (error: any) {
      console.error('Session refresh failed:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setError(error);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to get and refresh the session
        await refreshSession()

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state change:', {
            event,
            userId: session?.user?.id,
            hasSession: !!session
          })

          if (event === 'SIGNED_OUT') {
            setUser(null)
            router.push('/auth/login')
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              setUser(session.user as User)
            }
          } else if (event === 'USER_UPDATED') {
            if (session?.user) {
              setUser(session.user as User)
            }
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error)
        setError(error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [supabase.auth, router])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Refresh the session immediately after sign in
      await refreshSession()
    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      router.push("/auth/verify")
    } catch (error: any) {
      console.error('Sign up error:', error)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // First, clear cookies on the server
      const response = await fetch('/api/auth/clear-auth-cookie', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Failed to clear auth cookies:', await response.text())
      }

      // Then sign out on the client
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase signOut error:', error)
        throw error
      }

      // Clear user state
      setUser(null)

      // Redirect to login
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Logout error:", error)
      setError(error)
      // Still try to redirect to login even if there's an error
      router.push("/auth/login")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error,
      signIn, 
      signUp, 
      signOut,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}