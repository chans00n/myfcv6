import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Workout Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The workout you're looking for doesn't exist or has been removed.</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/workouts">Back to Workouts</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

