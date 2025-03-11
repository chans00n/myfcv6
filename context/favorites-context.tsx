"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { MovementVideo } from "@/types/movement-video"

// Define the workout type based on existing data structure
export interface Workout {
  id: string
  title: string
  description: string
  date: string
  time?: string
  duration: string
  skillLevel?: string
  type: string
  publishedDate?: string
  image: string
  coach?: string
  calories?: string
  thumbnailUrl?: string
}

type FavoritesContextType = {
  favoriteWorkouts: Workout[]
  favoriteMovements: MovementVideo[]
  addFavoriteWorkout: (workout: Workout) => void
  removeFavoriteWorkout: (workoutId: string) => void
  addFavoriteMovement: (movement: MovementVideo) => void
  removeFavoriteMovement: (movementId: string) => void
  isWorkoutFavorited: (workoutId: string) => boolean
  isMovementFavorited: (movementId: string) => boolean
  toggleFavoriteWorkout: (workout: Workout) => void
  toggleFavoriteMovement: (movement: MovementVideo) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<Workout[]>([])
  const [favoriteMovements, setFavoriteMovements] = useState<MovementVideo[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      try {
        const savedWorkouts = localStorage.getItem("favorite-workouts")
        const savedMovements = localStorage.getItem("favorite-movements")

        if (savedWorkouts) {
          setFavoriteWorkouts(JSON.parse(savedWorkouts))
        }

        if (savedMovements) {
          setFavoriteMovements(JSON.parse(savedMovements))
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error)
      }

      setIsInitialized(true)
    }
  }, [isInitialized])

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("favorite-workouts", JSON.stringify(favoriteWorkouts))
      localStorage.setItem("favorite-movements", JSON.stringify(favoriteMovements))
    }
  }, [favoriteWorkouts, favoriteMovements, isInitialized])

  // Add a workout to favorites
  const addFavoriteWorkout = (workout: Workout) => {
    setFavoriteWorkouts((prev) => {
      if (prev.some((w) => w.id === workout.id)) {
        return prev
      }
      return [...prev, workout]
    })
  }

  // Remove a workout from favorites
  const removeFavoriteWorkout = (workoutId: string) => {
    setFavoriteWorkouts((prev) => prev.filter((workout) => workout.id !== workoutId))
  }

  // Add a movement to favorites
  const addFavoriteMovement = (movement: MovementVideo) => {
    setFavoriteMovements((prev) => {
      if (prev.some((m) => m.id === movement.id)) {
        return prev
      }
      return [...prev, movement]
    })
  }

  // Remove a movement from favorites
  const removeFavoriteMovement = (movementId: string) => {
    setFavoriteMovements((prev) => prev.filter((movement) => movement.id !== movementId))
  }

  // Check if a workout is favorited
  const isWorkoutFavorited = (workoutId: string) => {
    return favoriteWorkouts.some((workout) => workout.id === workoutId)
  }

  // Check if a movement is favorited
  const isMovementFavorited = (movementId: string) => {
    return favoriteMovements.some((movement) => movement.id === movementId)
  }

  // Toggle a workout's favorite status
  const toggleFavoriteWorkout = (workout: Workout) => {
    if (isWorkoutFavorited(workout.id)) {
      removeFavoriteWorkout(workout.id)
    } else {
      addFavoriteWorkout(workout)
    }
  }

  // Toggle a movement's favorite status
  const toggleFavoriteMovement = (movement: MovementVideo) => {
    if (isMovementFavorited(movement.id)) {
      removeFavoriteMovement(movement.id)
    } else {
      addFavoriteMovement(movement)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteWorkouts,
        favoriteMovements,
        addFavoriteWorkout,
        removeFavoriteWorkout,
        addFavoriteMovement,
        removeFavoriteMovement,
        isWorkoutFavorited,
        isMovementFavorited,
        toggleFavoriteWorkout,
        toggleFavoriteMovement,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

