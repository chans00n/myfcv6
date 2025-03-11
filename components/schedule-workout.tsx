"use client"

import { useState } from "react"
import { CalendarIcon, Clock, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

interface ScheduleWorkoutProps {
  workoutId: string
  workoutTitle: string
  duration: string
}

export function ScheduleWorkout({ workoutId, workoutTitle, duration }: ScheduleWorkoutProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("08:00")
  const [isScheduled, setIsScheduled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const timeOptions = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ]

  const handleSchedule = () => {
    if (!date) {
      toast({
        title: "Please select a date",
        description: "You need to choose a date to schedule this workout.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this to your backend
    console.log("Scheduling workout:", {
      workoutId,
      workoutTitle,
      date: format(date, "yyyy-MM-dd"),
      time,
    })

    toast({
      title: "Workout scheduled!",
      description: `${workoutTitle} scheduled for ${format(date, "EEEE, MMMM d")} at ${time}.`,
    })

    setIsScheduled(true)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      {isScheduled ? (
        <Button variant="outline" className="gap-2 text-green-600" disabled>
          <Check className="h-4 w-4" />
          Scheduled
        </Button>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Workout
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 pb-0">
              <div className="text-sm font-medium">Schedule "{workoutTitle}"</div>
              <div className="text-xs text-muted-foreground">Duration: {duration}</div>
            </div>
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="border-t" />
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-4 w-full" onClick={handleSchedule}>
                Add to Schedule
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <Button variant="ghost" size="icon" className="rounded-full">
        <CalendarIcon className="h-4 w-4" />
        <span className="sr-only">View schedule</span>
      </Button>
    </div>
  )
}

