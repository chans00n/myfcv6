"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Workout error:", error)
  }, [error])

  return (
    <div className="container flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We encountered an error while loading this workout. Please try again later.
          </p>
          {error.digest && <p className="mt-2 text-sm text-muted-foreground">Error ID: {error.digest}</p>}
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => router.push("/workouts")}>
            Back to Workouts
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

