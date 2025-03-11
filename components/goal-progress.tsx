"use client"

import { Award, Calendar, Clock, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Sample goals data
const goals = [
  {
    id: 1,
    title: "Complete 20 workouts",
    current: 12,
    target: 20,
    icon: Calendar,
    color: "text-lime-600",
    bgColor: "bg-lime-100 dark:bg-lime-950/30",
  },
  {
    id: 2,
    title: "Workout for 5 hours",
    current: 225, // in minutes
    target: 300, // 5 hours in minutes
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-950/30",
    unit: "min",
  },
  {
    id: 3,
    title: "7-day streak",
    current: 5,
    target: 7,
    icon: Target,
    color: "text-rose-600",
    bgColor: "bg-rose-100 dark:bg-rose-950/30",
  },
]

// Sample achievements
const achievements = [
  {
    id: 1,
    title: "First Workout",
    description: "Completed your first facial fitness workout",
    icon: Award,
    color: "text-primary",
    bgColor: "bg-primary/10",
    completed: true,
  },
  {
    id: 2,
    title: "Consistency Champion",
    description: "Completed workouts 3 days in a row",
    icon: Award,
    color: "text-primary",
    bgColor: "bg-primary/10",
    completed: true,
  },
]

export function GoalProgress() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Current Goals</h3>
        {goals.map((goal) => {
          const progress = Math.round((goal.current / goal.target) * 100)
          const IconComponent = goal.icon

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${goal.bgColor}`}>
                    <IconComponent className={`h-3.5 w-3.5 ${goal.color}`} />
                  </div>
                  <span className="text-sm font-medium">{goal.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target} {goal.unit || ""}
                </span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )
        })}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Recent Achievements</h3>
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon

            return (
              <div key={achievement.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full shrink-0 ${achievement.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${achievement.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

