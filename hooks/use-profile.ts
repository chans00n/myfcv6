import { useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export type Profile = {
  id: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  twitter_url: string | null
  github_url: string | null
  linkedin_url: string | null
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const getProfile = useCallback(async () => {
    try {
      if (!user?.id) throw new Error("User not found")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error
      return data as Profile
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to fetch profile")
      return null
    }
  }, [user, supabase])

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      try {
        if (!user?.id) throw new Error("User not found")

        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user.id)

        if (error) throw error
        toast.success("Profile updated successfully")
        return true
      } catch (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile")
        return false
      }
    },
    [user, supabase]
  )

  return {
    getProfile,
    updateProfile,
  }
} 