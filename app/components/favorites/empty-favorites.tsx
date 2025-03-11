import { Button } from "@/components/ui/button"
import { BookOpen, Search, X } from "lucide-react"
import Link from "next/link"

interface EmptyFavoritesProps {
  type: "all" | "workouts" | "movements"
  searchQuery?: string
  onClearSearch?: () => void
}

export function EmptyFavorites({ type, searchQuery, onClearSearch }: EmptyFavoritesProps) {
  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-lg font-semibold">No results found</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          No {type === "workouts" ? "workouts" : "movements"} found matching &quot;{searchQuery}&quot;
        </p>
        <Button onClick={onClearSearch} variant="outline" size="sm">
          <X className="mr-2 h-4 w-4" />
          Clear search
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <BookOpen className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-lg font-semibold">No favorites yet</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {type === "all"
          ? "Start exploring workouts and movements to add them to your favorites"
          : type === "workouts"
          ? "Browse workouts and click the heart icon to add them to your favorites"
          : "Browse movements and click the heart icon to add them to your favorites"}
      </p>
      <Button asChild>
        <Link href={type === "movements" ? "/movements" : "/workouts"}>
          Browse {type === "all" ? "workouts" : type}
        </Link>
      </Button>
    </div>
  )
} 