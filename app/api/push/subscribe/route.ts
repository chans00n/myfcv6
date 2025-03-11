import { NextResponse } from "next/server"

// In a real app, you would store subscriptions in a database
const subscriptions: any[] = []

export async function POST(request: Request) {
  try {
    const { subscription } = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 })
    }

    // Check if subscription already exists
    const existingIndex = subscriptions.findIndex((sub) => sub.endpoint === subscription.endpoint)

    if (existingIndex !== -1) {
      // Update existing subscription
      subscriptions[existingIndex] = {
        ...subscription,
        updatedAt: new Date().toISOString(),
      }
    } else {
      // Add new subscription
      subscriptions.push({
        ...subscription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    // In a real app, you would save to a database here
    console.log("Subscription saved:", subscription.endpoint)

    return NextResponse.json({ success: true, message: "Subscription saved" }, { status: 200 })
  } catch (error) {
    console.error("Error saving subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}

