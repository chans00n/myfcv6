import { NextResponse } from "next/server"
import webpush from "web-push"

// In a real app, these would be environment variables
const VAPID_PUBLIC_KEY = "BLBz-YrPwMdQM5gunpPUEo9TSILGQwRgNN8_Nnxx8eGNpX9-4RKt0bZUOa1VILn-6cHnRNGdbRck_JUzYpXC-8A"
// This is a valid-length placeholder private key (32 bytes when decoded)
const VAPID_PRIVATE_KEY = "8eDyX_uCN8LN-2jNnR0CsAiLqpMCNdxcaKIkUQxVt3Q"
const VAPID_SUBJECT = "mailto:contact@myfc.com"

// Configure web-push only if we have valid keys
let pushServiceConfigured = false
try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  pushServiceConfigured = true
} catch (error) {
  console.error("Failed to configure web-push:", error)
  // Continue without push notification capability
}

// In a real app, you would store subscriptions in a database
const subscriptions: any[] = []

export async function POST(request: Request) {
  try {
    const { title, body, url } = await request.json()

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 })
    }

    // If push service is not configured, return a mock success response
    if (!pushServiceConfigured) {
      return NextResponse.json(
        {
          success: true,
          message: "Push service not configured, but request was valid",
        },
        { status: 200 },
      )
    }

    // In a real app, you would get the user's subscription from the database
    // For this test, we'll use the current user's subscription
    const userId = "current-user-id"
    const userSubscription = subscriptions.find((sub) => sub.userId === userId)

    if (!userSubscription) {
      return NextResponse.json(
        {
          success: true,
          message: "No subscription found, but request was valid",
        },
        { status: 200 },
      )
    }

    // Prepare the notification payload
    const payload = JSON.stringify({
      title,
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/notification-badge.png",
      url: url || "/",
      timestamp: Date.now(),
      actionId: `test-${Date.now()}`,
    })

    // Send the notification
    await webpush.sendNotification(userSubscription, payload)

    return NextResponse.json({ success: true, message: "Test notification sent" }, { status: 200 })
  } catch (error) {
    console.error("Error sending test notification:", error)
    return NextResponse.json({ error: "Failed to send test notification" }, { status: 500 })
  }
}

