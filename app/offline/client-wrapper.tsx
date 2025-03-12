"use client"

import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function OfflineClientPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-6 p-4 bg-secondary rounded-full">
        <WifiOff className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-2">You're offline</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        It looks like you're not connected to the internet. Some features may not be available while offline.
      </p>

      <div className="space-y-4">
        <Button onClick={() => window.location.reload()} className="w-full md:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link href="/dashboard" className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <h3 className="font-medium mb-1">Dashboard</h3>
            <p className="text-sm text-muted-foreground">View your progress</p>
          </Link>

          <Link href="/workouts" className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <h3 className="font-medium mb-1">Workouts</h3>
            <p className="text-sm text-muted-foreground">Browse available workouts</p>
          </Link>
        </div>
      </div>
    </div>
  )
} 