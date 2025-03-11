"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, BookmarkCheck, Play } from "lucide-react"
import Link from "next/link"
import { useFavorites, type Workout } from "@/context/favorites-context"

interface FavoriteWorkoutsProps {
  workouts: Workout[]
}

export function FavoriteWorkouts({ workouts }: FavoriteWorkoutsProps) {
  const { removeFavoriteWorkout } = useFavorites()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workouts.map((workout) => (
        <Card key={workout.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            <Link href={`/workout/${workout.id}`}>
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={workout.image || workout.thumbnailUrl || "/placeholder.svg"}
                  alt={workout.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm text-white flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {workout.date}
                    </p>
                  </div>
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
              onClick={() => removeFavoriteWorkout(workout.id)}
              title="Remove from favorites"
            >
              <BookmarkCheck className="h-4 w-4 text-primary" />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col h-full">
              <Link href={`/workout/${workout.id}`}>
                <h3 className="font-semibold text-base mb-1 hover:underline">{workout.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow">{workout.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {workout.duration}
                  </span>
                </div>
                <Badge variant="outline">{workout.type}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

