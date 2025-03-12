"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { Database } from "@/types/supabase"

type Workout = Database["public"]["Tables"]["workouts"]["Insert"]
type WorkoutUpdate = Database["public"]["Tables"]["workouts"]["Update"]
type ContentBlock = {
  id: string
  type: "text" | "image" | "video"
  content: string
  order: number
}

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

export async function createWorkout(data: Workout & { content_blocks?: ContentBlock[] }) {
  const supabase = createServerClient()
  const { content_blocks, ...workoutData } = data

  // Create the workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert(workoutData)
    .select()
    .single()

  if (workoutError) {
    throw new Error(workoutError.message)
  }

  // Create content blocks if provided
  if (content_blocks?.length) {
    const { error: blocksError } = await supabase
      .from("workout_content_blocks")
      .insert(
        content_blocks.map((block) => ({
          workout_id: workout.id,
          type: block.type,
          content: block.content,
          order: block.order,
        }))
      )

    if (blocksError) {
      throw new Error(blocksError.message)
    }
  }

  revalidatePath("/admin/workouts")
  return workout
}

export async function updateWorkout(
  id: string,
  data: WorkoutUpdate & { content_blocks?: ContentBlock[] }
) {
  const supabase = createServerClient()
  const { content_blocks, ...workoutData } = data

  // Update the workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .update(workoutData)
    .eq("id", id)
    .select()
    .single()

  if (workoutError) {
    throw new Error(workoutError.message)
  }

  // Update content blocks if provided
  if (content_blocks) {
    // Delete existing blocks
    const { error: deleteError } = await supabase
      .from("workout_content_blocks")
      .delete()
      .eq("workout_id", id)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    // Insert new blocks
    if (content_blocks.length) {
      const { error: blocksError } = await supabase
        .from("workout_content_blocks")
        .insert(
          content_blocks.map((block) => ({
            workout_id: id,
            type: block.type,
            content: block.content,
            order: block.order,
          }))
        )

      if (blocksError) {
        throw new Error(blocksError.message)
      }
    }
  }

  revalidatePath("/admin/workouts")
  revalidatePath(`/admin/workouts/${id}`)
  return workout
}

export async function deleteWorkout(id: string) {
  const supabase = createServerClient()

  // Delete content blocks first (due to foreign key constraint)
  const { error: blocksError } = await supabase
    .from("workout_content_blocks")
    .delete()
    .eq("workout_id", id)

  if (blocksError) {
    throw new Error(blocksError.message)
  }

  // Delete the workout
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

export async function createWorkouts(workouts: (Workout & { content_blocks?: ContentBlock[] })[]) {
  const supabase = createServerClient()
  
  for (const workoutData of workouts) {
    const { content_blocks, ...workout } = workoutData
    
    // Create the workout
    const { data: createdWorkout, error: workoutError } = await supabase
      .from("workouts")
      .insert(workout)
      .select()
      .single()
      
    if (workoutError) {
      console.error(`Failed to create workout "${workout.title}":`, workoutError)
      continue
    }
    
    // Create content blocks if provided
    if (content_blocks?.length) {
      const { error: blocksError } = await supabase
        .from("workout_content_blocks")
        .insert(
          content_blocks.map((block) => ({
            workout_id: createdWorkout.id,
            type: block.type,
            content: block.content,
            order: block.order,
          }))
        )
        
      if (blocksError) {
        console.error(`Failed to create content blocks for workout "${workout.title}":`, blocksError)
      }
    }
  }
  
  revalidatePath("/admin/workouts")
} 