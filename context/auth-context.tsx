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
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    initializeAuth()
  }, [supabase.auth])

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
        throw new Error('Failed to clear auth cookies')
      }

      // Then sign out on the client
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear user state
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