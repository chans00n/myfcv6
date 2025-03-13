"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Play, ChevronRight } from "lucide-react"
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
    <Card className="overflow-hidden hover:shadow-md transition-all group border border-border/40 hover:border-primary/20 hover:bg-primary/5">
      <div className="flex flex-col sm:flex-row h-full">
        <div className="relative w-full sm:w-64 shrink-0">
          <Link href={`/workouts/${workout.id}`}>
            <div className="aspect-video sm:aspect-square w-full overflow-hidden">
              <img
                src={workout.image || "/placeholder.svg"}
                alt={workout.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="rounded-full bg-primary p-3 transform scale-75 group-hover:scale-100 transition-transform">
                  <Play className="h-6 w-6 text-primary-foreground fill-current" />
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
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <Link href={`/workouts/${workout.id}`}>
                <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{workout.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{workout.description}</p>
            </div>
            <Badge
              variant={
                workout.difficulty === "Basic"
                  ? "outline"
                  : workout.difficulty === "Intermediate"
                  ? "secondary"
                  : "default"
              }
              className="shrink-0"
            >
              {workout.difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {workout.duration}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {workout.date}
            </div>
            <Badge variant="outline" className="ml-auto">
              {workout.type}
            </Badge>
            <Link href={`/workouts/${workout.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">View workout details</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
} 