"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get the session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          // If there's an error getting the session, try to refresh it
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError) {
            console.error('Session refresh error:', refreshError)
            setUser(null)
          } else {
            setUser(refreshData.user as User)
          }
        } else {
          setUser(session?.user as User ?? null)
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state change:', event, session?.user?.id)
          if (event === 'SIGNED_OUT') {
            setUser(null)
            router.push('/auth/login')
          } else if (session?.user) {
            setUser(session.user as User)
          }
        })

        setIsInitialized(true)
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [supabase.auth, router])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      throw error
    }

    router.push("/auth/verify")
  }

  const signOut = async () => {
    try {
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
      }

      // Clear user state regardless of errors
      setUser(null)

      // Redirect to login
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Logout error:", error)
      // Still try to redirect to login even if there's an error
      router.push("/auth/login")
      throw error
    }
  }

  // Don't render until we've initialized auth
  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
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