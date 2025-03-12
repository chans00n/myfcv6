import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient, type User } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Create a singleton instance of the Supabase client
const supabase = createClientComponentClient()

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        // If we have a session and we're on an auth page, redirect to dashboard
        if (session?.user && window.location.pathname.startsWith('/auth')) {
          router.push('/dashboard')
        }
        // If we don't have a session and we're not on an auth page, redirect to login
        else if (!session?.user && !window.location.pathname.startsWith('/auth')) {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Error checking auth session:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle auth state changes
      if (event === 'SIGNED_IN') {
        router.push('/dashboard')
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      if (data.session) {
        setUser(data.session.user)
        router.push('/dashboard')
        toast.success('Signed in successfully')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to sign in')
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      toast.success('Verification email sent. Please check your inbox.')
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Failed to sign up')
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/auth/login')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to sign out')
    }
  }

  // Don't render children until we've initialized auth
  if (loading) {
    return null // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        loading,
      }}
    >
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