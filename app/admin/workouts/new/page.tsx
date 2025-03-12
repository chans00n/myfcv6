"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function NewWorkoutPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex flex-col h-full">
      <header className="border-b">
        <div className="container flex items-center gap-4 py-4">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/admin/workouts">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">New Workout</h1>
            <p className="text-sm text-muted-foreground">
              Create a new workout
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>Publish</Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container py-6">
        <div className="max-w-2xl">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter workout title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter workout description"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facial-fitness">Facial Fitness</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="power-flow">Power Flow</SelectItem>
                        <SelectItem value="sculpt">Sculpt</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="recovery">Recovery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input type="number" min="1" placeholder="Enter duration" />
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Content Blocks</Label>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Content editor coming soon...</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Media upload coming soon...</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 