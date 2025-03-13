"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  hasSubscription: boolean
  isSubscriptionLoading: boolean
}

interface ProfileWithSubscription {
  subscription_status: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  hasSubscription: false,
  isSubscriptionLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (!supabase) return

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          // Check subscription status
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_status")
            .eq("id", session.user.id)
            .single()

          const typedProfile = profile as ProfileWithSubscription
          setHasSubscription(
            typedProfile?.subscription_status === "active" || 
            typedProfile?.subscription_status === "trialing"
          )
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
      } finally {
        setIsLoading(false)
        setIsSubscriptionLoading(false)
      }
    }

    // Check initial session
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)

      if (session?.user) {
        setIsSubscriptionLoading(true)
        // Check subscription status on auth change
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", session.user.id)
          .single()

        const typedProfile = profile as ProfileWithSubscription
        setHasSubscription(
          typedProfile?.subscription_status === "active" || 
          typedProfile?.subscription_status === "trialing"
        )
        setIsSubscriptionLoading(false)
      } else {
        setHasSubscription(false)
        setIsSubscriptionLoading(false)
      }
    })

    // Listen for subscription changes
    const subscriptionChannel = supabase
      .channel("subscription-status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: user ? `id=eq.${user.id}` : undefined
        },
        async (payload: any) => {
          if (payload.new) {
            const newProfile = payload.new as ProfileWithSubscription
            setHasSubscription(
              newProfile.subscription_status === "active" || 
              newProfile.subscription_status === "trialing"
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
      subscriptionChannel.unsubscribe()
    }
  }, [supabase, router])

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })

    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
  }

  const signOut = async () => {
    if (!supabase) throw new Error("Supabase client not initialized")

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signUp,
      signIn,
      signOut,
      hasSubscription,
      isSubscriptionLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}