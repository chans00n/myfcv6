"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import type { Database } from "@/types/supabase"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, redirectTo?: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Create a new supabase browser client on every render
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)

          if (event === "SIGNED_IN") {
            // Set the auth cookie
            await fetch('/api/auth/set-auth-cookie', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event: 'SIGNED_IN',
                session,
              }),
            })

            // Handle redirect after sign in
            const redirectTo = searchParams.get('redirectTo') || '/dashboard'
            if (pathname.startsWith("/auth/")) {
              router.push(redirectTo)
              router.refresh()
            }
          } else if (event === "SIGNED_OUT") {
            // Clear the auth cookie
            await fetch('/api/auth/clear-auth-cookie', {
              method: 'POST',
            })

            router.push('/auth/login')
            router.refresh()
          }
        })

        setLoading(false)
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [supabase, router, pathname, searchParams])

  const signIn = async (email: string, password: string, redirectTo: string = "/dashboard") => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data?.session) {
        // Set the auth cookie
        await fetch('/api/auth/set-auth-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'SIGNED_IN',
            session: data.session,
          }),
        })

        router.push(redirectTo)
        router.refresh()
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login?verified=success`,
          data: {
            full_name: name
          }
        },
      })

      if (error) throw error

      toast.success('Verification email sent', {
        description: 'Please check your email to verify your account.',
      })
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear the auth cookie
      await fetch('/api/auth/clear-auth-cookie', {
        method: 'POST',
      })

      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  if (loading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 