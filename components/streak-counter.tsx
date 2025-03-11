"use client"

import { Calendar, Flame } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function StreakCounter() {
  // Current streak data
  const currentStreak = 5
  const longestStreak = 14
  const streakPercentage = (currentStreak / 7) * 100 // Percentage of a week

  // Generate the last 7 days for the streak calendar
  const days = [
    { id: "mon", label: "Mon" },
    { id: "tue", label: "Tue" },
    { id: "wed", label: "Wed" },
    { id: "thu", label: "Thu" },
    { id: "fri", label: "Fri" },
    { id: "sat", label: "Sat" },
    { id: "sun", label: "Sun" },
  ] as const

  // Sample data for completed days (in a real app, this would come from your API)
  const completedDays = ["mon", "tue", "wed", "thu", "fri"]
  const today = "sat" // For demo purposes

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{currentStreak} day streak</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Longest streak: {longestStreak} days</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Week {Math.ceil(new Date().getDate() / 7)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Weekly goal: 7 days</span>
          <span className="text-sm text-muted-foreground">{currentStreak}/7 days</span>
        </div>
        <Progress value={streakPercentage} className="h-2" />
      </div>

      <div className="grid grid-cols-7 gap-1 mt-4">
        {days.map((day) => {
          const isCompleted = completedDays.includes(day.id)
          const isToday = day.id === today

          return (
            <div key={day.id} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">{day.label}</div>
              <div
                className={`
                  h-9 w-9 mx-auto rounded-full flex items-center justify-center text-xs font-medium
                  ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"}
                  ${isToday && !isCompleted ? "border-2 border-primary" : ""}
                `}
              >
                {isCompleted && <Flame className="h-4 w-4" />}
              </div>
            </div>
          )
        })}
      </div>

      <Button className="w-full">Start Today's Workout</Button>
    </div>
  )
}

