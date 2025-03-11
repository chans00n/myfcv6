"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

export function ScheduleNotification() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("08:00")
  const [workoutId, setWorkoutId] = useState<string>("")
  const [isScheduling, setIsScheduling] = useState(false)
  const { toast } = useToast()

  // Mock workout data - in a real app, this would come from your API
  const workouts = [
    { id: "1", name: "Morning Facial Refresh" },
    { id: "2", name: "Jawline Sculpting" },
    { id: "3", name: "Full Face Toning" },
    { id: "4", name: "Eye Area Focus" },
    { id: "5", name: "Neck & Chin Lift" },
  ]

  const handleScheduleNotification = async () => {
    if (!date || !workoutId) {
      toast({
        title: "Missing Information",
        description: "Please select a date and workout.",
        variant: "destructive",
      })
      return
    }

    setIsScheduling(true)

    try {
      // Combine date and time
      const [hours, minutes] = time.split(":").map(Number)
      const scheduledDate = new Date(date)
      scheduledDate.setHours(hours, minutes, 0, 0)

      // Don't allow scheduling in the past
      if (scheduledDate <= new Date()) {
        toast({
          title: "Invalid Time",
          description: "Please select a future date and time.",
          variant: "destructive",
        })
        setIsScheduling(false)
        return
      }

      const selectedWorkout = workouts.find((w) => w.id === workoutId)

      const response = await fetch("/api/push/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledFor: scheduledDate.toISOString(),
          workoutId,
          title: "Workout Reminder",
          body: `Your ${selectedWorkout?.name} workout is scheduled to start soon!`,
          url: `/workout/${workoutId}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule notification")
      }

      toast({
        title: "Reminder Scheduled",
        description: `You'll be notified before your ${selectedWorkout?.name} workout.`,
      })

      // Reset form
      setDate(undefined)
      setTime("08:00")
      setWorkoutId("")
    } catch (error) {
      console.error("Error scheduling notification:", error)
      toast({
        title: "Error",
        description: "Failed to schedule the reminder.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Workout Reminder</CardTitle>
        <CardDescription>Set up a notification to remind you about your upcoming workout</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="workout" className="text-sm font-medium">
            Select Workout
          </label>
          <Select value={workoutId} onValueChange={setWorkoutId}>
            <SelectTrigger id="workout">
              <SelectValue placeholder="Select a workout" />
            </SelectTrigger>
            <SelectContent>
              {workouts.map((workout) => (
                <SelectItem key={workout.id} value={workout.id}>
                  {workout.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label htmlFor="time" className="text-sm font-medium">
            Time
          </label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleScheduleNotification} disabled={isScheduling || !date || !workoutId} className="w-full">
          {isScheduling ? "Scheduling..." : "Schedule Reminder"}
        </Button>
      </CardFooter>
    </Card>
  )
}

