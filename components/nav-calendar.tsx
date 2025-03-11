"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SidebarGroup, SidebarGroupLabel, useSidebar } from "@/components/ui/sidebar"

// Sample workout data - in a real app, this would come from your API/database
const workoutSchedule = {
  "2025-03-09": { id: "1", title: "Sunday Facial Fitness" },
  "2025-03-10": { id: "2", title: "Monday Facial Fitness" },
  "2025-03-11": { id: "3", title: "Texas Cardio Tuesday" },
  "2025-03-12": { id: "4", title: "Wednesday Power Flow" },
  "2025-03-13": { id: "5", title: "Thursday Sculpt" },
  "2025-03-14": { id: "6", title: "Friday Express Lift" },
  "2025-03-15": { id: "8", title: "Saturday Recovery" },
}

export function NavCalendar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [weekDays, setWeekDays] = useState<Date[]>([])

  // Generate the days for the current week
  useEffect(() => {
    const start = currentWeekStart
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start, end })
    setWeekDays(days)
  }, [currentWeekStart])

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1))
  }

  // Function to check if a date has a workout
  const hasWorkout = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return false
    }
    const dateString = format(date, "yyyy-MM-dd")
    return dateString in workoutSchedule
  }

  // Function to get workout ID for a date
  const getWorkoutId = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return undefined
    }
    const dateString = format(date, "yyyy-MM-dd")
    return workoutSchedule[dateString]?.id
  }

  // Function to get workout title for a date
  const getWorkoutTitle = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return undefined
    }
    const dateString = format(date, "yyyy-MM-dd")
    return workoutSchedule[dateString]?.title
  }

  // Get the week range for display
  const weekRangeText = `${format(currentWeekStart, "MMM d")} - ${format(
    endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
    "MMM d, yyyy",
  )}`

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Weekly Schedule</span>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-3 w-3" />
            <span className="sr-only">Previous week</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleNextWeek}>
            <ChevronRight className="h-3 w-3" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>
      </SidebarGroupLabel>

      <div className="px-2 py-1">
        <div className="text-xs font-medium mb-2">{weekRangeText}</div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-[10px] text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dateStr = format(day, "d")
            const isWorkoutDay = hasWorkout(day)
            const workoutId = getWorkoutId(day)
            const workoutTitle = getWorkoutTitle(day)

            return (
              <div key={dateStr} className="text-center">
                {isWorkoutDay && workoutId ? (
                  <Link
                    href={`/workout/${workoutId}`}
                    className={`
                      block w-full py-1 text-xs rounded
                      ${
                        isToday(day)
                          ? "bg-primary text-primary-foreground"
                          : "border border-primary hover:bg-primary/10"
                      }
                    `}
                    title={workoutTitle}
                  >
                    {dateStr}
                  </Link>
                ) : (
                  <div
                    className={`
                      py-1 text-xs rounded
                      ${isToday(day) ? "bg-accent text-accent-foreground" : "text-muted-foreground"}
                    `}
                  >
                    {dateStr}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming workouts for the week */}
      <div className="mt-2 px-2">
        <h4 className="text-xs font-medium mb-2">This Week's Lifts</h4>
        <div className="space-y-1.5">
          {weekDays
            .map((day) => {
              const isWorkoutDay = hasWorkout(day)
              const workoutId = getWorkoutId(day)
              const workoutTitle = getWorkoutTitle(day)

              if (isWorkoutDay && workoutId && workoutTitle) {
                return (
                  <Link key={format(day, "yyyy-MM-dd")} href={`/workout/${workoutId}`} className="block">
                    <div className="text-xs hover:bg-muted rounded p-1.5">
                      <div className="font-medium">{workoutTitle}</div>
                      <div className="text-muted-foreground text-[10px]">{format(day, "EEEE, MMM d")}</div>
                    </div>
                  </Link>
                )
              }
              return null
            })
            .filter(Boolean)}
        </div>
      </div>
    </SidebarGroup>
  )
}

