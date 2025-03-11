import { NextResponse } from "next/server"

// In a real app, you would store subscriptions in a database
const subscriptions: any[] = []

export async function POST(request: Request) {
  try {
    const { subscription } = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 })
    }

    // Find and remove the subscription
    const index = subscriptions.findIndex((sub) => sub.endpoint === subscription.endpoint)

    if (index !== -1) {
      subscriptions.splice(index, 1)
      console.log("Subscription removed:", subscription.endpoint)
    }

    // In a real app, you would remove from a database here

    return NextResponse.json({ success: true, message: "Subscription removed" }, { status: 200 })
  } catch (error) {
    console.error("Error removing subscription:", error)
    return NextResponse.json({ error: "Failed to remove subscription" }, { status: 500 })
  }
}

