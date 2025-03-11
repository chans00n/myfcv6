import { Workout } from "@/types"
import { WorkoutCard } from "@/components/workout-card"

interface FavoriteWorkoutsProps {
  workouts: Workout[]
}

export function FavoriteWorkouts({ workouts }: FavoriteWorkoutsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  )
} 