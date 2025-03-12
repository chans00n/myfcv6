"use client"

import { WorkoutForm } from "../_components/workout-form"

export default function NewWorkoutPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b">
        <div className="container py-4">
          <h1 className="text-lg font-semibold">Create New Workout</h1>
          <p className="text-sm text-muted-foreground">
            Add a new workout to your collection
          </p>
        </div>
      </header>

      <div className="flex-1 container py-6">
        <div className="max-w-2xl">
          <WorkoutForm />
        </div>
      </div>
    </div>
  )
} 