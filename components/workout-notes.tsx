"use client"

import { useState, useEffect } from "react"
import { PencilLine, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface WorkoutNotesProps {
  workoutId: string
}

export function WorkoutNotes({ workoutId }: WorkoutNotesProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState("")
  const [savedNotes, setSavedNotes] = useState("")

  // In a real app, you would fetch the saved notes from your backend
  useEffect(() => {
    // Simulate loading saved notes from localStorage for demo purposes
    const savedData = localStorage.getItem(`workout-notes-${workoutId}`)
    if (savedData) {
      setSavedNotes(savedData)
      setNotes(savedData)
    }
  }, [workoutId])

  const handleSave = () => {
    // In a real app, you would save this to your backend
    localStorage.setItem(`workout-notes-${workoutId}`, notes)
    setSavedNotes(notes)
    setIsEditing(false)

    toast({
      title: "Notes saved",
      description: "Your workout notes have been saved successfully.",
    })
  }

  const handleClear = () => {
    setNotes("")
    setSavedNotes("")
    localStorage.removeItem(`workout-notes-${workoutId}`)
    setIsEditing(false)

    toast({
      title: "Notes cleared",
      description: "Your workout notes have been cleared.",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Personal Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your personal notes about this workout..."
            className="min-h-[120px] resize-none"
          />
        ) : (
          <div className="min-h-[80px] rounded-md border border-dashed p-3">
            {savedNotes ? (
              <p className="text-sm whitespace-pre-wrap">{savedNotes}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No notes yet. Click edit to add your personal notes about this workout.
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={handleClear}>
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Clear
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="mr-1 h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          </>
        ) : (
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setIsEditing(true)}>
            <PencilLine className="mr-1 h-3.5 w-3.5" />
            {savedNotes ? "Edit Notes" : "Add Notes"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

