"use client"

import { Movement, Workout } from "@/types"
import { createContext, useContext, useEffect, useState } from "react"

interface FavoritesContextType {
  favoriteWorkouts: Workout[]
  favoriteMovements: Movement[]
  toggleWorkoutFavorite: (workout: Workout) => void
  toggleMovementFavorite: (movement: Movement) => void
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteWorkouts: [],
  favoriteMovements: [],
  toggleWorkoutFavorite: () => {},
  toggleMovementFavorite: () => {},
})

export function useFavorites() {
  return useContext(FavoritesContext)
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<Workout[]>([])
  const [favoriteMovements, setFavoriteMovements] = useState<Movement[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run this once on client-side
    if (typeof window !== "undefined" && !isInitialized) {
      const savedWorkouts = localStorage.getItem("favoriteWorkouts")
      const savedMovements = localStorage.getItem("favoriteMovements")

      if (savedWorkouts) {
        setFavoriteWorkouts(JSON.parse(savedWorkouts))
      }
      if (savedMovements) {
        setFavoriteMovements(JSON.parse(savedMovements))
      }
      setIsInitialized(true)
    }
  }, [isInitialized])

  useEffect(() => {
    // Only save to localStorage after initialization and on client-side
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("favoriteWorkouts", JSON.stringify(favoriteWorkouts))
      localStorage.setItem("favoriteMovements", JSON.stringify(favoriteMovements))
    }
  }, [favoriteWorkouts, favoriteMovements, isInitialized])

  const toggleWorkoutFavorite = (workout: Workout) => {
    setFavoriteWorkouts((prev) => {
      const exists = prev.some((w) => w.id === workout.id)
      if (exists) {
        return prev.filter((w) => w.id !== workout.id)
      }
      return [...prev, { ...workout, isFavorite: true }]
    })
  }

  const toggleMovementFavorite = (movement: Movement) => {
    setFavoriteMovements((prev) => {
      const exists = prev.some((m) => m.id === movement.id)
      if (exists) {
        return prev.filter((m) => m.id !== movement.id)
      }
      return [...prev, { ...movement, isFavorite: true }]
    })
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteWorkouts,
        favoriteMovements,
        toggleWorkoutFavorite,
        toggleMovementFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
} 