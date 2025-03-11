"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, BellOff, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import notificationService, { type NotificationPermissionState } from "@/lib/notification-service"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>("default")
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [workoutReminders, setWorkoutReminders] = useState<boolean>(false)
  const [newContent, setNewContent] = useState<boolean>(false)
  const [specialOffers, setSpecialOffers] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    async function initNotificationState() {
      setIsLoading(true)

      // Check if push is supported
      const isPushSupported = notificationService.isPushSupported()
      if (!isPushSupported) {
        setPermissionState("unsupported")
        setIsLoading(false)
        return
      }

      // Get current permission state
      const permission = notificationService.getPermissionState()
      setPermissionState(permission)

      // Check if already subscribed
      if (permission === "granted") {
        const subscription = await notificationService.getCurrentSubscription()
        setIsSubscribed(!!subscription)

        // Get notification preferences from local storage
        const preferences = localStorage.getItem("notification-preferences")
        if (preferences) {
          const { workoutReminders, newContent, specialOffers } = JSON.parse(preferences)
          setWorkoutReminders(workoutReminders ?? false)
          setNewContent(newContent ?? false)
          setSpecialOffers(specialOffers ?? false)
        }
      }

      setIsLoading(false)
    }

    initNotificationState()
  }, [])

  const handleRequestPermission = async () => {
    setIsLoading(true)

    try {
      const permission = await notificationService.requestPermission()
      setPermissionState(permission)

      if (permission === "granted") {
        await handleSubscribe()
      } else if (permission === "denied") {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings to receive updates.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting permission:", error)
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleSubscribe = async () => {
    setIsLoading(true)

    try {
      const subscription = await notificationService.subscribeToPush()
      setIsSubscribed(!!subscription)

      if (subscription) {
        // Save default preferences
        const preferences = {
          workoutReminders: true,
          newContent: true,
          specialOffers: false,
        }

        setWorkoutReminders(preferences.workoutReminders)
        setNewContent(preferences.newContent)
        setSpecialOffers(preferences.specialOffers)

        localStorage.setItem("notification-preferences", JSON.stringify(preferences))

        // Update preferences on server
        await updateNotificationPreferences(preferences)

        toast({
          title: "Notifications Enabled",
          description: "You'll now receive updates about your workouts and new content.",
        })
      }
    } catch (error) {
      console.error("Error subscribing to push:", error)
      toast({
        title: "Error",
        description: "Failed to enable notifications.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true)

    try {
      const success = await notificationService.unsubscribeFromPush()
      setIsSubscribed(!success)

      if (success) {
        toast({
          title: "Notifications Disabled",
          description: "You won't receive any more notifications from this app.",
        })
      }
    } catch (error) {
      console.error("Error unsubscribing from push:", error)
      toast({
        title: "Error",
        description: "Failed to disable notifications.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const updateNotificationPreferences = async (preferences: any) => {
    try {
      const response = await fetch("/api/push/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to update preferences")
      }

      // Save to local storage
      localStorage.setItem("notification-preferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      })
    }
  }

  const handlePreferenceChange = async (key: string, value: boolean) => {
    const preferences = {
      workoutReminders,
      newContent,
      specialOffers,
      [key]: value,
    }

    // Update local state
    if (key === "workoutReminders") setWorkoutReminders(value)
    if (key === "newContent") setNewContent(value)
    if (key === "specialOffers") setSpecialOffers(value)

    // Update server
    await updateNotificationPreferences(preferences)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  if (permissionState === "unsupported") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Control how and when you receive notifications from MYFC</CardDescription>
      </CardHeader>
      <CardContent>
        {permissionState !== "granted" ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Bell className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Enable Notifications</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Get timely reminders for your workouts, updates on new content, and stay on track with your facial fitness
              goals.
            </p>
            <Button onClick={handleRequestPermission} className="mt-2">
              Enable Notifications
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-4">
              <div className="space-y-0.5">
                <h4 className="font-medium">Notification Status</h4>
                <p className="text-sm text-muted-foreground">
                  {isSubscribed ? "Notifications are enabled" : "Notifications are disabled"}
                </p>
              </div>
              <Button
                variant={isSubscribed ? "outline" : "default"}
                onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
              >
                {isSubscribed ? (
                  <>
                    <BellOff className="mr-2 h-4 w-4" />
                    Disable
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Enable
                  </>
                )}
              </Button>
            </div>

            {isSubscribed && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium mb-3">Notification Preferences</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-medium">Workout Reminders</h5>
                    <p className="text-xs text-muted-foreground">Receive reminders for scheduled workouts</p>
                  </div>
                  <Switch
                    checked={workoutReminders}
                    onCheckedChange={(checked) => handlePreferenceChange("workoutReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-medium">New Content</h5>
                    <p className="text-xs text-muted-foreground">
                      Get notified when new workouts or movements are added
                    </p>
                  </div>
                  <Switch
                    checked={newContent}
                    onCheckedChange={(checked) => handlePreferenceChange("newContent", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-medium">Special Offers</h5>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications about promotions and special offers
                    </p>
                  </div>
                  <Switch
                    checked={specialOffers}
                    onCheckedChange={(checked) => handlePreferenceChange("specialOffers", checked)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      {permissionState === "denied" && (
        <CardFooter className="bg-muted/50 px-6 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
            <p>Notifications are blocked. Please update your browser settings to enable notifications.</p>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

