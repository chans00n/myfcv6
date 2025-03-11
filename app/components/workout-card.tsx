"use client"

import { Workout } from "@/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "@/context/favorites-context"

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const { toggleWorkoutFavorite } = useFavorites()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={workout.thumbnail}
            alt={workout.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={() => toggleWorkoutFavorite(workout)}
          >
            <Heart
              className={`h-4 w-4 ${workout.isFavorite ? "fill-current text-red-500" : "text-muted-foreground"}`}
            />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <Badge variant="secondary" className="w-fit">
          {workout.type}
        </Badge>
        <h3 className="line-clamp-1 text-lg font-semibold">{workout.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{workout.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/workouts/${workout.id}`}>View workout</Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 