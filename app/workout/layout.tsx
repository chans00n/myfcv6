import type React from "react"

export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Workout Details</h1>
      {children}
    </div>
  )
}

