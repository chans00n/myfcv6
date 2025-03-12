"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { Database } from "@/types/supabase"

type Workout = Database["public"]["Tables"]["workouts"]["Insert"]
type WorkoutUpdate = Database["public"]["Tables"]["workouts"]["Update"]

export async function getWorkouts() {
  const supabase = createServerClient()
  
  const { data: workouts, error } = await supabase
    .from("workouts")
    .select(`
      *,
      workout_content_blocks (
        *
      ),
      workout_media (
        *
      ),
      workout_to_tags (
        workout_tags (
          *
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return workouts
}

export async function getWorkout(id: string) {
  const supabase = createServerClient()
  
  const { data: workout, error } = await supabase
    .from("workouts")
    .select(`
      *,
      workout_content_blocks (
        *
      ),
      workout_media (
        *
      ),
      workout_to_tags (
        workout_tags (
          *
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return workout
}

export async function createWorkout(workout: Workout) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("workouts")
    .insert(workout)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/workouts")
  return data
}

export async function updateWorkout(id: string, workout: WorkoutUpdate) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("workouts")
    .update(workout)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/workouts")
  revalidatePath(`/admin/workouts/${id}`)
  return data
}

export async function deleteWorkout(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/workouts")
}

export async function publishWorkout(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("workouts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/workouts")
  revalidatePath(`/admin/workouts/${id}`)
  return data
}

export async function unpublishWorkout(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("workouts")
    .update({
      status: "draft",
      published_at: null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/workouts")
  revalidatePath(`/admin/workouts/${id}`)
  return data
} 