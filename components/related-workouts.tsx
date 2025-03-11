import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RelatedWorkout {
  id: string
  title: string
  type: string
  duration: string
  image: string
  level: string
}

interface RelatedWorkoutsProps {
  workouts: RelatedWorkout[]
  title?: string
}

export function RelatedWorkouts({ workouts, title = "You might also like" }: RelatedWorkoutsProps) {
  if (!workouts.length) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={workout.image || "/placeholder.svg"}
                alt={workout.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <Badge variant="outline" className="bg-black/40 text-white border-none backdrop-blur-sm">
                  {workout.type}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium line-clamp-1">{workout.title}</h4>
              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <span>{workout.duration}</span>
                <Badge variant="secondary" className="text-xs">
                  {workout.level}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t p-3">
              <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                <a href={`/workout/${workout.id}`}>
                  View Workout
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

