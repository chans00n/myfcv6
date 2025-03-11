"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, BookmarkCheck, Play } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useFavorites } from "@/context/favorites-context"
import type { MovementVideo } from "@/types/movement-video"

interface FavoriteMovementsProps {
  movements: MovementVideo[]
}

export function FavoriteMovements({ movements }: FavoriteMovementsProps) {
  const { removeFavoriteMovement } = useFavorites()

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {movements.map((movement) => (
        <Card key={movement.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            <Link href={`/movements/${movement.id}`}>
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={movement.thumbnailUrl || "/placeholder.svg"}
                  alt={movement.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(movement.durationSeconds)}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="rounded-full bg-primary/90 p-3">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
              onClick={() => removeFavoriteMovement(movement.id)}
              title="Remove from favorites"
            >
              <BookmarkCheck className="h-4 w-4 text-primary" />
            </Button>
            <Badge
              className="absolute top-2 left-2"
              variant={
                movement.difficulty === "Beginner"
                  ? "secondary"
                  : movement.difficulty === "Intermediate"
                    ? "default"
                    : "destructive"
              }
            >
              {movement.difficulty}
            </Badge>
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col h-full">
              <Link href={`/movements/${movement.id}`}>
                <h3 className="font-semibold text-base mb-1 hover:underline">{movement.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-1">{movement.instructor}</p>
              <div className="flex items-center text-xs text-muted-foreground gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {movement.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(movement.dateAdded)}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <Badge variant="outline">{movement.category}</Badge>
                <Link href={`/movements/${movement.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

