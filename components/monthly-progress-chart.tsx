"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Generate days of the week with unique identifiers
const DAYS_OF_WEEK = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
] as const

// Sample data - in a real app, this would come from your API
const SAMPLE_DATA = {
  currentWeek: {
    completedDays: 0,
    targetDays: 5,
    activeDays: ["Monday"], // Today is Monday
  },
  monthlyProgress: [
    // Week 1
    {
      weekNumber: 1,
      days: [
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: true },
        { completed: true },
      ],
    },
    // Week 2
    {
      weekNumber: 2,
      days: [
        { completed: true },
        { completed: true },
        { completed: true },
        { completed: true },
        { completed: true },
        { completed: true },
        { completed: true },
      ],
    },
    // Week 3
    {
      weekNumber: 3,
      days: [
        { completed: false, isToday: true },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
      ],
    },
    // Week 4
    {
      weekNumber: 4,
      days: [
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
      ],
    },
    // Week 5
    {
      weekNumber: 5,
      days: [
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
      ],
    },
    // Week 6
    {
      weekNumber: 6,
      days: [
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
      ],
    },
  ],
  streaks: {
    current: "1 week",
    best: "1 week",
  },
}

export function MonthlyProgressChart() {
  const [data] = useState(SAMPLE_DATA)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Monthly Progress</CardTitle>
        <CardDescription>Track your facial fitness journey over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Progress */}
        <div>
          <div className="space-y-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-8 gap-2">
              <div className="col-span-1"></div>
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.id} className="text-center text-sm text-muted-foreground">
                  {day.label}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="space-y-3">
              {data.monthlyProgress.map((week) => (
                <div key={week.weekNumber} className="grid grid-cols-8 gap-2 items-center">
                  <div className="text-right text-sm text-muted-foreground">
                    WEEK
                    <br />
                    {week.weekNumber}
                  </div>
                  {week.days.map((day, index) => (
                    <div
                      key={`${week.weekNumber}-${DAYS_OF_WEEK[index].id}`}
                      className={cn(
                        "aspect-square rounded-md border border-border/50 flex items-center justify-center",
                        day.completed && "bg-primary/20 border-primary",
                        day.isToday && "border-2 border-primary",
                      )}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="flex justify-between pt-2">
          <div>
            <div className="text-sm text-muted-foreground">CURRENT STREAK</div>
            <div className="text-2xl font-bold">{data.streaks.current}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">BEST STREAK</div>
            <div className="text-2xl font-bold">{data.streaks.best}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

