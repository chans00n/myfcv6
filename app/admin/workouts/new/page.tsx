"use client"

import { WorkoutForm } from "../_components/workout-form"

export default function NewWorkoutPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Workout</h1>
        <p className="text-sm text-muted-foreground">
          Add a new workout to your library
        </p>
      </div>
      <WorkoutForm />
    </div>
  )
} 