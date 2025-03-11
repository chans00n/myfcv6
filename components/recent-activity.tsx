"use client"

import { Clock, Calendar, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Sample data for recent activities
const recentActivities = [
  {
    id: 1,
    title: "Friday Express Lift",
    date: "Today",
    time: "9:30 AM",
    duration: "10 min",
    type: "Express",
  },
  {
    id: 2,
    title: "Thursday Sculpt",
    date: "Yesterday",
    time: "8:15 AM",
    duration: "15 min",
    type: "Sculpt",
  },
  {
    id: 3,
    title: "Wednesday Power Flow",
    date: "2 days ago",
    time: "7:45 AM",
    duration: "20 min",
    type: "Power Flow",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivities.map((activity, index) => (
        <div key={activity.id}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">{activity.title}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {activity.date}
                <span className="mx-1">•</span>
                <Clock className="h-3.5 w-3.5 mr-1" />
                {activity.time}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {activity.type}
            </Badge>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {activity.duration}
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
              <a href={`/workout/${activity.id}`}>
                Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>

          {index < recentActivities.length - 1 && <Separator className="my-3" />}
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full mt-2">
        View All Activity
      </Button>
    </div>
  )
}

