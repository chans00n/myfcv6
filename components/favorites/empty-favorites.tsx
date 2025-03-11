"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Search } from "lucide-react"
import Link from "next/link"

interface EmptyFavoritesProps {
  type: "all" | "workouts" | "movements"
  searchQuery?: string
  onClearSearch?: () => void
}

export function EmptyFavorites({ type, searchQuery, onClearSearch }: EmptyFavoritesProps) {
  // If there's a search query but no results
  if (searchQuery && onClearSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't find any {type === "workouts" ? "workouts" : "movements"} matching "{searchQuery}" in your
          favorites.
        </p>
        <Button onClick={onClearSearch}>Clear Search</Button>
      </div>
    )
  }

  // If there are no favorites at all
  if (type === "all") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start adding workouts and movements to your favorites to access them quickly.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/workouts">Browse Workouts</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/movements">Explore Movements</Link>
          </Button>
        </div>
      </div>
    )
  }

  // If there are no favorites of a specific type
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No favorite {type} yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {type === "workouts"
          ? "Start adding workouts to your favorites to access them quickly."
          : "Start adding movements to your favorites to access them quickly."}
      </p>
      <Button asChild>
        <Link href={type === "workouts" ? "/workouts" : "/movements"}>
          Browse {type === "workouts" ? "Workouts" : "Movements"}
        </Link>
      </Button>
    </div>
  )
}

