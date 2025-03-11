import { NextResponse } from "next/server"

// In a real app, you would store scheduled notifications in a database
const scheduledNotifications: any[] = []

export async function POST(request: Request) {
  try {
    const { scheduledFor, workoutId, title, body, url } = await request.json()

    if (!scheduledFor || !workoutId || !title || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate the scheduled time is in the future
    const scheduledTime = new Date(scheduledFor)
    const now = new Date()

    if (scheduledTime <= now) {
      return NextResponse.json({ error: "Scheduled time must be in the future" }, { status: 400 })
    }

    // In a real app, you would get the user ID from the session
    const userId = "current-user-id"

    // Create the scheduled notification
    const notification = {
      id: `notification-${Date.now()}`,
      userId,
      workoutId,
      title,
      body,
      url: url || `/workout/${workoutId}`,
      scheduledFor: scheduledTime.toISOString(),
      status: "scheduled",
      createdAt: now.toISOString(),
    }

    // Store the scheduled notification
    scheduledNotifications.push(notification)

    // In a real app, you would save to a database and set up a job to send at the scheduled time
    console.log("Notification scheduled:", notification)

    return NextResponse.json(
      {
        success: true,
        message: "Notification scheduled",
        notification: {
          id: notification.id,
          scheduledFor: notification.scheduledFor,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error scheduling notification:", error)
    return NextResponse.json({ error: "Failed to schedule notification" }, { status: 500 })
  }
}

