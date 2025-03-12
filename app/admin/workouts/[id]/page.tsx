import { notFound } from "next/navigation"
import { WorkoutForm } from "../_components/workout-form"
import { getWorkout } from "@/app/actions/workouts"

interface EditWorkoutPageProps {
  params: {
    id: string
  }
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const workout = await getWorkout(params.id)

  if (!workout) {
    notFound()
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b">
        <div className="container py-4">
          <h1 className="text-lg font-semibold">Edit Workout</h1>
          <p className="text-sm text-muted-foreground">
            Make changes to your workout
          </p>
        </div>
      </header>

      <div className="flex-1 container py-6">
        <div className="max-w-2xl">
          <WorkoutForm workout={workout} />
        </div>
      </div>
    </div>
  )
} 