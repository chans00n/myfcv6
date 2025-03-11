"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useFavorites, type Workout } from "@/context/favorites-context"
import type { MovementVideo } from "@/types/movement-video"

interface FavoriteButtonProps {
  item: Workout | MovementVideo
  itemType: "workout" | "movement"
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
}

export function FavoriteButton({
  item,
  itemType,
  variant = "outline",
  size = "sm",
  showText = true,
  className,
}: FavoriteButtonProps) {
  const { isWorkoutFavorited, isMovementFavorited, toggleFavoriteWorkout, toggleFavoriteMovement } = useFavorites()

  const isFavorited = itemType === "workout" ? isWorkoutFavorited(item.id) : isMovementFavorited(item.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (itemType === "workout") {
      toggleFavoriteWorkout(item as Workout)
    } else {
      toggleFavoriteMovement(item as MovementVideo)
    }
  }

  return (
    <Button
      variant={isFavorited ? "default" : variant}
      size={size}
      onClick={handleToggleFavorite}
      className={`gap-2 ${className}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorited ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {showText && (isFavorited ? "Saved" : "Save")}
    </Button>
  )
}

