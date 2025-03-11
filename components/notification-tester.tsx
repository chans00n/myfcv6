"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"

export function NotificationTester() {
  const [title, setTitle] = useState("Workout Reminder")
  const [body, setBody] = useState("Your scheduled facial workout starts in 15 minutes!")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendTestNotification = async () => {
    setIsSending(true)

    try {
      const response = await fetch("/api/push/send-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          url: "/workouts",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send test notification")
      }

      toast({
        title: "Test Notification Sent",
        description: "If notifications are enabled, you should receive it shortly.",
      })
    } catch (error) {
      console.error("Error sending test notification:", error)
      toast({
        title: "Error",
        description: "Failed to send test notification.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Notifications</CardTitle>
        <CardDescription>Send a test notification to verify your setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Notification Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="body" className="text-sm font-medium">
            Notification Body
          </label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter notification message"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendTestNotification} disabled={isSending || !title || !body} className="w-full">
          <Bell className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Test Notification"}
        </Button>
      </CardFooter>
    </Card>
  )
}

