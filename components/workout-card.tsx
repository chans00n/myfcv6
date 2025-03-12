"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Play } from "lucide-react"
import Link from "next/link"
import { FavoriteButton } from "@/components/favorites/favorite-button"

interface WorkoutCardProps {
  workout: {
    id: string
    title: string
    description: string
    duration: string
    type: string
    date: string
    image: string
    difficulty: string
  }
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <Link href={`/workouts/${workout.id}`}>
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={workout.image || "/placeholder.svg"}
              alt={workout.title}
              className="object-cover w-full h-full rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="rounded-full bg-primary/90 p-3">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          </div>
        </Link>
        <div className="absolute top-2 right-2">
          <FavoriteButton
            item={workout}
            itemType="workout"
            variant="ghost"
            size="icon"
            showText={false}
            className="h-8 w-8 rounded-full bg-background/80 hover:bg-background"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <Link href={`/workouts/${workout.id}`}>
            <h3 className="font-semibold text-base mb-1 hover:underline">{workout.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{workout.description}</p>
          <div className="flex items-center text-xs text-muted-foreground gap-3 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {workout.duration}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {workout.date}
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline">{workout.type}</Badge>
            <Badge
              variant={
                workout.difficulty === "Basic"
                  ? "outline"
                  : workout.difficulty === "Intermediate"
                  ? "secondary"
                  : "default"
              }
            >
              {workout.difficulty}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 